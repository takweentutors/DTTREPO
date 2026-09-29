import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import type { CalendarData, CalendarSession } from '@/lib/admin-types';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: '#3B82F6',
    COMPLETED: '#00D4FF',
    CANCELLED: '#EF4444',
};

export default function AdminCalendarPage() {
    const [data, setData] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tutorFilter, setTutorFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [selectedSession, setSelectedSession] = useState<CalendarSession | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const fetchData = (start: string, end: string) => {
        setLoading(true);
        const params = new URLSearchParams({ start, end });
        if (tutorFilter) params.set('tutorId', tutorFilter);
        if (subjectFilter) params.set('subjectId', subjectFilter);

        api<CalendarData>(`/admin/calendar/sessions?${params}`)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        fetchData(start, end);
    }, [tutorFilter, subjectFilter]);

    const handleDatesSet = (info: { start: Date; end: Date }) => {
        fetchData(info.start.toISOString(), info.end.toISOString());
    };

    const events = data?.sessions.map((s) => ({
        id: s.id,
        title: `${s.tutorName} - ${s.subject}`,
        start: s.startTime,
        end: s.endTime,
        backgroundColor: STATUS_COLORS[s.status] || '#6B7280',
        borderColor: 'transparent',
        extendedProps: s,
    })) || [];

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Calendar" subtitle="Master view of all sessions and tutor availability" />

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    value={tutorFilter}
                    onChange={(e) => setTutorFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                    <option value="">All Tutors</option>
                    {data?.tutors.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                    <option value="">All Subjects</option>
                    {data?.subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <div className="flex items-center gap-4 text-xs text-slate-500 ml-auto">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Upcoming</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Cancelled</span>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                {loading && !data ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
                    </div>
                ) : (
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        events={events}
                        datesSet={handleDatesSet}
                        eventClick={(info) => {
                            setSelectedSession(info.event.extendedProps as CalendarSession);
                        }}
                        height="auto"
                        slotMinTime="07:00:00"
                        slotMaxTime="22:00:00"
                        allDaySlot={false}
                        nowIndicator
                        eventDisplay="block"
                        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    />
                )}
            </div>

            {/* Session Detail Modal */}
            {selectedSession && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSession(null)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Session Details</h2>
                            <button onClick={() => setSelectedSession(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Subject</span>
                                <span className="text-sm font-medium text-slate-900">{selectedSession.subject}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Tutor</span>
                                <span className="text-sm font-medium text-slate-900">{selectedSession.tutorName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Student</span>
                                <span className="text-sm font-medium text-slate-900">{selectedSession.studentName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Time</span>
                                <span className="text-sm font-medium text-slate-900">
                                    {new Date(selectedSession.startTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                                    {' — '}
                                    {new Date(selectedSession.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Status</span>
                                <StatusBadge status={selectedSession.status} />
                            </div>
                            {selectedSession.meetingLink && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Meeting Link</span>
                                    <a href={selectedSession.meetingLink} target="_blank" rel="noreferrer"
                                        className="text-sm text-secondary hover:underline font-medium">
                                        Join
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
