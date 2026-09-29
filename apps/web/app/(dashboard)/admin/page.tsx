import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    AlertCircle,
    Users,
    GraduationCap,
    CalendarCheck,
    ClipboardList,
    MessageSquare,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/lib/admin-types';
import KpiCard from '@/components/admin/KpiCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<DashboardStats>('/admin/dashboard/stats')
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-16 text-slate-500">
                <p>Failed to load dashboard stats.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader title="Admin Overview" subtitle="Platform metrics and recent activity" />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                    title="Monthly Revenue (MRR)"
                    value={stats.financial.mrr.toFixed(2)}
                    prefix="£"
                    icon={DollarSign}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <KpiCard
                    title="Total Revenue"
                    value={stats.financial.totalRevenue.toFixed(2)}
                    prefix="£"
                    icon={TrendingUp}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <KpiCard
                    title="Failed Payments"
                    value={stats.financial.failedPayments}
                    icon={AlertCircle}
                    iconBg="bg-red-50"
                    iconColor="text-red-600"
                />
                <KpiCard
                    title="New Students (30d)"
                    value={stats.growth.newStudentsThisMonth}
                    icon={GraduationCap}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                />
                <KpiCard
                    title="Active Tutors"
                    value={stats.growth.totalTutors}
                    icon={Users}
                    iconBg="bg-sky-50"
                    iconColor="text-sky-600"
                />
                <KpiCard
                    title="Sessions Today"
                    value={stats.operations.sessionsToday}
                    icon={CalendarCheck}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue Trend (6 months)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.financial.revenueTrend}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                                        padding: '12px 16px',
                                    }}
                                    formatter={(value: number) => [`£${value.toFixed(2)}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} fill="url(#revenueGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Growth */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">User Growth (6 months)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.growth.userGrowthTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                                        padding: '12px 16px',
                                    }}
                                />
                                <Bar dataKey="students" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Students" />
                                <Bar dataKey="tutors" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Tutors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                        {stats.recentActivity.bookings.length === 0 ? (
                            <p className="text-sm text-slate-400">No recent bookings</p>
                        ) : (
                            stats.recentActivity.bookings.map((b) => (
                                <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{b.userName}</p>
                                        <p className="text-xs text-slate-400">{b.tier} &middot; {b.subject}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">£{b.amount.toFixed(2)}</p>
                                        <StatusBadge status={b.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-700">Recent Applications</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.recentActivity.applications.length === 0 ? (
                            <p className="text-sm text-slate-400">No recent applications</p>
                        ) : (
                            stats.recentActivity.applications.map((a) => (
                                <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{a.applicantName}</p>
                                        <p className="text-xs text-slate-400">{a.subjectExpertise.slice(0, 2).join(', ')}</p>
                                    </div>
                                    <StatusBadge status={a.status} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-700">Recent Support Tickets</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.recentActivity.tickets.length === 0 ? (
                            <p className="text-sm text-slate-400">No recent tickets</p>
                        ) : (
                            stats.recentActivity.tickets.map((t) => (
                                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{t.subject}</p>
                                        <p className="text-xs text-slate-400">{t.userName}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <StatusBadge status={t.status} />
                                        <StatusBadge status={t.category} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
