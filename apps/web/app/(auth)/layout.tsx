
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
 children,
}: {
 children?: React.ReactNode;
}) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-primary flex flex-col items-center pt-28 pb-8 px-4">
 <div className="w-full max-w-md space-y-8">
 <div className="flex items-center justify-center">
 <a href="/" className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors font-semibold">
 <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
 </a>
 </div>

 <div className="bg-white backdrop-blur-sm rounded-2xl shadow-card p-8 border border-slate-200 ">
 {children}
 </div>

 <div className="text-center text-sm text-slate-400">
 &copy; {new Date().getFullYear()} Let's Go Tutors. All rights reserved.
 </div>
 </div>
 </div>
 );
}
