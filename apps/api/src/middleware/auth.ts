import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';
import prisma from '../lib/prisma.js';

const SELF_SERVE_ROLES = ['STUDENT', 'TUTOR', 'PARENT'];

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                email?: string;
            };
        }
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        // getUser automatically verifies the token signature and expiration
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Supabase Auth error:', error?.message);
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        // Role comes from the database, never from user_metadata: Supabase lets
        // users edit their own user_metadata, so trusting it allows self-promotion
        // to ADMIN. For users not yet synced, metadata may only pick a self-serve role.
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
        });
        const requestedRole = String(user.user_metadata?.role || '').toUpperCase();
        const role = dbUser?.role
            ?? (SELF_SERVE_ROLES.includes(requestedRole) ? requestedRole : 'STUDENT');

        req.user = {
            userId: user.id,
            role,
            email: user.email,
        };

        next();
    } catch (err) {
        console.error('Unexpected Auth Middleware error:', err);
        res.status(401).json({ error: 'Authentication failed' });
    }
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }

        next();
    };
}
