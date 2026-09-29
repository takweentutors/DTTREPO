"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function BillingPage() {
    const [managing, setManaging] = useState(false);
    const [noTransactions, setNoTransactions] = useState<string | null>(null);

    const handleManageBilling = async () => {
        setManaging(true);
        setNoTransactions(null);
        try {
            const data = await api<{ url?: string; error?: string }>('/student/billing-portal', { method: 'POST' });
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                // Friendly "no transactions" message from the server
                setNoTransactions(data.error);
            } else {
                setNoTransactions('Could not open billing portal. You may not have an active subscription yet.');
            }
        } catch (err) {
            console.error(err);
            setNoTransactions('An error occurred while opening the billing portal. Please try again later.');
        } finally {
            setManaging(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Billing & Subscriptions</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    We've partnered with Stripe for secure, seamless subscription management.
                    You can view your invoices, update your payment methods, cancel or switch plans directly in the Customer Portal.
                </p>
            </div>

            {/* No Transactions Yet — Friendly Card */}
            {noTransactions && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <Inbox className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No transactions yet</h3>
                    <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                        {noTransactions}
                    </p>
                    <a
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-green-600 text-white rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-md"
                    >
                        Browse Plans <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12 relative">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none"></div>

                <div className="relative p-8 md:p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 text-secondary">
                        <CreditCard className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Portal</h2>
                    <p className="text-slate-600 mb-3 max-w-md mx-auto">
                        Access your fully self-serve billing environment. Download receipts, view upcoming charges, and control your subscription.
                    </p>
                    <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
                        You can also <strong>cancel your subscription</strong> or <strong>switch to a different plan</strong> at any time.
                    </p>

                    <Button
                        onClick={handleManageBilling}
                        disabled={managing}
                        size="lg"
                        className="bg-secondary hover:bg-green-600 text-white rounded-full px-8 h-14 text-lg font-bold shadow-glow hover:scale-105 transition-all w-full sm:w-auto flex items-center gap-2"
                    >
                        {managing ? "Connecting securely..." : "Open Stripe Customer Portal"}
                        {!managing && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>

                    <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Payments are securely processed by Stripe
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-sm">
                    Having trouble accessing the portal? <a href="/contact" className="text-secondary hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
