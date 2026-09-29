import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { supabase } from '../lib/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
    createTutorSchema,
    createApplicationSchema,
    importApplicationsSchema,
    updateApplicationSchema,
    updateTicketSchema,
    ticketReplySchema,
    calendarQuerySchema,
} from '../lib/validators.js';
import { z } from 'zod';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// ──────────────────────────────────────────────
// Dashboard Stats
// ──────────────────────────────────────────────

router.get('/dashboard/stats', async (_req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        // Financial
        const [totalRevenueAgg, mrrAgg, failedPayments] = await Promise.all([
            prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
            }),
            prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] }, paidAt: { gte: startOfMonth } },
            }),
            prisma.booking.count({ where: { status: 'PAST_DUE' } }),
        ]);

        // Revenue trend (last 6 months)
        const revenueTrend: { month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const agg = await prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] }, paidAt: { gte: mStart, lt: mEnd } },
            });
            revenueTrend.push({
                month: mStart.toLocaleString('en-GB', { month: 'short', year: '2-digit' }),
                revenue: (agg._sum.amountPaid || 0) / 100,
            });
        }

        // Growth
        const [totalStudents, totalTutors, newStudentsThisMonth, newTutorsThisMonth] = await Promise.all([
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'TUTOR' } }),
            prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: startOfMonth } } }),
            prisma.user.count({ where: { role: 'TUTOR', createdAt: { gte: startOfMonth } } }),
        ]);

        // User growth trend (last 6 months)
        const userGrowthTrend: { month: string; students: number; tutors: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const [stu, tut] = await Promise.all([
                prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: mStart, lt: mEnd } } }),
                prisma.user.count({ where: { role: 'TUTOR', createdAt: { gte: mStart, lt: mEnd } } }),
            ]);
            userGrowthTrend.push({
                month: mStart.toLocaleString('en-GB', { month: 'short', year: '2-digit' }),
                students: stu,
                tutors: tut,
            });
        }

        // Operations
        const [sessionsToday, sessionsCompletedThisMonth, sessionsCancelledThisMonth, pendingApplications, openTickets] = await Promise.all([
            prisma.session.count({ where: { startTime: { gte: startOfDay, lt: endOfDay } } }),
            prisma.session.count({ where: { status: 'COMPLETED', startTime: { gte: startOfMonth } } }),
            prisma.session.count({ where: { status: 'CANCELLED', startTime: { gte: startOfMonth } } }),
            prisma.tutorApplication.count({ where: { status: 'NEW' } }),
            prisma.supportTicket.count({ where: { status: { in: ['NEW', 'IN_PROGRESS'] } } }),
        ]);

        // Recent activity
        const [recentBookings, recentApplications, recentTickets] = await Promise.all([
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } },
            }),
            prisma.tutorApplication.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, applicantName: true, applicantEmail: true, status: true, subjectExpertise: true, createdAt: true },
            }),
            prisma.supportTicket.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } },
            }),
        ]);

        res.json({
            financial: {
                totalRevenue: (totalRevenueAgg._sum.amountPaid || 0) / 100,
                mrr: (mrrAgg._sum.amountPaid || 0) / 100,
                failedPayments,
                revenueTrend,
            },
            growth: {
                totalStudents,
                totalTutors,
                newStudentsThisMonth,
                newTutorsThisMonth,
                userGrowthTrend,
            },
            operations: {
                sessionsToday,
                sessionsCompletedThisMonth,
                sessionsCancelledThisMonth,
                pendingApplications,
                openTickets,
            },
            recentActivity: {
                bookings: recentBookings.map(b => ({
                    id: b.id,
                    userName: b.user.name,
                    tier: b.tier,
                    subject: b.subject,
                    amount: b.amountPaid / 100,
                    status: b.status,
                    date: b.paidAt,
                })),
                applications: recentApplications,
                tickets: recentTickets.map(t => ({
                    id: t.id,
                    subject: t.subject,
                    userName: t.user.name,
                    category: t.category,
                    status: t.status,
                    date: t.createdAt,
                })),
            },
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ──────────────────────────────────────────────
// Users / Tutors / Students
// ──────────────────────────────────────────────

router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;
        const role = req.query.role as string | undefined;
        const search = req.query.search as string | undefined;

        const where: any = {};
        if (role && ['STUDENT', 'TUTOR', 'PARENT', 'ADMIN'].includes(role)) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    tutorProfile: { select: { verificationStatus: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.user.count({ where }),
        ]);

        res.json({ users, total, page });
    } catch (err) {
        console.error('Admin users error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/tutors', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search as string | undefined;
        const verification = req.query.verification as string | undefined;

        const where: any = { role: 'TUTOR' };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (verification && ['PENDING', 'VERIFIED'].includes(verification)) {
            where.tutorProfile = { verificationStatus: verification };
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    tutorProfile: {
                        select: {
                            id: true,
                            bio: true,
                            hourlyRate: true,
                            verificationStatus: true,
                            subjects: {
                                select: { subject: { select: { name: true } } },
                            },
                            _count: { select: { sessions: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            tutors: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt,
                profileId: u.tutorProfile?.id,
                bio: u.tutorProfile?.bio,
                hourlyRate: u.tutorProfile?.hourlyRate,
                verificationStatus: u.tutorProfile?.verificationStatus || 'PENDING',
                subjects: u.tutorProfile?.subjects.map(s => s.subject.name) || [],
                sessionCount: u.tutorProfile?._count?.sessions || 0,
            })),
            total,
            page,
        });
    } catch (err) {
        console.error('Admin tutors error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/tutors/create — Create a new tutor account
router.post('/tutors/create', async (req, res) => {
    try {
        const parsed = createTutorSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const { name, email, password, bio, hourlyRate, subjects, autoVerify } = parsed.data;

        // Create Supabase auth user via admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, role: 'TUTOR' },
        });

        if (authError || !authData.user) {
            res.status(400).json({ error: authError?.message || 'Failed to create auth user' });
            return;
        }

        const supabaseUserId = authData.user.id;

        // Create Prisma user + tutor profile in transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    id: supabaseUserId,
                    email,
                    name,
                    role: 'TUTOR',
                    passwordHash: 'SUPABASE_AUTH_DELEGATED',
                },
            });

            const profile = await tx.tutorProfile.create({
                data: {
                    userId: newUser.id,
                    bio: bio || null,
                    hourlyRate: hourlyRate || null,
                    verificationStatus: autoVerify ? 'VERIFIED' : 'PENDING',
                },
            });

            // Link subjects if provided
            if (subjects && subjects.length > 0) {
                const subjectRecords = await tx.subject.findMany({
                    where: { name: { in: subjects } },
                });
                if (subjectRecords.length > 0) {
                    await tx.tutorSubject.createMany({
                        data: subjectRecords.map(s => ({
                            tutorProfileId: profile.id,
                            subjectId: s.id,
                        })),
                    });
                }
            }

            return newUser;
        });

        res.status(201).json({
            message: 'Tutor account created successfully',
            tutor: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Create tutor error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const verifyTutorSchema = z.object({
    id: z.string().uuid('Invalid tutor profile ID'),
});

// POST /api/admin/tutors/:id/verify
router.post('/tutors/:id/verify', async (req, res) => {
    try {
        const parsed = verifyTutorSchema.safeParse(req.params);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const { id } = parsed.data;

        const profile = await prisma.tutorProfile.findUnique({ where: { id } });
        if (!profile) {
            res.status(404).json({ error: 'Tutor profile not found' });
            return;
        }

        const newStatus = profile.verificationStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
        await prisma.tutorProfile.update({
            where: { id },
            data: { verificationStatus: newStatus },
        });

        res.json({ message: `Tutor ${newStatus === 'VERIFIED' ? 'verified' : 'unverified'}`, status: newStatus });
    } catch (err) {
        console.error('Verify tutor error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/students', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search as string | undefined;

        const where: any = { role: 'STUDENT' };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    studentProfile: {
                        select: {
                            yearGroup: true,
                            targetExams: true,
                            _count: { select: { sessions: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            students: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt,
                yearGroup: u.studentProfile?.yearGroup,
                targetExams: u.studentProfile?.targetExams,
                sessionCount: u.studentProfile?._count?.sessions || 0,
            })),
            total,
            page,
        });
    } catch (err) {
        console.error('Admin students error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ──────────────────────────────────────────────
// Calendar
// ──────────────────────────────────────────────

router.get('/calendar/sessions', async (req, res) => {
    try {
        const parsed = calendarQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const { start, end, tutorId, subjectId } = parsed.data;
        const startDate = new Date(start);
        const endDate = new Date(end);

        const sessionWhere: any = {
            startTime: { gte: startDate },
            endTime: { lte: endDate },
        };
        if (tutorId) sessionWhere.tutorId = tutorId;
        if (subjectId) sessionWhere.subjectId = subjectId;

        const [sessions, tutors, subjects] = await Promise.all([
            prisma.session.findMany({
                where: sessionWhere,
                include: {
                    student: { include: { user: { select: { name: true } } } },
                    tutor: { include: { user: { select: { name: true } } } },
                    subject: { select: { name: true } },
                },
                orderBy: { startTime: 'asc' },
            }),
            prisma.tutorProfile.findMany({
                include: { user: { select: { name: true } } },
            }),
            prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
        ]);

        // Get availability for all tutors (or filtered tutor)
        const availWhere: any = {};
        if (tutorId) availWhere.tutorProfileId = tutorId;

        const availability = await prisma.tutorAvailability.findMany({
            where: availWhere,
            include: { tutorProfile: { include: { user: { select: { name: true } } } } },
        });

        res.json({
            sessions: sessions.map(s => ({
                id: s.id,
                studentName: s.student.user.name,
                tutorName: s.tutor.user.name,
                subject: s.subject.name,
                startTime: s.startTime,
                endTime: s.endTime,
                status: s.status,
                meetingLink: s.meetingLink || s.zoomJoinUrl,
            })),
            availability: availability.map(a => ({
                tutorName: a.tutorProfile.user.name,
                tutorId: a.tutorProfileId,
                dayOfWeek: a.dayOfWeek,
                startTime: a.startTime,
                endTime: a.endTime,
            })),
            tutors: tutors.map(t => ({ id: t.id, name: t.user.name })),
            subjects,
        });
    } catch (err) {
        console.error('Calendar sessions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ──────────────────────────────────────────────
// Payments
// ──────────────────────────────────────────────

router.get('/payments', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;

        const where: any = {};
        if (status && ['ACTIVE', 'PAST_DUE', 'CANCELLED', 'COMPLETED'].includes(status)) {
            where.status = status;
        }
        if (search) {
            where.user = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }

        const [payments, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.booking.count({ where }),
        ]);

        res.json({
            payments: payments.map(p => ({
                id: p.id,
                userName: p.user.name,
                userEmail: p.user.email,
                tier: p.tier,
                subject: p.subject,
                amountPaid: p.amountPaid / 100,
                currency: p.currency,
                status: p.status,
                paidAt: p.paidAt,
                stripeSessionId: p.stripeSessionId,
            })),
            total,
            page,
        });
    } catch (err) {
        console.error('Admin payments error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/payments/stats', async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalRevenueAgg, mrrAgg, failedPayments, revenueByTier, revenueBySubject] = await Promise.all([
            prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
            }),
            prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] }, paidAt: { gte: startOfMonth } },
            }),
            prisma.booking.count({ where: { status: 'PAST_DUE' } }),
            prisma.booking.groupBy({
                by: ['tier'],
                _sum: { amountPaid: true },
                _count: true,
                where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
            }),
            prisma.booking.groupBy({
                by: ['subject'],
                _sum: { amountPaid: true },
                _count: true,
                where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
            }),
        ]);

        // Revenue trend (last 6 months)
        const revenueTrend: { month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const agg = await prisma.booking.aggregate({
                _sum: { amountPaid: true },
                where: { status: { in: ['ACTIVE', 'COMPLETED'] }, paidAt: { gte: mStart, lt: mEnd } },
            });
            revenueTrend.push({
                month: mStart.toLocaleString('en-GB', { month: 'short', year: '2-digit' }),
                revenue: (agg._sum.amountPaid || 0) / 100,
            });
        }

        res.json({
            totalRevenue: (totalRevenueAgg._sum.amountPaid || 0) / 100,
            mrr: (mrrAgg._sum.amountPaid || 0) / 100,
            failedPayments,
            revenueTrend,
            revenueByTier: revenueByTier.map(r => ({
                tier: r.tier,
                revenue: (r._sum.amountPaid || 0) / 100,
                count: r._count,
            })),
            revenueBySubject: revenueBySubject.map(r => ({
                subject: r.subject,
                revenue: (r._sum.amountPaid || 0) / 100,
                count: r._count,
            })),
        });
    } catch (err) {
        console.error('Payment stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ──────────────────────────────────────────────
// Tutor Applications
// ──────────────────────────────────────────────

// GET /api/admin/applications — supports kanban all-mode
router.get('/applications', async (req, res) => {
    try {
        const allMode = req.query.all === 'true';
        const includeRejected = req.query.includeRejected === 'true';
        const status = req.query.status as string | undefined;

        const where: any = {};

        if (allMode && !includeRejected) {
            where.status = { not: 'REJECTED' };
        } else if (status && ['NEW', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'].includes(status)) {
            where.status = status;
        }

        if (allMode) {
            const applications = await prisma.tutorApplication.findMany({
                where,
                include: { reviewer: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
            });
            const total = applications.length;
            res.json({ applications, total, page: 1 });
        } else {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const [applications, total] = await Promise.all([
                prisma.tutorApplication.findMany({
                    where,
                    include: { reviewer: { select: { name: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip,
                }),
                prisma.tutorApplication.count({ where }),
            ]);
            res.json({ applications, total, page });
        }
    } catch (err) {
        console.error('Admin applications error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/applications — create a single application
router.post('/applications', async (req, res) => {
    try {
        const parsed = createApplicationSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const application = await prisma.tutorApplication.create({
            data: {
                ...parsed.data,
                cvUrl: parsed.data.cvUrl || null,
                coverLetter: parsed.data.coverLetter || null,
                phone: parsed.data.phone || null,
            },
        });

        res.status(201).json({ application });
    } catch (err) {
        console.error('Create application error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/applications/import — bulk import from CSV (JSON array)
router.post('/applications/import', async (req, res) => {
    try {
        const parsed = importApplicationsSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const created = await prisma.tutorApplication.createMany({
            data: parsed.data.map(a => ({
                ...a,
                cvUrl: a.cvUrl || null,
                coverLetter: a.coverLetter || null,
                phone: a.phone || null,
            })),
        });

        res.status(201).json({ count: created.count });
    } catch (err) {
        console.error('Import applications error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/applications/:id', async (req, res) => {
    try {
        const application = await prisma.tutorApplication.findUnique({
            where: { id: req.params.id },
            include: { reviewer: { select: { id: true, name: true, email: true } } },
        });

        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        res.json({ application });
    } catch (err) {
        console.error('Get application error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/admin/applications/:id — update + optional verify (auto-create tutor)
router.patch('/applications/:id', async (req, res) => {
    try {
        const parsed = updateApplicationSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const existing = await prisma.tutorApplication.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        const data: any = {};
        if (parsed.data.status) data.status = parsed.data.status;
        if (parsed.data.reviewerId) data.reviewerId = parsed.data.reviewerId;
        if (parsed.data.interviewNotes !== undefined) data.interviewNotes = parsed.data.interviewNotes;
        if (parsed.data.interviewDate) data.interviewDate = new Date(parsed.data.interviewDate);
        if (parsed.data.rejectionReason !== undefined) data.rejectionReason = parsed.data.rejectionReason;

        const application = await prisma.tutorApplication.update({
            where: { id: req.params.id },
            data,
            include: { reviewer: { select: { name: true } } },
        });

        // If verify flag is set, auto-create the tutor account
        let tutorCreated = null;
        if (parsed.data.verify && (parsed.data.status === 'ACCEPTED' || existing.status === 'ACCEPTED')) {
            try {
                // Generate a temporary password
                const tempPassword = `Tutor${Date.now().toString(36).slice(-6)}!`;

                // Create Supabase auth user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: existing.applicantEmail,
                    password: tempPassword,
                    options: { data: { name: existing.applicantName, role: 'TUTOR' } },
                });

                if (!authError && authData.user) {
                    const supabaseUserId = authData.user.id;

                    // Create Prisma User + TutorProfile in transaction
                    await prisma.$transaction(async (tx) => {
                        await tx.user.create({
                            data: {
                                id: supabaseUserId,
                                email: existing.applicantEmail,
                                name: existing.applicantName,
                                role: 'TUTOR',
                                passwordHash: 'SUPABASE_AUTH_DELEGATED',
                            },
                        });

                        const profile = await tx.tutorProfile.create({
                            data: {
                                userId: supabaseUserId,
                                bio: existing.experience,
                                verificationStatus: 'VERIFIED',
                            },
                        });

                        // Link subjects from application
                        if (existing.subjectExpertise.length > 0) {
                            const subjectRecords = await tx.subject.findMany({
                                where: { name: { in: existing.subjectExpertise } },
                            });
                            if (subjectRecords.length > 0) {
                                await tx.tutorSubject.createMany({
                                    data: subjectRecords.map(s => ({
                                        tutorProfileId: profile.id,
                                        subjectId: s.id,
                                    })),
                                });
                            }
                        }
                    });

                    tutorCreated = { email: existing.applicantEmail, tempPassword };
                }
            } catch (verifyErr) {
                console.error('Auto-verify tutor error:', verifyErr);
                // Don't fail the whole request — the application status was already updated
            }
        }

        res.json({ application, tutorCreated });
    } catch (err) {
        console.error('Update application error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ──────────────────────────────────────────────
// Support Tickets
// ──────────────────────────────────────────────

router.get('/tickets', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status as string | undefined;
        const category = req.query.category as string | undefined;

        const where: any = {};
        if (status && ['NEW', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
            where.status = status;
        }
        if (category && ['PAYMENTS', 'SCHEDULING', 'TUTOR_ISSUES', 'TECHNICAL', 'GENERAL'].includes(category)) {
            where.category = category;
        }

        const [tickets, total] = await Promise.all([
            prisma.supportTicket.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true } },
                    assignee: { select: { name: true } },
                    _count: { select: { replies: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.supportTicket.count({ where }),
        ]);

        res.json({
            tickets: tickets.map(t => ({
                id: t.id,
                subject: t.subject,
                body: t.body,
                category: t.category,
                status: t.status,
                userName: t.user.name,
                userEmail: t.user.email,
                assigneeName: t.assignee?.name || null,
                replyCount: t._count.replies,
                createdAt: t.createdAt,
                resolvedAt: t.resolvedAt,
            })),
            total,
            page,
        });
    } catch (err) {
        console.error('Admin tickets error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assignee: { select: { id: true, name: true } },
                replies: {
                    include: { user: { select: { name: true, role: true } } },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        res.json({ ticket });
    } catch (err) {
        console.error('Get ticket error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/tickets/:id', async (req, res) => {
    try {
        const parsed = updateTicketSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const existing = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        const data: any = {};
        if (parsed.data.status) {
            data.status = parsed.data.status;
            if (parsed.data.status === 'RESOLVED') data.resolvedAt = new Date();
        }
        if (parsed.data.assigneeId !== undefined) data.assigneeId = parsed.data.assigneeId;
        if (parsed.data.category) data.category = parsed.data.category;

        const ticket = await prisma.supportTicket.update({
            where: { id: req.params.id },
            data,
            include: {
                user: { select: { name: true, email: true } },
                assignee: { select: { name: true } },
            },
        });

        res.json({ ticket });
    } catch (err) {
        console.error('Update ticket error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/tickets/:id/reply', async (req, res) => {
    try {
        const parsed = ticketReplySchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        const reply = await prisma.ticketReply.create({
            data: {
                ticketId: req.params.id,
                userId: req.user!.userId,
                body: parsed.data.body,
            },
            include: { user: { select: { name: true, role: true } } },
        });

        // Auto-set ticket status to IN_PROGRESS if it was NEW
        if (ticket.status === 'NEW') {
            await prisma.supportTicket.update({
                where: { id: req.params.id },
                data: { status: 'IN_PROGRESS' },
            });
        }

        res.status(201).json({ reply });
    } catch (err) {
        console.error('Ticket reply error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
