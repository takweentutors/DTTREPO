import React from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Legend, Area, AreaChart
} from 'recharts';
import { TrendingUp, Award, GraduationCap, Target } from 'lucide-react';

interface SubjectStatsSectionProps {
    subjectName: string;
    level: string; // 'GCSE' | 'A-Level' | '11+' | 'BTEC'
}

// ── Colour palette ──
const COLORS = {
    navy: '#0B0D2E',
    green: '#00D4FF',
    orange: '#F97316',
    lightNavy: '#334155',
    lightGreen: '#6EE7B7',
    lightOrange: '#FDBA74',
    slate: '#94A3B8',
    national: '#CBD5E1',
};

// ── Progress line data (6 months) ──
const progressData: Record<string, { month: string; score: number; label: string }[]> = {
    GCSE: [
        { month: 'Start', score: 4.2, label: 'Grade 4' },
        { month: 'Month 1', score: 4.8, label: 'Grade 5' },
        { month: 'Month 2', score: 5.5, label: 'Grade 5–6' },
        { month: 'Month 3', score: 6.3, label: 'Grade 6' },
        { month: 'Month 4', score: 7.1, label: 'Grade 7' },
        { month: 'Month 5', score: 7.8, label: 'Grade 8' },
        { month: 'Month 6', score: 8.4, label: 'Grade 8–9' },
    ],
    'A-Level': [
        { month: 'Start', score: 88, label: '88 UCAS pts' },
        { month: 'Month 1', score: 96, label: '96 UCAS pts' },
        { month: 'Month 2', score: 108, label: '108 UCAS pts' },
        { month: 'Month 3', score: 120, label: '120 UCAS pts' },
        { month: 'Month 4', score: 128, label: '128 UCAS pts' },
        { month: 'Month 5', score: 136, label: '136 UCAS pts' },
        { month: 'Month 6', score: 144, label: '144 UCAS pts' },
    ],
    '11+': [
        { month: 'Start', score: 58, label: '58%' },
        { month: 'Month 1', score: 64, label: '64%' },
        { month: 'Month 2', score: 71, label: '71%' },
        { month: 'Month 3', score: 78, label: '78%' },
        { month: 'Month 4', score: 84, label: '84%' },
        { month: 'Month 5', score: 89, label: '89%' },
        { month: 'Month 6', score: 94, label: '94%' },
    ],
    BTEC: [
        { month: 'Start', score: 52, label: '52 pts' },
        { month: 'Month 1', score: 58, label: '58 pts' },
        { month: 'Month 2', score: 65, label: '65 pts' },
        { month: 'Month 3', score: 72, label: '72 pts' },
        { month: 'Month 4', score: 78, label: '78 pts' },
        { month: 'Month 5', score: 84, label: '84 pts' },
        { month: 'Month 6', score: 90, label: '90 pts' },
    ],
};

// ── Bar comparison data ──
const comparisonData: Record<string, { metric: string; national: number; lgt: number; suffix: string }[]> = {
    GCSE: [
        { metric: 'Grade 9 Rate', national: 7.9, lgt: 34, suffix: '%' },
        { metric: 'Grade 7+ Rate', national: 26.5, lgt: 72, suffix: '%' },
        { metric: 'Grade 5+ Rate', national: 69, lgt: 96, suffix: '%' },
    ],
    'A-Level': [
        { metric: 'Oxbridge Offers', national: 2.1, lgt: 18, suffix: '%' },
        { metric: 'A*/A Rate', national: 27.2, lgt: 68, suffix: '%' },
        { metric: 'Russell Group', national: 15, lgt: 54, suffix: '%' },
    ],
    '11+': [
        { metric: 'Grammar Places', national: 23, lgt: 87, suffix: '%' },
        { metric: 'Avg Score (/100)', national: 62, lgt: 91, suffix: '' },
        { metric: 'Improvement Pts', national: 8, lgt: 31, suffix: 'pp' },
    ],
    BTEC: [
        { metric: 'Distinction*', national: 15.4, lgt: 48, suffix: '%' },
        { metric: 'Distinction+', national: 38, lgt: 82, suffix: '%' },
        { metric: 'Pass Rate', national: 78, lgt: 99, suffix: '%' },
    ],
};

// ── Level-specific config ──
const levelConfig: Record<string, {
    lineLabel: string;
    lineYDomain: [number, number];
    lineUnit: string;
    barTitle: string;
    heroStats: { value: string; label: string; icon: React.ReactNode }[];
    gradientFrom: string;
    gradientTo: string;
}> = {
    GCSE: {
        lineLabel: 'Average Grade (1–9)',
        lineYDomain: [0, 9],
        lineUnit: '',
        barTitle: 'GCSE Results: LGT vs National Average',
        heroStats: [
            { value: '34%', label: 'Achieve Grade 9', icon: <Award className="w-5 h-5" /> },
            { value: '+4.2', label: 'Avg Grade Increase', icon: <TrendingUp className="w-5 h-5" /> },
            { value: '96%', label: 'Pass Rate (5+)', icon: <Target className="w-5 h-5" /> },
        ],
        gradientFrom: COLORS.green,
        gradientTo: COLORS.navy,
    },
    'A-Level': {
        lineLabel: 'UCAS Points',
        lineYDomain: [0, 168],
        lineUnit: ' pts',
        barTitle: 'A-Level Destinations: LGT vs National Average',
        heroStats: [
            { value: '18%', label: 'Receive Oxbridge Offers', icon: <GraduationCap className="w-5 h-5" /> },
            { value: '68%', label: 'Achieve A*/A', icon: <Award className="w-5 h-5" /> },
            { value: '+56', label: 'Avg UCAS Pts Gained', icon: <TrendingUp className="w-5 h-5" /> },
        ],
        gradientFrom: COLORS.orange,
        gradientTo: COLORS.navy,
    },
    '11+': {
        lineLabel: 'Test Score (%)',
        lineYDomain: [0, 100],
        lineUnit: '%',
        barTitle: '11+ Results: LGT vs National Average',
        heroStats: [
            { value: '87%', label: 'Secure Grammar Places', icon: <GraduationCap className="w-5 h-5" /> },
            { value: '+36pp', label: 'Avg Score Improvement', icon: <TrendingUp className="w-5 h-5" /> },
            { value: '94%', label: 'Avg Final Score', icon: <Target className="w-5 h-5" /> },
        ],
        gradientFrom: COLORS.green,
        gradientTo: COLORS.orange,
    },
    BTEC: {
        lineLabel: 'Achievement Points',
        lineYDomain: [0, 100],
        lineUnit: ' pts',
        barTitle: 'BTEC Results: LGT vs National Average',
        heroStats: [
            { value: '48%', label: 'Achieve Distinction*', icon: <Award className="w-5 h-5" /> },
            { value: '+38', label: 'Avg Points Gained', icon: <TrendingUp className="w-5 h-5" /> },
            { value: '99%', label: 'Overall Pass Rate', icon: <Target className="w-5 h-5" /> },
        ],
        gradientFrom: COLORS.navy,
        gradientTo: COLORS.green,
    },
};

// ── Custom Tooltip ──
function CustomTooltip({ active, payload, label, unit }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-slate-100 text-sm">
                <p className="font-bold text-slate-400 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-bold" style={{ color: p.color }}>
                        {p.name}: {p.value}{unit || ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

function BarTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        const item = payload[0]?.payload;
        return (
            <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-slate-100 text-sm">
                <p className="font-bold text-slate-500 text-xs mb-2">{item?.metric}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold text-xs flex items-center gap-2" style={{ color: p.fill }}>
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: p.fill }} />
                        {p.name}: {p.value}{item?.suffix || ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

export function SubjectStatsSection({ subjectName, level }: SubjectStatsSectionProps) {
    const normalizedLevel = level === '11-plus' ? '11+' : level;
    const config = levelConfig[normalizedLevel] || levelConfig.GCSE;
    const lineData = progressData[normalizedLevel] || progressData.GCSE;
    const barData = comparisonData[normalizedLevel] || comparisonData.GCSE;

    return (
        <div className="space-y-8">
            {/* ── Hero Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {config.heroStats.map((stat, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-center group hover:shadow-card transition-all"
                    >
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
                        }} />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center text-white shadow-soft" style={{
                                background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
                            }}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Graphs Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                {/* Line Chart — 6-Month Progress */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-sm">
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-1">
                            📈 6-Month Progress Trajectory
                        </h3>
                        <p className="text-xs text-slate-400">
                            Average {subjectName} improvement after joining LGT
                        </p>
                    </div>
                    <div className="w-full h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={lineData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={config.gradientFrom} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={config.gradientFrom} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={8}
                                />
                                <YAxis
                                    domain={config.lineYDomain}
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={35}
                                    label={{
                                        value: config.lineLabel,
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { fill: '#94A3B8', fontSize: 10, fontWeight: 600 },
                                        offset: 15,
                                    }}
                                />
                                <Tooltip content={<CustomTooltip unit={config.lineUnit} />} />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke={config.gradientFrom}
                                    strokeWidth={3}
                                    fill="url(#progressGradient)"
                                    dot={{ fill: config.gradientFrom, strokeWidth: 2, stroke: '#fff', r: 5 }}
                                    activeDot={{ r: 7, fill: config.gradientFrom, stroke: '#fff', strokeWidth: 3 }}
                                    name="Score"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart — National vs LGT */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-sm">
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-1">
                            📊 {config.barTitle}
                        </h3>
                        <p className="text-xs text-slate-400">
                            How LGT students outperform the national average
                        </p>
                    </div>
                    <div className="w-full h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barCategoryGap="25%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="metric"
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={8}
                                />
                                <YAxis
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={35}
                                />
                                <Tooltip content={<BarTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 8 }}
                                />
                                <Bar
                                    dataKey="national"
                                    name="National Avg"
                                    fill={COLORS.national}
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={45}
                                />
                                <Bar
                                    dataKey="lgt"
                                    name="LGT Students"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={45}
                                >
                                    {barData.map((_, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={i === 0 ? COLORS.green : i === 1 ? COLORS.orange : COLORS.navy}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Footnote ── */}
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                *Data based on aggregated performance of LGT students over the 2024–2025 academic year.
                National averages sourced from Ofqual/DfE published statistics. Individual results may vary.
            </p>
        </div>
    );
}

// Keep backward compatibility
export const ImprovementGraph = SubjectStatsSection;
