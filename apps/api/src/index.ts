import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import tutorRoutes from './routes/tutor.js';
import parentRoutes from './routes/parent.js';
import adminRoutes from './routes/admin.js';
import checkoutRoutes from './routes/checkout.js';
import zoomRoutes from './routes/zoom.js';
import stripeWebhookRoutes from './routes/stripe-webhook.js';
import aiRoutes from './routes/ai.js';

const app = express();
// Comma-separated list, e.g. "https://letsgotutors.com,https://www.letsgotutors.com"
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',').map((o) => o.trim()).filter(Boolean);

// Behind Railway/Vercel's proxy: use X-Forwarded-For so rate limits key on the real client IP
app.set('trust proxy', 1);

// Security headers (CSP, X-Frame-Options, HSTS, etc.)
app.use(helmet());

// CORS
app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
}));

// Stripe webhook needs raw body BEFORE json parsing
app.use('/api/checkout', stripeWebhookRoutes);

// Body parsing with size limits to prevent payload abuse
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// CSRF protection: Require X-Requested-With header on state-changing requests
app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        // Exempt Stripe webhook (needs raw POST without custom headers) and Zoom webhook
        if (req.path.startsWith('/api/checkout/webhook') || req.path.startsWith('/api/zoom/webhook')) {
            return next();
        }
        if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
            return res.status(403).json({ error: 'Forbidden' });
        }
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Export for Vercel Serverless ──
export default app;

// ── Local dev server (only when run directly) ──
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    const PORT = parseInt(process.env.PORT || '4000', 10);
    app.listen(PORT, () => {
        console.log(`🚀 API server running on http://localhost:${PORT}`);
    });
}
