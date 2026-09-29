import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { AdminStudent } from '@/lib/admin-types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<AdminStudent[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);

        api<{ students: AdminStudent[]; total: number }>(`/admin/students?${params}`)
            .then((data) => { setStudents(data.students); setTotal(data.total); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, search]);

    const columns: Column<AdminStudent>[] = [
        { key: 'name', label: 'Name', render: (s) => (
            <div>
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-400">{s.email}</p>
            </div>
        )},
        { key: 'yearGroup', label: 'Year Group', render: (s) => s.yearGroup || '—' },
        { key: 'targetExams', label: 'Target Exams', render: (s) => s.targetExams || '—' },
        { key: 'sessionCount', label: 'Sessions' },
        { key: 'createdAt', label: 'Joined', render: (s) => new Date(s.createdAt).toLocaleDateString('en-GB') },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Students"
                subtitle={`${total} student${total !== 1 ? 's' : ''} registered`}
            />

            <AdminDataTable
                columns={columns}
                data={students}
                total={total}
                page={page}
                onPageChange={setPage}
                searchValue={search}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search students by name or email..."
                loading={loading}
                emptyMessage="No students found"
            />
        </div>
    );
}
