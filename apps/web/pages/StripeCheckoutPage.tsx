import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { api } from '../lib/api';

interface CheckoutProps {
    tier?: string;
    subject?: string;
}

export default function StripeCheckoutPage({ tier, subject }: CheckoutProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = new URLSearchParams(window.location.search);
    const tierName = tier || params.get('tier') || 'platinum-path';
    const subjectSlug = subject || params.get('subject') || '';
    const levelParam = params.get('level') || 'gcse';
    const sessionMinutes = Number(params.get('sessionMinutes') || '60');
    const sessionsPerWeek = Number(params.get('sessionsPerWeek') || '1');

    useEffect(() => {
        initCheckout();
    }, []);

    async function initCheckout() {
        try {
            const data = await api<{ url: string; error?: string }>('/checkout/create-session', {
                method: 'POST',
                body: {
                    tier: tierName,
                    level: levelParam,
                    sessionMinutes,
                    sessionsPerWeek,
                    subject: subjectSlug,
                },
            });

            if (data.error || !data.url) {
                setError(data.error || 'Failed to create checkout session');
                setLoading(false);
                return;
            }

            // Redirect to Stripe hosted checkout
            window.location.href = data.url;
        } catch (err: any) {
            if (err.status === 401) {
                // api.ts automatically redirects to login
                return;
            }
            console.error('Checkout init error:', err);
            setError(err.message || 'Something went wrong initializing payment');
            setLoading(false);
        }
    }

    const navigate = (href: string) => {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                {/* Back link */}
                <button
                    onClick={() => navigate(subjectSlug ? `/subjects/${subjectSlug}` : '/subjects')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary mb-8 transition-colors font-bold"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to subject
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card"
                        style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}>
                        <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-1">
                        Complete Your Booking
                    </h1>
                    <p className="text-sm text-slate-400">
                        {tierName} plan{subjectSlug ? ` · ${subjectSlug.replace(/-/g, ' ')}` : ''}
                    </p>
                </div>

                {/* Loading state */}
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                        <p className="text-sm text-slate-400">Redirecting to secure payment…</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="rounded-2xl bg-secondary/10 border border-secondary/20 p-6 text-center">
                        <p className="text-sm text-secondary-dark mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                initCheckout();
                            }}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-card hover:shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> SSL Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Powered by Stripe
                    </span>
                </div>
            </div>
        </section>
    );
}
