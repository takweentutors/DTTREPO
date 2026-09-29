import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import type { TutorApplication } from '@/lib/admin-types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { useToast } from '@/components/ui/toast';

const STATUS_TABS = [
    { value: '', label: 'All' },
    { value: 'NEW', label: 'New' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'INTERVIEW_SCHEDULED', label: 'Interview' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
];

export default function AdminApplicationsPage() {
    const { toast } = useToast();
    const [applications, setApplications] = useState<TutorApplication[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchApplications = () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);

        api<{ applications: TutorApplication[]; total: number }>(`/admin/applications?${params}`)
            .then((data) => { setApplications(data.applications); setTotal(data.total); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchApplications(); }, [page, statusFilter]);

    const updateApplication = async (id: string, data: Record<string, any>) => {
        try {
            await api(`/admin/applications/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            toast('Application updated', 'success');
            fetchApplications();
        } catch {
            toast('Failed to update application', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tutor Applications"
                subtitle={`${total} application${total !== 1 ? 's' : ''}`}
            />

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            statusFilter === tab.value
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No applications found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Summary row */}
                            <button
                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                                        {app.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{app.applicantName}</p>
                                        <p className="text-xs text-slate-400 truncate">{app.applicantEmail}</p>
                                    </div>
                                    <div className="hidden md:flex flex-wrap gap-1 max-w-[200px]">
                                        {app.subjectExpertise.slice(0, 3).map((s) => (
                                            <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <StatusBadge status={app.status} />
                                    <span className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString('en-GB')}</span>
                                    {expandedId === app.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </div>
                            </button>

                            {/* Expanded detail */}
                            {expandedId === app.id && (
                                <div className="border-t border-slate-100 p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <DetailRow label="Education" value={app.education} />
                                            <DetailRow label="Experience" value={app.experience} />
                                            <DetailRow label="Availability" value={app.availability} />
                                            <DetailRow label="Phone" value={app.phone || '—'} />
                                            {app.cvUrl && (
                                                <div>
                                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">CV</span>
                                                    <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-secondary hover:underline mt-1">
                                                        View CV <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <DetailRow label="Subjects" value={app.subjectExpertise.join(', ')} />
                                            {app.coverLetter && <DetailRow label="Cover Letter" value={app.coverLetter} />}
                                            {app.reviewer && <DetailRow label="Reviewer" value={app.reviewer.name} />}
                                            {app.interviewDate && <DetailRow label="Interview Date" value={new Date(app.interviewDate).toLocaleString('en-GB')} />}
                                            {app.interviewNotes && <DetailRow label="Interview Notes" value={app.interviewNotes} />}
                                            {app.rejectionReason && <DetailRow label="Rejection Reason" value={app.rejectionReason} />}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                                        {app.status !== 'ACCEPTED' && (
                                            <button
                                                onClick={() => updateApplication(app.id, { status: 'ACCEPTED' })}
                                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {app.status !== 'REJECTED' && (
                                            <button
                                                onClick={() => {
                                                    const reason = prompt('Rejection reason (optional):');
                                                    updateApplication(app.id, { status: 'REJECTED', rejectionReason: reason || undefined });
                                                }}
                                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {app.status !== 'UNDER_REVIEW' && app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && (
                                            <button
                                                onClick={() => updateApplication(app.id, { status: 'UNDER_REVIEW' })}
                                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                                            >
                                                Mark Under Review
                                            </button>
                                        )}
                                        {app.status !== 'INTERVIEW_SCHEDULED' && app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && (
                                            <button
                                                onClick={() => {
                                                    const dateStr = prompt('Interview date (YYYY-MM-DD HH:MM):');
                                                    if (dateStr) {
                                                        const d = new Date(dateStr);
                                                        if (!isNaN(d.getTime())) {
                                                            updateApplication(app.id, { status: 'INTERVIEW_SCHEDULED', interviewDate: d.toISOString() });
                                                        }
                                                    }
                                                }}
                                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                                            >
                                                Schedule Interview
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="flex justify-center gap-2 pt-4">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30">Previous</button>
                            <span className="px-4 py-2 text-sm text-slate-500">{page} / {Math.ceil(total / 20)}</span>
                            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30">Next</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
            <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{value}</p>
        </div>
    );
}
