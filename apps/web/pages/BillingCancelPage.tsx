
import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function BillingCancelPage() {
 return (
 <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
 <div className="max-w-md w-full bg-white rounded-3xl shadow-card p-8 text-center animate-in fade-in zoom-in duration-500 border border-slate-200 ">
 <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
 <XCircle className="w-8 h-8 text-secondary" />
 </div>

 <h1 className="text-2xl font-bold text-primary mb-2">Payment Cancelled</h1>
 <p className="text-slate-500 mb-8">
 Your payment was not processed. No charges have been made to your account.
 </p>

 <div className="space-y-3">
 <a
 href="/subjects"
 className="block w-full py-3 text-white font-bold rounded-2xl transition-all shadow-card hover:shadow-lg hover:-translate-y-0.5"
 style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}
 >
 Browse Subjects 📖
 </a>
 <a
 href="/dashboard"
 className="block w-full py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
 >
 Return to Dashboard
 </a>
 </div>
 </div>
 </div>
 );
}
