import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    total: number;
    page: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    searchValue?: string;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    loading?: boolean;
    emptyMessage?: string;
    actions?: (item: T) => React.ReactNode;
}

export default function AdminDataTable<T extends { id?: string }>({
    columns,
    data,
    total,
    page,
    pageSize = 20,
    onPageChange,
    searchValue,
    onSearch,
    searchPlaceholder = 'Search...',
    loading,
    emptyMessage = 'No results found',
    actions,
}: AdminDataTableProps<T>) {
    const totalPages = Math.ceil(total / pageSize);
    const [localSearch, setLocalSearch] = useState(searchValue || '');
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        setLocalSearch(searchValue || '');
    }, [searchValue]);

    const handleSearchChange = (val: string) => {
        setLocalSearch(val);
        if (onSearch) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => onSearch(val), 300);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {onSearch && (
                <div className="p-4 border-b border-slate-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary" />
                </div>
            ) : data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Inbox className="w-10 h-10 mb-3" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {col.label}
                                    </th>
                                ))}
                                {actions && <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((item, idx) => (
                                <tr key={(item as any).id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3 text-sm text-slate-700">
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-sm text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-slate-600 px-2 font-medium">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
