
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Search, Star, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn, useDebouncedValue } from "@/lib/utils";

interface ApiSession {
    id: string;
    subject: string;
    tutorName?: string;
    studentName?: string;
    startTime: string;
    endTime: string;
    status: string;
    meetingLink?: string;
    zoomJoinUrl?: string;
}

interface ApiTutor {
    id: string;
    name: string;
    bio: string | null;
    hourlyRate: number | null;
    subjects: string[];
    verificationStatus: string;
}

export default function SessionsPage() {
    const [view, setView] = useState<"list" | "book">("list");
    const [sessionFilter, setSessionFilter] = useState<"upcoming" | "past">("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebouncedValue(searchQuery, 300);
    const [selectedSubject, setSelectedSubject] = useState("All");

    const [sessions, setSessions] = useState<ApiSession[]>([]);
    const [tutors, setTutors] = useState<ApiTutor[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingTutors, setLoadingTutors] = useState(false);

    // Fetch sessions from dashboard API
    useEffect(() => {
        setLoadingSessions(true);
        api<{ sessions: ApiSession[] }>('/student/dashboard')
            .then(data => setSessions(data.sessions || []))
            .catch(() => setSessions([]))
            .finally(() => setLoadingSessions(false));
    }, []);

    // Fetch tutors when switching to book view
    useEffect(() => {
        if (view !== 'book') return;
        setLoadingTutors(true);
        api<{ tutors: ApiTutor[] }>('/student/tutors')
            .then(data => setTutors(data.tutors || []))
            .catch(() => setTutors([]))
            .finally(() => setLoadingTutors(false));
    }, [view]);

    const allSubjects = ["All", ...Array.from(new Set(tutors.flatMap(t => t.subjects)))];

    const filteredTutors = tutors.filter(tutor => {
        const matchesSearch = tutor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            tutor.subjects.some(s => s.toLowerCase().includes(debouncedSearch.toLowerCase()));
        const matchesSubject = selectedSubject === "All" || tutor.subjects.includes(selectedSubject);
        return matchesSearch && matchesSubject;
    });

    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: userTz, timeZoneName: 'short' }).format(date);
    };

    // Split sessions into upcoming/past
    const now = new Date();
    const upcomingSessions = sessions.filter(s => new Date(s.startTime) >= now && s.status === 'UPCOMING');
    const pastSessions = sessions.filter(s => new Date(s.startTime) < now || s.status === 'COMPLETED');
    const displayedSessions = sessionFilter === "upcoming" ? upcomingSessions : pastSessions;

    if (view === "book") {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setView("list")} className="gap-2 pl-0 hover:bg-transparent hover:text-secondary">
                        <ArrowLeft className="w-4 h-4" /> Back to My Sessions
                    </Button>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Book a Session</h1>
                    <p className="text-slate-500">Find the perfect tutor to help you achieve your goals.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-full md:flex-1 space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by name or subject..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Subject</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                </div>

                {loadingTutors ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredTutors.map((tutor) => (
                            <div key={tutor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-6 flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-slate-600 font-bold text-lg">
                                        {tutor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {tutor.subjects.slice(0, 3).map(sub => (
                                                <span key={sub} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 pb-4 flex-1">
                                    <p className="text-sm text-slate-600 line-clamp-2">{tutor.bio || 'No bio available'}</p>
                                </div>
                                <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">
                                        {tutor.hourlyRate ? `£${tutor.hourlyRate}` : 'Rate TBD'}
                                        {tutor.hourlyRate && <span className="text-sm font-normal text-slate-500"> / hr</span>}
                                    </span>
                                    <a href={`/dashboard/tutors/${tutor.id}`}>
                                        <Button size="sm" className="btn-secondary">View Profile</Button>
                                    </a>
                                </div>
                            </div>
                        ))}

                        {filteredTutors.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                {tutors.length === 0
                                    ? 'No verified tutors are available yet. Check back soon!'
                                    : 'No tutors found matching your criteria.'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Sessions</h1>
                    <p className="text-slate-500">Manage your upcoming schedule and view history.</p>
                </div>
                <Button onClick={() => setView("book")} className="btn-secondary">
                    Book New Session
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                <button
                    onClick={() => setSessionFilter("upcoming")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        sessionFilter === "upcoming" ? "text-primary" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Upcoming
                    {sessionFilter === "upcoming" && (
                        <span className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => setSessionFilter("past")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        sessionFilter === "past" ? "text-primary" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Past History
                    {sessionFilter === "past" && (
                        <span className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
            </div>

            {loadingSessions ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedSessions.length > 0 ? (
                        displayedSessions.map((session) => (
                            <div key={session.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all hover:border-slate-300">
                                <div className="flex md:flex-col items-center justify-center md:w-24 shrink-0 gap-2 md:gap-0">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-700">
                                        <Calendar className="w-5 h-5 md:w-6 md:h-6 mb-1 opacity-50" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide",
                                            session.status === 'UPCOMING' ? "bg-blue-50 text-blue-700" :
                                                session.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {session.status}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">{formatDate(session.startTime)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{session.subject}</h3>
                                    <p className="text-slate-600 flex items-center gap-2 text-sm">
                                        <span className="font-medium">Tutor:</span> {session.tutorName || 'TBD'}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 md:w-40 shrink-0">
                                    {session.status === "UPCOMING" ? (
                                        <>
                                            {session.zoomJoinUrl ? (
                                                <a href={session.zoomJoinUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                                    <Button className="w-full gap-1.5"><Video className="w-4 h-4" />Join Meeting</Button>
                                                </a>
                                            ) : session.meetingLink ? (
                                                <a href={session.meetingLink} className="w-full">
                                                    <Button className="w-full">Join Meeting</Button>
                                                </a>
                                            ) : (
                                                <Button className="w-full" disabled>Link Pending</Button>
                                            )}
                                            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100">
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" className="w-full">
                                            View Recording
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No sessions found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                {sessionFilter === 'upcoming'
                                    ? "You don't have any upcoming sessions scheduled. Book one now to get started!"
                                    : "You haven't completed any sessions yet."}
                            </p>
                            {sessionFilter === 'upcoming' && (
                                <a href="/subjects" className="inline-block w-full sm:w-auto mt-6">
                                    <Button className="btn-secondary w-full">
                                        Browse Subjects
                                    </Button>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
