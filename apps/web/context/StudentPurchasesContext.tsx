// ──────────────────────────────────────────────────────────
// Student Purchases — Supabase-backed store
// Falls back to localStorage when not authenticated
// ──────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface ActiveSubject {
 subjectSlug: string;
 subjectName: string;
 tutorId: string;
 tutorName: string;
 planTier: string;
 frequency: string;
 sessionLength: number;
 bookedAt: string; // ISO
}

export interface NextLesson {
 subjectSlug: string;
 subjectName: string;
 tutorName: string;
 dateISO: string; // ISO date-time
 displayTime: string;
 sessionLength: number;
}

export interface BookingSummaryToken {
 subjectSlug: string;
 subjectName: string;
 tutorId: string;
 tutorName: string;
 nextLessonISO: string;
 frequency: string;
 sessionLength: number;
 planTier: string;
 preferredTime: string;
}

interface StudentPurchasesState {
 activeSubjects: ActiveSubject[];
 nextLessons: NextLesson[];
}

interface StudentPurchasesContextType extends StudentPurchasesState {
 addPurchase: (token: BookingSummaryToken) => void;
 removePurchase: (subjectSlug: string) => void;
 clearAll: () => void;
 storeBookingToken: (token: BookingSummaryToken) => void;
 retrieveBookingToken: () => BookingSummaryToken | null;
 clearBookingToken: () => void;
}

const PURCHASES_KEY = 'lgt_student_purchases';
const BOOKING_TOKEN_KEY = 'lgt_booking_token';

function loadLocalPurchases(): StudentPurchasesState {
 try {
 const raw = localStorage.getItem(PURCHASES_KEY);
 return raw ? JSON.parse(raw) : { activeSubjects: [], nextLessons: [] };
 } catch { return { activeSubjects: [], nextLessons: [] }; }
}

function saveLocalPurchases(state: StudentPurchasesState) {
 localStorage.setItem(PURCHASES_KEY, JSON.stringify(state));
}

const StudentPurchasesContext = createContext<StudentPurchasesContextType | null>(null);

export function StudentPurchasesProvider({ children }: { children: React.ReactNode }) {
 const { user } = useAuth();
 const [state, setState] = useState<StudentPurchasesState>(loadLocalPurchases);

 // Load bookings from Supabase when user is authenticated
 useEffect(() => {
 if (!user) return;

 const loadFromSupabase = async () => {
 const { data, error } = await supabase
 .from('bookings')
 .select('*')
 .eq('user_id', user.id)
 .order('booked_at', { ascending: false });

 if (error || !data) return;

 const bookings = data as any[];

 const activeSubjects: ActiveSubject[] = bookings.map((b: any) => ({
 subjectSlug: b.subject_slug,
 subjectName: b.subject_name,
 tutorId: b.tutor_id,
 tutorName: b.tutor_name,
 planTier: b.plan_tier,
 frequency: b.frequency,
 sessionLength: b.session_length,
 bookedAt: b.booked_at,
 }));

 const nextLessons: NextLesson[] = bookings.map((b: any) => {
 const start = new Date(b.next_lesson_iso);
 const end = new Date(start.getTime() + b.session_length * 60000);
 const displayTime = `${start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
 return {
 subjectSlug: b.subject_slug,
 subjectName: b.subject_name,
 tutorName: b.tutor_name,
 dateISO: b.next_lesson_iso,
 displayTime,
 sessionLength: b.session_length,
 };
 });

 const newState = { activeSubjects, nextLessons };
 setState(newState);
 saveLocalPurchases(newState); // Sync to local cache
 };

 loadFromSupabase();
 }, [user]);

 // Persist to localStorage on every change
 useEffect(() => { saveLocalPurchases(state); }, [state]);

 const addPurchase = useCallback(async (token: BookingSummaryToken) => {
 // Prevent duplicates
 if (state.activeSubjects.some(s => s.subjectSlug === token.subjectSlug)) return;

 // Save to Supabase if authenticated
 if (user) {
 await supabase.from('bookings').insert({
 user_id: user.id,
 subject_slug: token.subjectSlug,
 subject_name: token.subjectName,
 tutor_id: token.tutorId,
 tutor_name: token.tutorName,
 plan_tier: token.planTier,
 frequency: token.frequency,
 session_length: token.sessionLength,
 next_lesson_iso: token.nextLessonISO,
 preferred_time: token.preferredTime,
 } as any);
 }

 setState(prev => {
 if (prev.activeSubjects.some(s => s.subjectSlug === token.subjectSlug)) return prev;

 const endTime = new Date(new Date(token.nextLessonISO).getTime() + token.sessionLength * 60000);
 const displayTime = `${new Date(token.nextLessonISO).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

 return {
 activeSubjects: [
 ...prev.activeSubjects,
 {
 subjectSlug: token.subjectSlug,
 subjectName: token.subjectName,
 tutorId: token.tutorId,
 tutorName: token.tutorName,
 planTier: token.planTier,
 frequency: token.frequency,
 sessionLength: token.sessionLength,
 bookedAt: new Date().toISOString(),
 },
 ],
 nextLessons: [
 ...prev.nextLessons,
 {
 subjectSlug: token.subjectSlug,
 subjectName: token.subjectName,
 tutorName: token.tutorName,
 dateISO: token.nextLessonISO,
 displayTime,
 sessionLength: token.sessionLength,
 },
 ],
 };
 });
 }, [user, state.activeSubjects]);

 const removePurchase = useCallback(async (subjectSlug: string) => {
 // Remove from Supabase if authenticated
 if (user) {
 await supabase
 .from('bookings')
 .delete()
 .eq('user_id', user.id)
 .eq('subject_slug', subjectSlug);
 }

 setState(prev => ({
 activeSubjects: prev.activeSubjects.filter(s => s.subjectSlug !== subjectSlug),
 nextLessons: prev.nextLessons.filter(l => l.subjectSlug !== subjectSlug),
 }));
 }, [user]);

 const clearAll = useCallback(async () => {
 if (user) {
 await supabase
 .from('bookings')
 .delete()
 .eq('user_id', user.id);
 }
 setState({ activeSubjects: [], nextLessons: [] });
 }, [user]);

 const storeBookingToken = useCallback((token: BookingSummaryToken) => {
 sessionStorage.setItem(BOOKING_TOKEN_KEY, JSON.stringify(token));
 }, []);

 const retrieveBookingToken = useCallback((): BookingSummaryToken | null => {
 try {
 const raw = sessionStorage.getItem(BOOKING_TOKEN_KEY);
 return raw ? JSON.parse(raw) : null;
 } catch { return null; }
 }, []);

 const clearBookingToken = useCallback(() => {
 sessionStorage.removeItem(BOOKING_TOKEN_KEY);
 }, []);

 return (
 <StudentPurchasesContext.Provider value={{
 ...state,
 addPurchase, removePurchase, clearAll,
 storeBookingToken, retrieveBookingToken, clearBookingToken,
 }}>
 {children}
 </StudentPurchasesContext.Provider>
 );
}

export function useStudentPurchases() {
 const ctx = useContext(StudentPurchasesContext);
 if (!ctx) throw new Error('useStudentPurchases must be used inside StudentPurchasesProvider');
 return ctx;
}
