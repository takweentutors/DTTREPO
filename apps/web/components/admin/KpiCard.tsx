import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    iconBg?: string;
    iconColor?: string;
    trend?: { value: number; label: string };
    prefix?: string;
}

export default function KpiCard({
    title,
    value,
    icon: Icon,
    iconBg = 'bg-blue-50',
    iconColor = 'text-blue-600',
    trend,
    prefix,
}: KpiCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend.value >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                            )}
                            <span className={`text-xs font-semibold ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {trend.value >= 0 ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-xs text-slate-400">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
