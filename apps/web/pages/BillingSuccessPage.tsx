
import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Calendar, User, Award } from 'lucide-react';
import { useStudentPurchases } from '@/context/StudentPurchasesContext';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { useAuth } from '@/context/AuthContext';
import { getPrice } from '@/lib/pricing';

export default function BillingSuccessPage() {
 const { retrieveBookingToken, addPurchase, clearBookingToken } = useStudentPurchases();
 const { user } = useAuth();
 const [processed, setProcessed] = useState(false);
 const [bookingDetails, setBookingDetails] = useState<any>(null);

 useEffect(() => {
 const token = retrieveBookingToken();
 if (token && !processed) {
 setProcessed(true);
 setBookingDetails(token);

 addPurchase(token);

 const date = new Date(token.nextLessonISO);
 const displayTime = `${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${new Date(date.getTime() + token.sessionLength * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

 const [firstName, ...lastNameParts] = user?.name?.split(' ') || ["Student", ""];
 const lastName = lastNameParts.join(' ');

 const pricingResult = getPrice({
 tuitionType: token.planTier?.toLowerCase().replace(/\s*\(.*\)/, '').replace(/\s+/g, '-') || 'platinum-path',
 level: token.subjectSlug?.includes('a-level') ? 'a-level' : token.subjectSlug?.includes('11-plus') ? '11-plus' : token.subjectSlug?.includes('btec') ? 'btec' : 'gcse',
 sessionMinutes: token.sessionLength || 60,
 sessionsPerWeek: parseInt(token.frequency?.match(/\d+/)?.[0] || '4') || 4,
 });

 sendBookingConfirmationEmail({
 studentName: user?.name || "Student",
 studentEmail: user?.email || "student@letsgotutors.com",
 subjectName: token.subjectName,
 subjectSlug: token.subjectSlug,
 tutorName: token.tutorName,
 nextLessonDate: token.nextLessonISO,
 nextLessonTime: displayTime,
 frequency: token.frequency,
 sessionLength: token.sessionLength,
 planTier: token.planTier,
 amountPaid: `\u00a3${pricingResult.weekly}.00`,
 });

 clearBookingToken();
 }
 }, [retrieveBookingToken, addPurchase, clearBookingToken, processed, user]);

 return (
 <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
 <div className="max-w-md w-full bg-white rounded-3xl shadow-card overflow-hidden animate-in fade-in zoom-in duration-500 border border-slate-200 ">
 <div className="p-8 text-center text-white" style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}>
 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
 <CheckCircle2 className="w-8 h-8 text-white" />
 </div>
 <h1 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h1>
 <p className="text-white/70">Your booking has been confirmed.</p>
 </div>

 <div className="p-8">
 {bookingDetails ? (
 <div className="space-y-6">
 <div className="bg-slate-100 rounded-2xl p-4 space-y-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
 <User className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs text-slate-400 font-bold uppercase">Tutor</p>
 <p className="font-bold text-primary ">{bookingDetails.tutorName}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ">
 <Award className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs text-slate-400 font-bold uppercase">Plan</p>
 <p className="font-bold text-primary ">{bookingDetails.planTier}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
 <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
 <Calendar className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs text-slate-400 font-bold uppercase">First Session</p>
 <p className="font-bold text-primary ">
 {new Date(bookingDetails.nextLessonISO).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
 </p>
 </div>
 </div>
 </div>

 <p className="text-center text-sm text-slate-400">
 A confirmation email has been sent to your inbox. 📬
 </p>

 <a
 href="/dashboard"
 className="block w-full py-3.5 text-white font-bold rounded-2xl text-center transition-all shadow-card hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
 style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}
 >
 Go to Dashboard <ArrowRight className="w-5 h-5" />
 </a>
 </div>
 ) : (
 <div className="text-center">
 <p className="text-slate-400 mb-6">Redirecting you to your dashboard...</p>
 <a href="/dashboard" className="text-primary font-bold hover:underline">Click here if not redirected</a>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
