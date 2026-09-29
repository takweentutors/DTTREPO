import { PrismaClient, Role, SessionStatus, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // ── SECURITY: Never seed a production database ──
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ REFUSING TO SEED: NODE_ENV is "production".');
        console.error('   Seeding creates accounts with weak passwords and must never run in production.');
        process.exit(1);
    }

    console.log('🌱 Seeding database...');
    console.warn('⚠️  WARNING: These accounts use weak passwords and are for DEVELOPMENT ONLY.');
    // Clean existing data
    await prisma.progress.deleteMany();
    await prisma.message.deleteMany();
    await prisma.session.deleteMany();
    await prisma.tutorSubject.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.tutorProfile.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create users
    const studentUser = await prisma.user.create({
        data: {
            email: 'alex@student.letsgotutors.com',
            passwordHash,
            name: 'Alex Rivera',
            role: Role.STUDENT,
            studentProfile: {
                create: {
                    yearGroup: 'Year 11',
                    targetExams: 'GCSE Mathematics, GCSE Biology',
                    timezone: 'Europe/London',
                },
            },
        },
        include: { studentProfile: true },
    });

    const tutorUser = await prisma.user.create({
        data: {
            email: 'rasha@tutor.letsgotutors.com',
            passwordHash,
            name: 'Dr. Rasha Aziz',
            role: Role.TUTOR,
            tutorProfile: {
                create: {
                    bio: 'PhD in Mathematics. With over 15 years of teaching experience, I specialise in helping students build confidence and master exam techniques.',
                    hourlyRate: 45,
                    verificationStatus: VerificationStatus.VERIFIED,
                },
            },
        },
        include: { tutorProfile: true },
    });

    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@letsgotutors.com',
            passwordHash,
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });

    // Create subjects
    const mathSubject = await prisma.subject.create({
        data: { name: 'GCSE Mathematics' },
    });

    const physicsSubject = await prisma.subject.create({
        data: { name: 'A-Level Physics' },
    });

    const biologySubject = await prisma.subject.create({
        data: { name: 'GCSE Biology' },
    });

    // Link tutor to subjects
    await prisma.tutorSubject.createMany({
        data: [
            { tutorProfileId: tutorUser.tutorProfile!.id, subjectId: mathSubject.id },
            { tutorProfileId: tutorUser.tutorProfile!.id, subjectId: physicsSubject.id },
        ],
    });

    // Create sessions
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(16, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(17, 0, 0, 0);

    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    lastWeek.setHours(15, 0, 0, 0);
    const lastWeekEnd = new Date(lastWeek);
    lastWeekEnd.setHours(16, 0, 0, 0);

    await prisma.session.create({
        data: {
            studentId: studentUser.studentProfile!.id,
            tutorId: tutorUser.tutorProfile!.id,
            subjectId: mathSubject.id,
            startTime: tomorrow,
            endTime: tomorrowEnd,
            status: SessionStatus.UPCOMING,
            meetingLink: '/classroom/session-1',
        },
    });

    await prisma.session.create({
        data: {
            studentId: studentUser.studentProfile!.id,
            tutorId: tutorUser.tutorProfile!.id,
            subjectId: mathSubject.id,
            startTime: lastWeek,
            endTime: lastWeekEnd,
            status: SessionStatus.COMPLETED,
            notes: 'Reviewed algebra II concepts. Student showed good progress.',
        },
    });

    // Create messages
    const messages = [
        { from: tutorUser.id, to: studentUser.id, body: 'Hi Alex, are you ready for our upcoming session on Algebra?' },
        { from: studentUser.id, to: tutorUser.id, body: "Hi Dr. Rasha! Yes, I've been reviewing the notes you sent." },
        { from: tutorUser.id, to: studentUser.id, body: 'Excellent. Please remember to bring your calculator for the session.' },
        { from: studentUser.id, to: tutorUser.id, body: 'Will do! Thank you for the reminder.' },
        { from: tutorUser.id, to: studentUser.id, body: 'Great, see you tomorrow at 4pm!' },
    ];

    for (let i = 0; i < messages.length; i++) {
        const createdAt = new Date(now);
        createdAt.setMinutes(createdAt.getMinutes() - (messages.length - i) * 15);
        await prisma.message.create({
            data: {
                fromUserId: messages[i].from,
                toUserId: messages[i].to,
                body: messages[i].body,
                createdAt,
            },
        });
    }

    // Create progress records
    await prisma.progress.createMany({
        data: [
            { studentId: studentUser.studentProfile!.id, subjectId: mathSubject.id, metricType: 'quiz', value: 85, recordedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
            { studentId: studentUser.studentProfile!.id, subjectId: mathSubject.id, metricType: 'homework', value: 92, recordedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
            { studentId: studentUser.studentProfile!.id, subjectId: biologySubject.id, metricType: 'attendance', value: 100, recordedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
        ],
    });

    console.log('✅ Seed complete!');
    console.log('');
    console.log('Test accounts:');
    console.log('  Student: alex@student.letsgotutors.com / password123');
    console.log('  Tutor:   rasha@tutor.letsgotutors.com / password123');
    console.log('  Admin:   admin@letsgotutors.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
