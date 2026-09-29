import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { api } from '@/lib/api';
import type { SupportTicket, TicketDetail } from '@/lib/admin-types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { useToast } from '@/components/ui/toast';

const STATUS_TABS = [
    { value: '', label: 'All' },
    { value: 'NEW', label: 'New' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    { value: 'PAYMENTS', label: 'Payments' },
    { value: 'SCHEDULING', label: 'Scheduling' },
    { value: 'TUTOR_ISSUES', label: 'Tutor Issues' },
    { value: 'TECHNICAL', label: 'Technical' },
    { value: 'GENERAL', label: 'General' },
];

export default function AdminSupportPage() {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);

    const fetchTickets = () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        if (categoryFilter) params.set('category', categoryFilter);

        api<{ tickets: SupportTicket[]; total: number }>(`/admin/tickets?${params}`)
            .then((data) => { setTickets(data.tickets); setTotal(data.total); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTickets(); }, [page, statusFilter, categoryFilter]);

    useEffect(() => {
        if (!selectedTicketId) { setTicketDetail(null); return; }
        setDetailLoading(true);
        api<{ ticket: TicketDetail }>(`/admin/tickets/${selectedTicketId}`)
            .then((data) => setTicketDetail(data.ticket))
            .catch(console.error)
            .finally(() => setDetailLoading(false));
    }, [selectedTicketId]);

    const handleReply = async () => {
        if (!replyText.trim() || !selectedTicketId) return;
        setReplying(true);
        try {
            await api(`/admin/tickets/${selectedTicketId}/reply`, {
                method: 'POST',
                body: JSON.stringify({ body: replyText }),
            });
            setReplyText('');
            // Refresh detail
            const data = await api<{ ticket: TicketDetail }>(`/admin/tickets/${selectedTicketId}`);
            setTicketDetail(data.ticket);
            fetchTickets();
        } catch {
            toast('Failed to send reply', 'error');
        } finally {
            setReplying(false);
        }
    };

    const handleResolve = async () => {
        if (!selectedTicketId) return;
        try {
            await api(`/admin/tickets/${selectedTicketId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'RESOLVED' }),
            });
            toast('Ticket resolved', 'success');
            const data = await api<{ ticket: TicketDetail }>(`/admin/tickets/${selectedTicketId}`);
            setTicketDetail(data.ticket);
            fetchTickets();
        } catch {
            toast('Failed to resolve ticket', 'error');
        }
    };

    const handleReopen = async () => {
        if (!selectedTicketId) return;
        try {
            await api(`/admin/tickets/${selectedTicketId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'IN_PROGRESS' }),
            });
            toast('Ticket reopened', 'success');
            const data = await api<{ ticket: TicketDetail }>(`/admin/tickets/${selectedTicketId}`);
            setTicketDetail(data.ticket);
            fetchTickets();
        } catch {
            toast('Failed to reopen ticket', 'error');
        }
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Support Inbox" subtitle={`${total} ticket${total !== 1 ? 's' : ''}`} />

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex gap-2">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                statusFilter === tab.value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                    {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[60vh]">
                {/* Ticket List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex items-center justify-center flex-1">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-slate-400">
                            No tickets found
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 overflow-y-auto flex-1">
                            {tickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`w-full text-left p-4 hover:bg-slate-50/50 transition-colors ${
                                        selectedTicketId === ticket.id ? 'bg-secondary/5 border-l-2 border-l-secondary' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-900 truncate">{ticket.subject}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{ticket.userName}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 shrink-0">{timeAgo(ticket.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <StatusBadge status={ticket.status} />
                                        <StatusBadge status={ticket.category} />
                                        {ticket.replyCount > 0 && (
                                            <span className="text-xs text-slate-400">{ticket.replyCount} replies</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {total > 20 && (
                        <div className="flex justify-between items-center px-4 py-2 border-t border-slate-100">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-30">Prev</button>
                            <span className="text-xs text-slate-400">{page}/{Math.ceil(total / 20)}</span>
                            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
                                className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-30">Next</button>
                        </div>
                    )}
                </div>

                {/* Ticket Detail */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {!selectedTicketId ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-slate-400">
                            Select a ticket to view details
                        </div>
                    ) : detailLoading ? (
                        <div className="flex items-center justify-center flex-1">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary" />
                        </div>
                    ) : ticketDetail ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{ticketDetail.subject}</h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {ticketDetail.user.name} ({ticketDetail.user.email}) &middot;{' '}
                                            {new Date(ticketDetail.createdAt).toLocaleString('en-GB')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={ticketDetail.status} />
                                        {ticketDetail.status !== 'RESOLVED' ? (
                                            <button onClick={handleResolve}
                                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                                Resolve
                                            </button>
                                        ) : (
                                            <button onClick={handleReopen}
                                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100">
                                                Reopen
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Body + Replies */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Original message */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticketDetail.body}</p>
                                </div>

                                {/* Replies */}
                                {ticketDetail.replies.map((reply) => (
                                    <div key={reply.id} className={`rounded-lg p-4 ${reply.user.role === 'ADMIN' ? 'bg-secondary/5 ml-4' : 'bg-slate-50'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-slate-600">
                                                {reply.user.name}
                                                {reply.user.role === 'ADMIN' && <span className="ml-1 text-secondary">(Admin)</span>}
                                            </span>
                                            <span className="text-xs text-slate-400">{timeAgo(reply.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.body}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            {ticketDetail.status !== 'RESOLVED' && (
                                <div className="p-4 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply..."
                                            rows={2}
                                            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                        />
                                        <button
                                            onClick={handleReply}
                                            disabled={!replyText.trim() || replying}
                                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors self-end"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
