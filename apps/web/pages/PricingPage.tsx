import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Check,
    Rocket,
    Shield,
    Sparkles,
    Star,
    Users,
    XCircle,
} from 'lucide-react';
import { pricingTiers } from '../content/site-content';
import { getStripeLinkForTier } from '../content/stripe-links';
import { Link } from '@/components/Link';
import { useDocumentHead } from '@/lib/useDocumentHead';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';

type Level = '11+' | 'GCSE' | 'A-Level' | 'BTEC';
const LEVELS: Level[] = ['11+', 'GCSE', 'A-Level', 'BTEC'];

const TIER_KEY_BY_NAME: Record<string, string> = {
    'Mission Commander': 'platinum-path',
    'Star Navigator': 'gold-edge',
    'Space Explorer': 'silver-advantage',
    'Rocket Starter': 'bronze-boost',
    'Launch Pad': 'foundational-fixes',
    'Ground Control': 'foundational-focus',
};

const LEVEL_THEME: Record<Level, { glow: string; chip: string; ring: string }> = {
    '11+': {
        glow: 'from-cyan-500/30 via-sky-500/20 to-indigo-900/40',
        chip: 'bg-cyan-500/20 text-cyan-200 border-cyan-300/30',
        ring: 'ring-cyan-300/30',
    },
    GCSE: {
        glow: 'from-violet-500/25 via-blue-500/20 to-indigo-900/40',
        chip: 'bg-violet-500/20 text-violet-100 border-violet-300/30',
        ring: 'ring-violet-300/30',
    },
    'A-Level': {
        glow: 'from-amber-400/25 via-orange-500/20 to-indigo-900/40',
        chip: 'bg-amber-400/20 text-amber-100 border-amber-300/30',
        ring: 'ring-amber-300/30',
    },
    BTEC: {
        glow: 'from-emerald-400/25 via-teal-500/20 to-indigo-900/40',
        chip: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30',
        ring: 'ring-emerald-300/30',
    },
};

function ratioToNumber(ratio: string): number {
    const parsed = Number(ratio.split(':')[0]);
    return Number.isFinite(parsed) ? parsed : 10;
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function formatGBP(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0,
    }).format(value);
}

function appendParams(url: string, params: Record<string, string | number>): string {
    const search = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    return `${url}${url.includes('?') ? '&' : '?'}${search}`;
}

const PricingPage = () => {
    useDocumentHead({
        title: 'Pricing',
        description:
            "Flexible and affordable pricing plans for GCSE, A-Level, 11+, and BTEC tuition at Let's Go Tutors.",
    });

    const [selectedLevel, setSelectedLevel] = useState<Level>('GCSE');
    const [studentCount, setStudentCount] = useState(2);

    const tiers = pricingTiers[selectedLevel] || pricingTiers.GCSE;
    const sortedTiers = useMemo(
        () => [...tiers].sort((a, b) => b.monthlyPriceNum - a.monthlyPriceNum),
        [tiers]
    );

    const premiumTier = sortedTiers[0];
    const matchedTier = useMemo(() => {
        return sortedTiers.reduce((closest, candidate) => {
            const candidateDiff = Math.abs(ratioToNumber(candidate.ratio) - studentCount);
            const closestDiff = Math.abs(ratioToNumber(closest.ratio) - studentCount);

            if (candidateDiff < closestDiff) {
                return candidate;
            }
            if (candidateDiff === closestDiff && candidate.monthlyPriceNum > closest.monthlyPriceNum) {
                return candidate;
            }
            return closest;
        }, sortedTiers[0]);
    }, [sortedTiers, studentCount]);

    const matchedTierKey = TIER_KEY_BY_NAME[matchedTier.name] || 'silver-advantage';
    const premiumTierKey = TIER_KEY_BY_NAME[premiumTier.name] || 'platinum-path';

    const matchedCheckoutBase =
        getStripeLinkForTier('pricing', matchedTierKey)?.stripeUrl ||
        `/mock-payment?plan=${matchedTierKey}`;
    const premiumCheckoutBase =
        getStripeLinkForTier('pricing', premiumTierKey)?.stripeUrl ||
        `/mock-payment?plan=${premiumTierKey}`;

    const matchedTotalMonthly = matchedTier.monthlyPriceNum;
    const premiumTotalMonthly = premiumTier.monthlyPriceNum;
    const extraPerStudentToPremium = Math.max(premiumTier.monthlyPriceNum - matchedTier.monthlyPriceNum, 0);
    const extraToPremium = Math.max(premiumTotalMonthly - matchedTotalMonthly, 0);

    const matchedCheckoutLink = appendParams(matchedCheckoutBase, {
        qty: studentCount,
        students: studentCount,
        level: selectedLevel,
        tier: matchedTierKey,
    });
    const premiumCheckoutLink = appendParams(premiumCheckoutBase, {
        qty: studentCount,
        students: studentCount,
        level: selectedLevel,
        tier: premiumTierKey,
    });

    const pros = matchedTier.features.slice(0, 4);
    const cons = useMemo(() => {
        if (matchedTier.name === premiumTier.name) {
            return ['Higher monthly investment than group-based plans'];
        }

        const missingPremiumBenefits = premiumTier.features.filter(
            (feature) => !matchedTier.features.includes(feature)
        );

        if (missingPremiumBenefits.length === 0) {
            return ['Less personalised support than the premium path'];
        }

        return missingPremiumBenefits.slice(0, 4);
    }, [matchedTier, premiumTier]);

    const theme = LEVEL_THEME[selectedLevel];

    return (
        <div className="min-h-screen bg-[#040714] text-slate-100">
            <section className="relative overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.28),transparent_35%),linear-gradient(180deg,#0a1028_0%,#060b1d_100%)]" />
                <div
                    className={`absolute inset-x-0 top-0 h-64 bg-gradient-to-r ${theme.glow} blur-3xl opacity-90`}
                />
                <div className="absolute left-10 top-20 h-2 w-2 rounded-full bg-white/70" />
                <div className="absolute right-24 top-32 h-1.5 w-1.5 rounded-full bg-white/60" />
                <div className="absolute left-1/3 top-40 h-1 w-1 rounded-full bg-white/50" />
                <div className="absolute right-1/4 top-16 h-1 w-1 rounded-full bg-white/60" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                        <Rocket className="h-4 w-4 text-orange-300" />
                        Rocket Pricing Calculator
                    </div>

                    <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                        Build Your Tuition Mission
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
                        Adjust your course type and number of students. We match to the closest student-to-tutor plan
                        ratio, then show exactly what you gain or sacrifice.
                    </p>
                </div>
            </section>

            <section className="relative -mt-6 pb-20 lg:pb-28">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className={`lg:col-span-7 rounded-3xl border border-white/10 bg-slate-950/55 p-6 sm:p-8 shadow-[0_30px_80px_-35px_rgba(13,25,62,0.8)] backdrop-blur ${theme.ring} ring-1`}
                    >
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-2xl font-bold text-white">Mission Controls</h2>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}>
                                {selectedLevel}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-300 mb-3">
                                    Course Type
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                                                selectedLevel === level
                                                    ? 'border-white/50 bg-white/15 text-white shadow-lg'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-300 mb-3">
                                    Number Of Students
                                </label>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="text-sm text-slate-300">
                                            Current input
                                        </div>
                                        <div className="text-2xl font-bold text-white">{studentCount}</div>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={studentCount}
                                        onChange={(e) => setStudentCount(clamp(Number(e.target.value), 1, 10))}
                                        className="w-full accent-orange-400"
                                    />
                                    <div className="mt-3 flex justify-between text-xs text-slate-400">
                                        <span>1</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-orange-300/25 bg-gradient-to-br from-orange-300/20 to-fuchsia-400/10 p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-orange-100">
                                <Sparkles className="h-4 w-4" />
                                Calculated Match
                            </div>
                            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {matchedTier.emoji} {matchedTier.name}
                                    </h3>
                                    <p className="text-sm text-slate-200">{matchedTier.subtitle}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.13em] text-slate-300">
                                        Format {matchedTier.ratio}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs uppercase tracking-[0.12em] text-slate-300">
                                        Best fit for {studentCount} student{studentCount === 1 ? '' : 's'}
                                    </div>
                                    <div className="text-4xl font-bold text-white">{formatGBP(matchedTotalMonthly)}</div>
                                    <div className="text-sm text-slate-300">monthly plan price</div>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={matchedCheckoutLink}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-slate-950 px-4 py-3 text-sm font-bold transition hover:bg-slate-100"
                                >
                                    Launch This Plan
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={premiumCheckoutLink}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    Jump To Mission Commander
                                    <Rocket className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-200">
                                    All Pricing Points
                                </h3>
                                <span className="text-xs text-slate-400">
                                    Matched against {studentCount} student{studentCount === 1 ? '' : 's'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {sortedTiers.map((tier) => {
                                    const tierKey = TIER_KEY_BY_NAME[tier.name] || 'silver-advantage';
                                    const tierCheckoutBase =
                                        getStripeLinkForTier('pricing', tierKey)?.stripeUrl ||
                                        `/mock-payment?plan=${tierKey}`;
                                    const tierCheckoutLink = appendParams(tierCheckoutBase, {
                                        qty: studentCount,
                                        students: studentCount,
                                        level: selectedLevel,
                                        tier: tierKey,
                                    });
                                    const tierTotal = tier.monthlyPriceNum;
                                    const deltaVsMatched = tierTotal - matchedTotalMonthly;
                                    const isMatched = tier.name === matchedTier.name;
                                    const isPremium = tier.name === premiumTier.name;

                                    return (
                                        <div
                                            key={`${selectedLevel}-${tier.name}-all`}
                                            className={`rounded-xl border p-3.5 ${
                                                isPremium
                                                    ? 'border-amber-300/35 bg-amber-300/10'
                                                    : isMatched
                                                      ? 'border-cyan-300/35 bg-cyan-300/10'
                                                      : 'border-white/10 bg-white/[0.02]'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm font-bold text-white">
                                                            {tier.emoji} {tier.name}
                                                        </p>
                                                        <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-200">
                                                            {tier.ratio}
                                                        </span>
                                                        {isMatched && (
                                                            <span className="rounded-full bg-cyan-300/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-cyan-100">
                                                                Current Match
                                                            </span>
                                                        )}
                                                        {isPremium && (
                                                            <span className="rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-amber-100">
                                                                Premium Target
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-300">{tier.subtitle}</p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {formatGBP(tier.monthlyPriceNum)} monthly
                                                        {deltaVsMatched !== 0 && (
                                                            <span className="ml-2">
                                                                ({deltaVsMatched > 0 ? '+' : '-'}
                                                                {formatGBP(Math.abs(deltaVsMatched))} vs current)
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-white">{formatGBP(tierTotal)}</p>
                                                        <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Plan Price</p>
                                                    </div>
                                                    <Link
                                                        href={tierCheckoutLink}
                                                        className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition ${
                                                            isPremium
                                                                ? 'bg-amber-300 text-slate-950 hover:bg-amber-200'
                                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                        }`}
                                                    >
                                                        Select
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 backdrop-blur shadow-[0_30px_80px_-40px_rgba(13,25,62,0.9)]"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Mission Analysis</h2>
                            <span className="rounded-full border border-orange-300/30 bg-orange-300/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-orange-100">
                                Always Optimised To Premium
                            </span>
                        </div>

                        <div className="mt-6 rounded-2xl border border-fuchsia-300/25 bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 p-5">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Upsell Target</p>
                            <h3 className="mt-2 text-2xl font-bold text-white">
                                {premiumTier.emoji} {premiumTier.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-200">{premiumTier.subtitle}</p>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-slate-300">
                                        Premium benchmark for {selectedLevel}
                                    </p>
                                    <p className="text-4xl font-bold text-white">{formatGBP(premiumTotalMonthly)}</p>
                                    <p className="text-sm text-slate-300">monthly plan price</p>
                                </div>
                                {extraToPremium > 0 ? (
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-orange-100">
                                            +{formatGBP(extraToPremium)}/month to upgrade
                                        </p>
                                        <p className="text-xs text-orange-200/90">
                                            (+{formatGBP(extraPerStudentToPremium)} per student seat equivalent)
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-emerald-200">You are already on the top tier</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5">
                            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em] text-emerald-100">
                                    <Check className="h-4 w-4" />
                                    Pros Of Your Current Match
                                </h4>
                                <ul className="space-y-2">
                                    {pros.map((pro) => (
                                        <li key={pro} className="text-sm text-emerald-50/95 flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-200" />
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4">
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em] text-rose-100">
                                    <XCircle className="h-4 w-4" />
                                    Cons vs {premiumTier.name}
                                </h4>
                                <ul className="space-y-2">
                                    {cons.map((con) => (
                                        <li key={con} className="text-sm text-rose-50/95 flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-200" />
                                            <span>{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Link
                            href={premiumCheckoutLink}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:brightness-105"
                        >
                            Upgrade To {premiumTier.name}
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <p className="mt-3 text-xs text-slate-400 text-center">
                            Recommendation engine is intentionally biased to the highest-impact premium path.
                        </p>
                    </motion.aside>
                </div>
            </section>

            <section className="border-y border-white/10 bg-slate-950/40 py-16 lg:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Loved by Students & Parents</h2>
                        <p className="text-slate-300">Families trust our tutors to deliver measurable progress every month.</p>
                    </div>
                    <TestimonialsCarousel />
                </div>
            </section>

            <section className="py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/80 p-8 sm:p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need a custom launch plan?</h2>
                        <p className="mx-auto max-w-2xl text-slate-300 mb-8">
                            Speak with an academic advisor and we will tailor a package using these same price points,
                            then optimise it for faster grade gains.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-100 transition"
                            >
                                Join Now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10 transition"
                            >
                                Talk To An Advisor
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-cyan-300" /> Secure Stripe payments
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-cyan-300" /> DBS-checked tutors
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> 4.9/5 average rating
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
