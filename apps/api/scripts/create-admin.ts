import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Load env vars natively using node --env-file or TSX env parsing

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials in env.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 12) {
        console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) in the environment.');
        process.exit(1);
    }

    console.log(`Setting up admin user: ${email}`);

    // 1. Try to register with Supabase Auth
    let { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name: 'Admin', role: 'ADMIN' },
        },
    });

    let userId = signUpData?.user?.id;

    if (signUpError) {
        console.log('Registration skipped or failed:', signUpError.message);
        console.log('Attempting to log in to get existing user ID...');

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error('Login failed:', signInError.message);
            return;
        }
        userId = signInData.user?.id;
    }

    if (!userId) {
        console.error('Could not obtain a Subabase User ID.');
        return;
    }

    // Delete any conflicting old seed data
    await prisma.user.deleteMany({
        where: {
            email,
            id: { not: userId }
        }
    });

    // 2. Ensure Prisma has the user as ADMIN
    await prisma.user.upsert({
        where: { id: userId },
        update: {
            role: 'ADMIN',
            name: 'System Admin',
        },
        create: {
            id: userId,
            email,
            name: 'System Admin',
            role: 'ADMIN',
            passwordHash: 'SUPABASE_AUTH_DELEGATED',
        },
    });

    console.log('✅ Admin user successfully set up in Supabase and Prisma!');
    console.log('Credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
