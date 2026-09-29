import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address').max(255, 'Email is too long'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password must be 72 characters or fewer')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['STUDENT', 'TUTOR'], { message: 'Role must be STUDENT or TUTOR' }),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required').max(72, 'Password must be 72 characters or fewer'),
});

export const createSessionSchema = z.object({
    tutorId: z.string().uuid(),
    subjectId: z.string().uuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
});

export const addSubjectSchema = z.object({
    subjectId: z.string().uuid(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').optional(),
});

export const createProgressSchema = z.object({
    studentProfileId: z.string().uuid(),
    subjectId: z.string().uuid(),
    metricType: z.string().min(1).max(100),
    value: z.number().min(0).max(100),
});

export const sendMessageSchema = z.object({
    toUserId: z.string().uuid(),
    body: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
});

// Admin validators

export const createTutorSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(72),
    bio: z.string().max(2000).optional(),
    hourlyRate: z.number().positive().optional(),
    subjects: z.array(z.string()).optional(),
    autoVerify: z.boolean().default(false),
});

export const createApplicationSchema = z.object({
    applicantName: z.string().min(2, 'Name is required').max(100),
    applicantEmail: z.string().email('Invalid email'),
    phone: z.string().max(30).optional(),
    education: z.string().min(1, 'Education is required').max(2000),
    experience: z.string().min(1, 'Experience is required').max(2000),
    subjectExpertise: z.array(z.string()).default([]),
    availability: z.string().min(1, 'Availability is required').max(1000),
    cvUrl: z.string().url().optional().or(z.literal('')),
    coverLetter: z.string().max(5000).optional(),
});

export const importApplicationsSchema = z.array(createApplicationSchema).max(100);

export const updateApplicationSchema = z.object({
    status: z.enum(['NEW', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED']).optional(),
    verify: z.boolean().optional(),
    reviewerId: z.string().uuid().optional(),
    interviewNotes: z.string().max(5000).optional(),
    interviewDate: z.string().datetime().optional(),
    rejectionReason: z.string().max(1000).optional(),
});

export const updateTicketSchema = z.object({
    status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED']).optional(),
    assigneeId: z.string().uuid().nullable().optional(),
    category: z.enum(['PAYMENTS', 'SCHEDULING', 'TUTOR_ISSUES', 'TECHNICAL', 'GENERAL']).optional(),
});

export const ticketReplySchema = z.object({
    body: z.string().min(1, 'Reply cannot be empty').max(5000, 'Reply is too long'),
});

export const calendarQuerySchema = z.object({
    start: z.string(),
    end: z.string(),
    tutorId: z.string().uuid().optional(),
    subjectId: z.string().uuid().optional(),
});
