import React from 'react';

const statusStyles: Record<string, string> = {
    // Application statuses
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700 border-purple-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    // Ticket statuses
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // Booking statuses
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PAST_DUE: 'bg-red-50 text-red-700 border-red-200',
    CANCELLED: 'bg-slate-50 text-slate-600 border-slate-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    // Verification
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // Ticket categories
    PAYMENTS: 'bg-violet-50 text-violet-700 border-violet-200',
    SCHEDULING: 'bg-sky-50 text-sky-700 border-sky-200',
    TUTOR_ISSUES: 'bg-orange-50 text-orange-700 border-orange-200',
    TECHNICAL: 'bg-slate-50 text-slate-700 border-slate-200',
    GENERAL: 'bg-gray-50 text-gray-600 border-gray-200',
};

const displayLabels: Record<string, string> = {
    UNDER_REVIEW: 'Under Review',
    INTERVIEW_SCHEDULED: 'Interview',
    PAST_DUE: 'Past Due',
    IN_PROGRESS: 'In Progress',
    TUTOR_ISSUES: 'Tutor Issues',
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const style = statusStyles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
    const label = displayLabels[status] || status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}>
            {label}
        </span>
    );
}
