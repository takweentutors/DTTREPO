
import React, { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useStudentPurchases } from "@/context/StudentPurchasesContext";
import { api } from "@/lib/api";
import { Link } from "@/components/Link"; // Fixed: Use custom Link component
import { tierEmojis } from "@/content/stripe-links";

interface DashboardSession {
 id: string;
 subject: string;
 tutorName: string;
 startTime: string; // ISO
 endTime: string; // ISO
 status: string;
 meetingLink?: string;
}

interface DashboardProgress {
 id: string;
 subject: string;
 metricType: string;
 value: number;
 recordedAt: string;
}

interface DashboardData {
 sessions: DashboardSession[];
 progress: DashboardProgress[];
 stats: {
 upcomingSessions: number;
 completedSessions: number;
 activeSubjects: number;
 };
}

export default function StudentDashboardPage() {
 const { user } = useAuth();
 const { activeSubjects, nextLessons } = useStudentPurchases();
 const [data, setData] = useState<DashboardData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => {
 const endpoint = user?.role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard';
 api<DashboardData>(endpoint)
 .then(setData)
 .catch((err) => {
 console.error("Dashboard API failed, using local mode", err);
 // Fallback structure if API fails
 setData({
 sessions: [],
 progress: [],
 stats: { upcomingSessions: 0, completedSessions: 0, activeSubjects: 0 }
 });
 })
 .finally(() => setLoading(false));
 }, [user?.role]);

 // Formatters
 const formatDate = (dateStr: string) => {
 try {
 const date = new Date(dateStr);
 return new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(date);
 } catch (e) { return dateStr; }
 };

 const getDayMonth = (dateStr: string) => {
 try {
 const date = new Date(dateStr);
 return {
 month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date),
 day: new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date)
 };
 } catch (e) { return { month: 'ERR', day: '??' }; }
 };

 const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

 const formatTime = (dateStr: string) => {
 try {
 const date = new Date(dateStr);
 return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: userTz, timeZoneName: 'short' }).format(date);
 } catch (e) { return "00:00"; }
 };

 if (loading) {
 return (
 <div className="space-y-8 animate-pulse">
 <div className="flex justify-between items-center">
 <div><div className="h-7 w-40 bg-slate-200 rounded mb-2" /><div className="h-4 w-64 bg-slate-100 rounded" /></div>
 <div className="h-10 w-36 bg-slate-200 rounded-full" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {[1, 2, 3].map(i => <div key={i} className="bg-white p-6 rounded-xl border border-slate-100"><div className="h-12 w-full bg-slate-100 rounded" /></div>)}
 </div>
 <div className="grid lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-4">
 {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
 </div>
 <div className="h-48 bg-slate-100 rounded-xl" />
 </div>
 </div>
 );
 }

 // Merge API data with Client Context Data
 const apiSessions = data?.sessions || [];

 // Convert nextLessons to DashboardSession format
 const localSessions: DashboardSession[] = nextLessons.map((l, i) => ({
 id: `local-${i}`,
 subject: l.subjectName,
 tutorName: l.tutorName,
 startTime: l.dateISO,
 endTime: new Date(new Date(l.dateISO).getTime() + l.sessionLength * 60000).toISOString(),
 status: 'upcoming',
 meetingLink: '#'
 }));

 const allSessions = [...localSessions, ...apiSessions].sort((a, b) =>
 new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
 );

 const stats = {
 upcomingSessions: (data?.stats.upcomingSessions || 0) + localSessions.length,
 completedSessions: data?.stats.completedSessions || 0,
 activeSubjects: (data?.stats.activeSubjects || 0) + activeSubjects.length,
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 ">Dashboard</h1>
 <p className="text-slate-500 ">Welcome back, {user?.name?.split(' ')[0]}! Here's what's happening today.</p>
 </div>
 <a href="/subjects" className="btn-secondary inline-flex items-center gap-2">
 <BookOpen className="w-4 h-4" /> Browse Subjects
 </a>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
 <Calendar className="w-6 h-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-slate-500 ">Upcoming Sessions</p>
 <p className="text-2xl font-bold text-slate-900 ">{stats.upcomingSessions}</p>
 </div>
 </div>
 </div>
 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-lg bg-amber-50 text-secondary flex items-center justify-center">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-slate-500 ">Completed Sessions</p>
 <p className="text-2xl font-bold text-slate-900 ">{stats.completedSessions}</p>
 </div>
 </div>
 </div>
 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
 <BookOpen className="w-6 h-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-slate-500 ">Active Subjects</p>
 <p className="text-2xl font-bold text-slate-900 ">{stats.activeSubjects}</p>
 </div>
 </div>
 </div>
 </div>

 <div className="grid lg:grid-cols-3 gap-8">

 {/* Main Column: Sessions & Subjects */}
 <div className="lg:col-span-2 space-y-8">

 {/* Active Subjects Card (New) */}
 {activeSubjects.length > 0 && (
 <div className="space-y-4">
 <h2 className="text-lg font-bold text-slate-900 ">Your Subjects</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {activeSubjects.map((sub, i) => (
 <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
 <div>
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-bold text-slate-900 ">{sub.subjectName}</h3>
 <span className="text-xl" title={sub.planTier}>{tierEmojis[sub.planTier] || '🎓'}</span>
 </div>
 <p className="text-sm text-slate-500 mb-1">Tutor: <span className="text-slate-700 font-medium">{sub.tutorName}</span></p>
 <p className="text-xs text-slate-400">{sub.frequency} • {sub.sessionLength} mins</p>
 </div>
 <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
 <a href={`/classroom/${sub.subjectSlug}`} className="text-xs font-bold text-primary hover:underline uppercase tracking-wide">
 Enter Classroom
 </a>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Upcoming Sessions List */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-lg font-bold text-slate-900 ">Upcoming Sessions</h2>
 <a href="/dashboard/sessions" className="text-sm text-secondary hover:underline">View all</a>
 </div>

 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
 {allSessions.length > 0 ? (
 allSessions.slice(0, 5).map((session) => {
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
 <p className="text-sm text-slate-500 truncate">with {session.tutorName} • {formatTime(session.startTime)} - {formatTime(session.endTime)}</p>
 </div>
 <Button
 size="sm"
 className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
 onClick={handleJoin}
 >
 <Video className="w-3.5 h-3.5" />
 Join
 </Button>
 </div>
 );
 })
 ) : (
 <div className="p-8 text-center text-slate-500 ">
 <p className="mb-4">No upcoming sessions scheduled.</p>
 <a href="/subjects" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
 <Plus className="w-4 h-4" /> Book a session
 </a>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Right Column: Progress */}
 <div className="space-y-6">
 <h2 className="text-lg font-bold text-slate-900 ">Recent Progress</h2>
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
 {(data?.progress || []).length > 0 ? (
 data!.progress.map((p) => (
 <div key={p.id} className="flex items-start gap-3">
 <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
 <BookOpen className="w-4 h-4" />
 </div>
 <div className="min-w-0">
 <p className="text-sm font-medium text-slate-900 truncate">
 {p.subject} — {p.metricType}
 </p>
 <p className="text-xs text-slate-500 ">
 Score: {p.value}% • {formatDate(p.recordedAt)}
 </p>
 </div>
 </div>
 ))
 ) : (
 <p className="text-sm text-slate-500 text-center py-4">No progress records yet.</p>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
