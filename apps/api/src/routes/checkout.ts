import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { rateLimit } from '../middleware/rateLimit.js';
import { authenticate } from '../middleware/auth.js';
import { computeCheckoutPrice } from '../lib/pricing.js';
import prisma from '../lib/prisma.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')[0].trim();

// ── Map tier+level to env var key for pre-created Stripe Price IDs ──
const LEVEL_ENV_MAP: Record<string, string> = {
    '11-plus': '11PLUS',
    'gcse': 'GCSE',
    'a-level': 'ALEVEL',
    'btec': 'BTEC',
};

function getStripePriceId(tier: string, level: string): string | undefined {
    const levelEnv = LEVEL_ENV_MAP[level];
    if (!levelEnv) return undefined;
    const tierEnv = tier.toUpperCase().replace(/-/g, '_');
    const envKey = `STRIPE_PRICE_${levelEnv}_${tierEnv}`;
    return process.env[envKey];
}

// ── SECURITY: Rate-limit checkout to prevent Stripe session abuse ──
router.use(rateLimit(20, 60_000));

const checkoutSchema = z.object({
    tier: z.enum(['platinum-path', 'gold-edge', 'silver-advantage', 'bronze-boost', 'foundational-fixes', 'foundational-focus']),
    level: z.enum(['gcse', 'a-level', '11-plus', 'btec']),
    sessionMinutes: z.coerce.number().int().refine(v => [60, 90, 120].includes(v), { message: 'Session must be 60, 90, or 120 minutes' }),
    sessionsPerWeek: z.coerce.number().int().min(1).max(7),
    subject: z.string().optional(),
    studentId: z.string().uuid().optional(),
});

/**
 * POST /api/checkout/create-session
 * Creates a Stripe Checkout Session using pre-created Price IDs (or dynamic fallback).
 */
router.post('/create-session', authenticate, async (req, res) => {
    try {
        const parsed = checkoutSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }

        const { tier, level, sessionMinutes, sessionsPerWeek, subject, studentId } = parsed.data;
        const userId = req.user!.userId;

        // ── Just-In-Time Stripe Customer Creation ──
        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let stripeCustomerId = (user as any).stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id },
            });
            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId } as any,
            });
        }

        // ── Build line items: prefer pre-created Price ID, fallback to dynamic ──
        const stripePriceId = getStripePriceId(tier, level);
        const pricing = computeCheckoutPrice({ tier, level, sessionMinutes: Number(sessionMinutes), sessionsPerWeek: Number(sessionsPerWeek) });

        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = stripePriceId
            ? { price: stripePriceId, quantity: pricing.quantity }
            : {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: pricing.productName,
                        description: pricing.productDescription,
                    },
                    unit_amount: pricing.unitAmountPence,
                    recurring: { interval: 'month' },
                },
                quantity: pricing.quantity,
            };

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [lineItem],
            mode: 'subscription',
            success_url: `${FRONTEND_URL}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/subjects`,
            metadata: {
                tier: tier || '',
                level: level || '',
                sessionMinutes: String(sessionMinutes),
                sessionsPerWeek: String(sessionsPerWeek),
                subject: subject || '',
                userId,
                studentId: studentId || userId,
            },
        });

        res.json({ url: session.url });
    } catch (error: any) {
        // SECURITY: Never leak Stripe internal errors to the client
        console.error('Stripe create-session error:', error.message);
        res.status(500).json({ error: 'Payment processing failed. Please try again or contact support.' });
    }
});

/**
 * GET /api/checkout/session-status?session_id=cs_xxx
 * Returns session status and payment details.
 */
router.get('/session-status', authenticate, async (req, res) => {
    try {
        const sessionId = req.query.session_id as string;
        if (!sessionId || !/^cs_/.test(sessionId)) {
            return res.status(400).json({ error: 'Valid session_id is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });

        const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;

        res.json({
            status: session.status,
            payment_status: session.payment_status,
            payment_intent_id: paymentIntent?.id || null,
            payment_intent_status: paymentIntent?.status || null,
        });
    } catch (error: any) {
        // SECURITY: Never leak Stripe internal errors to the client
        console.error('Stripe session-status error:', error.message);
        res.status(500).json({ error: 'Unable to retrieve payment status. Please try again.' });
    }
});

export default router;
