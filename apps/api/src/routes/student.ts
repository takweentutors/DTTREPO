import { Router } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createSessionSchema, updateProfileSchema, sendMessageSchema } from '../lib/validators.js';
import { createZoomMeeting } from '../lib/zoom.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')[0].trim();

// Cache portal configuration ID in memory to avoid re-creating on every request
let portalConfigId: string | null = null;

// All student routes require authentication + STUDENT role
router.use(authenticate, requireRole('STUDENT'));

// GET /api/student/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: req.user!.userId },
        });

        if (!studentProfile) {
            res.status(404).json({ error: 'Student profile not found' });
            return;
        }

        // 1. Upcoming Sessions (paginated)
        const sessions = await prisma.session.findMany({
            where: {
                studentId: studentProfile.id,
                status: 'UPCOMING',
                startTime: { gte: new Date() },
            },
            include: {
                tutor: { include: { user: { select: { name: true } } } },
                subject: true,
            },
            orderBy: { startTime: 'asc' },
            take: limit,
            skip,
        });

        // 2. Recent Progress metrics (paginated)
        const progress = await prisma.progress.findMany({
            where: { studentId: studentProfile.id },
            include: { subject: true },
            orderBy: { recordedAt: 'desc' },
            take: limit,
            skip,
        });

        // 3. Latest Messages (paginated)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { toUserId: req.user!.userId },
                    { fromUserId: req.user!.userId },
                ],
            },
            include: {
                fromUser: { select: { id: true, name: true, role: true } },
                toUser: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        });

        // Completed sessions count
        const completedCount = await prisma.session.count({
            where: { studentId: studentProfile.id, status: 'COMPLETED' },
        });

        res.json({
            sessions: sessions.map((s) => ({
                id: s.id,
                subject: s.subject.name,
                tutorName: s.tutor.user.name,
                startTime: s.startTime,
                endTime: s.endTime,
                status: s.status,
                meetingLink: s.meetingLink,
                zoomMeetingId: s.zoomMeetingId,
                zoomJoinUrl: s.zoomJoinUrl,
            })),
            progress: progress.map((p) => ({
                id: p.id,
                subject: p.subject.name,
                metricType: p.metricType,
                value: p.value,
                recordedAt: p.recordedAt,
            })),
            messages: messages.map((m) => ({
                id: m.id,
                fromUser: m.fromUser,
                toUser: m.toUser,
                body: m.body,
                createdAt: m.createdAt,
                isMe: m.fromUserId === req.user!.userId,
            })),
            stats: {
                upcomingSessions: sessions.length,
                completedSessions: completedCount,
                activeSubjects: new Set(sessions.map((s) => s.subjectId)).size,
            },
        });
    } catch (err) {
        console.error('Student dashboard error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/student/sessions
router.post('/sessions', async (req, res) => {
    try {
        const parsed = createSessionSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: req.user!.userId },
        });

        if (!studentProfile) {
            res.status(404).json({ error: 'Student profile not found' });
            return;
        }

        const { tutorId, subjectId, startTime, endTime } = parsed.data;

        // Verify tutor exists
        const tutor = await prisma.tutorProfile.findUnique({ where: { id: tutorId } });
        if (!tutor) {
            res.status(404).json({ error: 'Tutor not found' });
            return;
        }

        // --- Create the DB session first ---
        let session = await prisma.session.create({
            data: {
                studentId: studentProfile.id,
                tutorId,
                subjectId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: 'UPCOMING',
            },
            include: {
                tutor: { include: { user: { select: { name: true } } } },
                student: { include: { user: { select: { name: true } } } },
                subject: true,
            },
        });

        // --- Auto-create a Zoom meeting ---
        try {
            const durationMin = Math.round(
                (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000,
            );
            const topic = `${session.tutor.user.name} – ${session.student.user.name} – ${session.subject.name}`;

            const zoom = await createZoomMeeting(topic, new Date(startTime).toISOString(), durationMin);

            session = await prisma.session.update({
                where: { id: session.id },
                data: {
                    zoomMeetingId: zoom.id,
                    zoomJoinUrl: zoom.join_url,
                    zoomPassword: zoom.password ?? null,
                    meetingLink: zoom.join_url, // keep legacy field in sync
                },
                include: {
                    tutor: { include: { user: { select: { name: true } } } },
                    student: { include: { user: { select: { name: true } } } },
                    subject: true,
                },
            });
        } catch (zoomErr: any) {
            // Log but don't fail the booking – the session still exists without Zoom.
            // We surface zoomPending=true so the frontend can warn the student.
            console.error('Zoom meeting creation failed (session still created):', zoomErr?.message || zoomErr);
        }

        const zoomPending = !session.zoomJoinUrl;

        res.status(201).json({
            session: {
                id: session.id,
                subject: session.subject.name,
                tutorName: session.tutor.user.name,
                startTime: session.startTime,
                endTime: session.endTime,
                status: session.status,
                zoomMeetingId: session.zoomMeetingId,
                zoomJoinUrl: session.zoomJoinUrl,
            },
            zoomPending,
            message: zoomPending
                ? 'Session booked successfully. A Zoom link will be generated and sent to you shortly.'
                : 'Session booked successfully.',
        });
    } catch (err) {
        console.error('Create session error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/student/billing
router.get('/billing', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Fetch user's bookings (history + active)
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        });

        // Map to format expected by frontend
        const history = bookings.map(b => ({
            id: b.id,
            tier: b.tier,
            subject: b.subject,
            amount: b.amountPaid / 100,
            currency: b.currency,
            status: b.status,
            date: b.paidAt,
            paymentIntentId: b.stripePaymentIntentId,
        }));

        res.json({ history });
    } catch (err) {
        console.error('Student billing error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/student/billing-portal
// Creates a Stripe Billing Portal session so the student can manage subscriptions
router.post('/billing-portal', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
        });

        if (!user || !(user as any).stripeCustomerId) {
            res.json({
                error: "You haven't made any transactions yet. Once you purchase a tuition plan, you'll be able to manage your billing, download invoices, and switch plans here."
            });
            return;
        }

        // Use portal config from env (created by scripts/setup-stripe.ts), or find existing default
        if (!portalConfigId) {
            portalConfigId = process.env.STRIPE_PORTAL_CONFIG_ID || null;

            if (!portalConfigId) {
                try {
                    const configs = await stripe.billingPortal.configurations.list({ limit: 1, is_default: true });
                    if (configs.data.length > 0) {
                        portalConfigId = configs.data[0].id;
                    }
                } catch (configErr: any) {
                    console.warn('Could not find portal config:', configErr.message);
                }
            }
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: (user as any).stripeCustomerId,
            return_url: `${FRONTEND_URL}/dashboard/billing`,
            ...(portalConfigId ? { configuration: portalConfigId } : {}),
        });

        res.json({ url: portalSession.url });
    } catch (err: any) {
        console.error('Billing portal error:', err.message || err);
        res.status(500).json({ error: 'Failed to open billing portal. Please try again.' });
    }
});

// PATCH /api/student/profile
router.patch('/profile', async (req, res) => {
    try {
        const parsed = updateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }
        const data: Record<string, unknown> = {};
        if (parsed.data.name) data.name = parsed.data.name;

        const user = await prisma.user.update({
            where: { id: req.user!.userId },
            data,
            select: { id: true, email: true, name: true, role: true },
        });
        res.json({ user });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/student/tutors — List verified tutors (optionally filtered by subject)
router.get('/tutors', async (req, res) => {
    try {
        const subject = req.query.subject as string | undefined;

        const tutors = await prisma.tutorProfile.findMany({
            where: { verificationStatus: 'VERIFIED' },
            include: {
                user: { select: { name: true } },
                subjects: { include: { subject: true } },
            },
        });

        const filtered = subject
            ? tutors.filter(t => t.subjects.some(s => s.subject.name.toLowerCase().includes(subject.toLowerCase())))
            : tutors;

        res.json({
            tutors: filtered.map(t => ({
                id: t.id,
                name: t.user.name,
                bio: t.bio,
                hourlyRate: t.hourlyRate,
                subjects: t.subjects.map(s => s.subject.name),
                verificationStatus: t.verificationStatus,
            })),
        });
    } catch (err) {
        console.error('Tutors list error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/student/messages — Conversations grouped by other user
router.get('/messages', async (req, res) => {
    try {
        const userId = req.user!.userId;
        const messages = await prisma.message.findMany({
            where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
            include: {
                fromUser: { select: { id: true, name: true, role: true } },
                toUser: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Group into conversations by the other party
        const convos = new Map<string, { contact: { id: string; name: string; role: string }; messages: typeof messages; lastMessage: Date }>();
        for (const m of messages) {
            const other = m.fromUserId === userId ? m.toUser : m.fromUser;
            if (!convos.has(other.id)) {
                convos.set(other.id, { contact: other, messages: [], lastMessage: m.createdAt });
            }
            convos.get(other.id)!.messages.push(m);
        }

        res.json({
            conversations: Array.from(convos.values())
                .sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime())
                .map(c => ({
                    contact: c.contact,
                    lastMessage: c.messages[0]?.body || '',
                    lastMessageAt: c.messages[0]?.createdAt,
                    unreadCount: c.messages.filter(m => m.toUserId === userId && !m.readAt).length,
                })),
        });
    } catch (err) {
        console.error('Messages list error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/student/messages/:userId — Thread with a specific user
router.get('/messages/:userId', async (req, res) => {
    try {
        const userId = req.user!.userId;
        const otherId = req.params.userId;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { fromUserId: userId, toUserId: otherId },
                    { fromUserId: otherId, toUserId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });

        // Mark unread messages as read
        await prisma.message.updateMany({
            where: { fromUserId: otherId, toUserId: userId, readAt: null },
            data: { readAt: new Date() },
        });

        res.json({
            messages: messages.map(m => ({
                id: m.id,
                body: m.body,
                isMe: m.fromUserId === userId,
                createdAt: m.createdAt,
            })),
        });
    } catch (err) {
        console.error('Message thread error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/student/messages — Send a message
router.post('/messages', async (req, res) => {
    try {
        const parsed = sendMessageSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }
        const message = await prisma.message.create({
            data: {
                fromUserId: req.user!.userId,
                toUserId: parsed.data.toUserId,
                body: parsed.data.body,
            },
        });
        res.status(201).json({ message: { id: message.id, body: message.body, createdAt: message.createdAt } });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
