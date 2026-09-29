import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { api } from '@/lib/api';
import type { PaymentRecord, PaymentStats } from '@/lib/admin-types';
import KpiCard from '@/components/admin/KpiCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<PaymentStats | null>(null);

    useEffect(() => {
        api<PaymentStats>('/admin/payments/stats')
            .then(setStats)
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);

        api<{ payments: PaymentRecord[]; total: number }>(`/admin/payments?${params}`)
            .then((data) => { setPayments(data.payments); setTotal(data.total); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, search, statusFilter]);

    const columns: Column<PaymentRecord>[] = [
        { key: 'userName', label: 'Customer', render: (p) => (
            <div>
                <p className="font-medium text-slate-900">{p.userName}</p>
                <p className="text-xs text-slate-400">{p.userEmail}</p>
            </div>
        )},
        { key: 'tier', label: 'Tier' },
        { key: 'subject', label: 'Subject' },
        { key: 'amountPaid', label: 'Amount', render: (p) => (
            <span className="font-semibold text-slate-900">£{p.amountPaid.toFixed(2)}</span>
        )},
        { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
        { key: 'paidAt', label: 'Date', render: (p) => new Date(p.paidAt).toLocaleDateString('en-GB') },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Payments" subtitle="Billing, subscriptions, and revenue" />

            {/* KPIs */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard title="Monthly Revenue (MRR)" value={stats.mrr.toFixed(2)} prefix="£" icon={DollarSign} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                    <KpiCard title="Total Revenue" value={stats.totalRevenue.toFixed(2)} prefix="£" icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600" />
                    <KpiCard title="Failed Payments" value={stats.failedPayments} icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
                </div>
            )}

            {/* Revenue Chart */}
            {stats && stats.revenueTrend.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueTrend}>
                                <defs>
                                    <linearGradient id="payRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                                    formatter={(value: number) => [`£${value.toFixed(2)}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} fill="url(#payRevenueGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAST_DUE">Past Due</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <AdminDataTable
                columns={columns}
                data={payments}
                total={total}
                page={page}
                onPageChange={setPage}
                searchValue={search}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by customer name or email..."
                loading={loading}
                emptyMessage="No payments found"
            />
        </div>
    );
}
