import React, { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, DollarSign, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface TutorSession {
    id: string;
    subject: string;
    studentName: string;
    startTime: string;
    endTime: string;
    status: string;
    meetingLink?: string;
}

interface TutorDashboardData {
    profile: {
        bio: string | null;
        hourlyRate: number | null;
        verificationStatus: string;
        subjects: string[];
    };
    sessions: TutorSession[];
    stats: {
        upcomingSessions: number;
        completedSessions: number;
        totalEarnings: number;
        totalStudents: number;
    };
}

interface EarningsData {
    totalEarnings: number;
    history: { month: string; sessions: number; earnings: number }[];
}

export default function TutorDashboardPage() {
    const { user } = useAuth();
    const [data, setData] = useState<TutorDashboardData | null>(null);
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            api<TutorDashboardData>('/tutor/dashboard'),
            api<EarningsData>('/tutor/earnings')
        ])
            .then(([dashboardData, earningsData]) => {
                setData(dashboardData);
                setEarnings(earningsData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const getDayMonth = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date),
            day: new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date),
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const stats = data?.stats || { upcomingSessions: 0, completedSessions: 0, totalEarnings: 0, totalStudents: 0 };
    const sessions = data?.sessions || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 ">Dashboard</h1>
                    <p className="text-slate-500 ">Welcome back, {user?.name?.split(' ')[0]}! Here's your overview.</p>
                </div>
                {data?.profile.verificationStatus === 'PENDING' && (
                    <div className="bg-amber-50 text-amber-700 text-sm px-4 py-2 rounded-lg border border-amber-200">
                        ⏳ Verification pending
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 ">Upcoming</p>
                            <p className="text-2xl font-bold text-slate-900 ">{stats.upcomingSessions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 ">Completed</p>
                            <p className="text-2xl font-bold text-slate-900 ">{stats.completedSessions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-50 text-secondary flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 ">Earnings</p>
                            <p className="text-2xl font-bold text-slate-900 ">£{stats.totalEarnings}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 ">Students</p>
                            <p className="text-2xl font-bold text-slate-900 ">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings History */}
            {earnings && earnings.history.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Monthly Earnings</h2>
                            <p className="text-sm text-slate-500">Breakdown of your completed sessions.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {earnings.history.map((record) => (
                            <div key={record.month} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-900">{record.month}</p>
                                    <p className="text-sm text-slate-500">{record.sessions} sessions completed</p>
                                </div>
                                <p className="text-lg font-bold text-slate-900">£{record.earnings}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sessions + Subjects */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 ">Upcoming Sessions</h2>
                        <a href="/dashboard/sessions" className="text-sm text-secondary hover:underline">View all</a>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {sessions.length > 0 ? (
                            sessions.map((session) => {
                                const { month, day } = getDayMonth(session.startTime);
                                const handleJoin = () => {
                                    const zoomUrl = (session as any).zoomJoinUrl;
                                    if (zoomUrl) {
                                        window.open(zoomUrl, '_blank', 'noopener,noreferrer');
                                    } else {
                                        window.history.pushState({}, '', `/session/${session.id}`);
                                        window.dispatchEvent(new PopStateEvent('popstate'));
                                    }
                                };
                                return (
                                    <div key={session.id} className="p-4 border-b border-slate-100 last:border-0 flex items-center gap-4 hover:bg-white transition-colors">
                                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-600 shrink-0">
                                            <span className="text-xs font-bold uppercase">{month}</span>
                                            <span className="text-lg font-bold">{day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate">{session.subject}</h3>
                                            <p className="text-sm text-slate-500 truncate">with {session.studentName} • {formatTime(session.startTime)} - {formatTime(session.endTime)}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                            onClick={handleJoin}
                                        >
                                            <Video className="w-3.5 h-3.5" />
                                            Start
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-slate-500 ">
                                No upcoming sessions.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 ">My Subjects</h2>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                        {(data?.profile.subjects || []).length > 0 ? (
                            data!.profile.subjects.map((subject) => (
                                <div key={subject} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 ">{subject}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No subjects added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
