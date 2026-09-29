import React, { useState, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { AdminTutor } from '@/lib/admin-types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useToast } from '@/components/ui/toast';

export default function AdminTutorsPage() {
    const { toast } = useToast();
    const [tutors, setTutors] = useState<AdminTutor[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [verification, setVerification] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchTutors = () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);
        if (verification) params.set('verification', verification);

        api<{ tutors: AdminTutor[]; total: number }>(`/admin/tutors?${params}`)
            .then((data) => { setTutors(data.tutors); setTotal(data.total); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTutors(); }, [page, search, verification]);

    const handleVerify = async (profileId: string) => {
        try {
            await api(`/admin/tutors/${profileId}/verify`, { method: 'POST' });
            toast('Verification status updated', 'success');
            fetchTutors();
        } catch {
            toast('Failed to update verification', 'error');
        }
    };

    const columns: Column<AdminTutor>[] = [
        { key: 'name', label: 'Name', render: (t) => (
            <div>
                <p className="font-medium text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.email}</p>
            </div>
        )},
        { key: 'subjects', label: 'Subjects', render: (t) => (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
                {t.subjects.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{s}</span>
                ))}
                {t.subjects.length > 3 && <span className="text-xs text-slate-400">+{t.subjects.length - 3}</span>}
            </div>
        )},
        { key: 'verificationStatus', label: 'Status', render: (t) => <StatusBadge status={t.verificationStatus} /> },
        { key: 'sessionCount', label: 'Sessions' },
        { key: 'hourlyRate', label: 'Rate', render: (t) => t.hourlyRate ? `£${t.hourlyRate}/hr` : '—' },
        { key: 'createdAt', label: 'Joined', render: (t) => new Date(t.createdAt).toLocaleDateString('en-GB') },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tutors"
                subtitle={`${total} tutor${total !== 1 ? 's' : ''} registered`}
                action={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Tutor
                    </button>
                }
            />

            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={verification}
                    onChange={(e) => { setVerification(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                </select>
            </div>

            <AdminDataTable
                columns={columns}
                data={tutors}
                total={total}
                page={page}
                onPageChange={setPage}
                searchValue={search}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search tutors by name or email..."
                loading={loading}
                emptyMessage="No tutors found"
                actions={(t) => (
                    <button
                        onClick={() => t.profileId && handleVerify(t.profileId)}
                        disabled={!t.profileId}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            t.verificationStatus === 'VERIFIED'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                        {t.verificationStatus === 'VERIFIED' ? 'Unverify' : 'Verify'}
                    </button>
                )}
            />

            {showCreateModal && (
                <CreateTutorModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchTutors(); toast('Tutor account created', 'success'); }}
                />
            )}
        </div>
    );
}

function CreateTutorModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
    const { toast } = useToast();
    const [form, setForm] = useState({
        name: '', email: '', password: '', bio: '', hourlyRate: '',
        subjects: '', autoVerify: false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api('/admin/tutors/create', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    bio: form.bio || undefined,
                    hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : undefined,
                    subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                    autoVerify: form.autoVerify,
                }),
            });
            onCreated();
        } catch (err: any) {
            toast(err?.message || 'Failed to create tutor', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 space-y-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Create Tutor Account</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                            <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password *</label>
                        <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            placeholder="Min 8 characters" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                        <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (£)</label>
                            <input type="number" step="0.01" value={form.hourlyRate} onChange={(e) => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subjects</label>
                            <input value={form.subjects} onChange={(e) => setForm(f => ({ ...f, subjects: e.target.value }))}
                                placeholder="Comma-separated" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.autoVerify} onChange={(e) => setForm(f => ({ ...f, autoVerify: e.target.checked }))}
                            className="rounded border-slate-300" />
                        <span className="text-sm text-slate-700">Auto-verify tutor profile</span>
                    </label>
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-secondary hover:bg-secondary/90 disabled:opacity-50">
                            {submitting ? 'Creating...' : 'Create Tutor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
