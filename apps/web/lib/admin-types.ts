// Admin Dashboard TypeScript Types

export interface DashboardStats {
    financial: {
        totalRevenue: number;
        mrr: number;
        failedPayments: number;
        revenueTrend: { month: string; revenue: number }[];
    };
    growth: {
        totalStudents: number;
        totalTutors: number;
        newStudentsThisMonth: number;
        newTutorsThisMonth: number;
        userGrowthTrend: { month: string; students: number; tutors: number }[];
    };
    operations: {
        sessionsToday: number;
        sessionsCompletedThisMonth: number;
        sessionsCancelledThisMonth: number;
        pendingApplications: number;
        openTickets: number;
    };
    recentActivity: {
        bookings: {
            id: string;
            userName: string;
            tier: string;
            subject: string;
            amount: number;
            status: string;
            date: string;
        }[];
        applications: {
            id: string;
            applicantName: string;
            applicantEmail: string;
            status: string;
            subjectExpertise: string[];
            createdAt: string;
        }[];
        tickets: {
            id: string;
            subject: string;
            userName: string;
            category: string;
            status: string;
            date: string;
        }[];
    };
}

export interface AdminTutor {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    profileId?: string;
    bio?: string;
    hourlyRate?: number;
    verificationStatus: 'PENDING' | 'VERIFIED';
    subjects: string[];
    sessionCount: number;
}

export interface AdminStudent {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    yearGroup?: string;
    targetExams?: string;
    sessionCount: number;
}

export interface CalendarSession {
    id: string;
    studentName: string;
    tutorName: string;
    subject: string;
    startTime: string;
    endTime: string;
    status: string;
    meetingLink?: string;
}

export interface CalendarAvailability {
    tutorName: string;
    tutorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface CalendarData {
    sessions: CalendarSession[];
    availability: CalendarAvailability[];
    tutors: { id: string; name: string }[];
    subjects: { id: string; name: string }[];
}

export interface PaymentRecord {
    id: string;
    userName: string;
    userEmail: string;
    tier: string;
    subject: string;
    amountPaid: number;
    currency: string;
    status: string;
    paidAt: string;
    stripeSessionId: string;
}

export interface PaymentStats {
    totalRevenue: number;
    mrr: number;
    failedPayments: number;
    revenueTrend: { month: string; revenue: number }[];
    revenueByTier: { tier: string; revenue: number; count: number }[];
    revenueBySubject: { subject: string; revenue: number; count: number }[];
}

export interface TutorApplication {
    id: string;
    applicantName: string;
    applicantEmail: string;
    phone?: string;
    education: string;
    experience: string;
    subjectExpertise: string[];
    availability: string;
    cvUrl?: string;
    coverLetter?: string;
    status: 'NEW' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'REJECTED';
    reviewerId?: string;
    reviewer?: { name: string };
    interviewNotes?: string;
    interviewDate?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    body: string;
    category: 'PAYMENTS' | 'SCHEDULING' | 'TUTOR_ISSUES' | 'TECHNICAL' | 'GENERAL';
    status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
    userName: string;
    userEmail: string;
    assigneeName?: string | null;
    replyCount: number;
    createdAt: string;
    resolvedAt?: string;
}

export interface TicketDetail {
    id: string;
    subject: string;
    body: string;
    category: string;
    status: string;
    user: { id: string; name: string; email: string };
    assignee?: { id: string; name: string } | null;
    replies: {
        id: string;
        body: string;
        createdAt: string;
        user: { name: string; role: string };
    }[];
    createdAt: string;
    resolvedAt?: string;
}
