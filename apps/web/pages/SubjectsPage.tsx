import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Filter, GraduationCap } from 'lucide-react';
import { allSubjects, type Subject } from '@/content/subjects';
import { useDocumentHead } from '@/lib/useDocumentHead';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';

const levels = ["All", "GCSE", "A-Level", "11+", "BTEC"] as const;


export default function SubjectsPage() {
    useDocumentHead({
        title: "All Subjects",
        description: "Browse our full range of GCSE, A-Level, 11+, and BTEC subjects available at Let's Go Tutors."
    });

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [level, setLevel] = useState<string>("All");

    // 150ms debounce for snappier search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 150);
        return () => clearTimeout(timer);
    }, [search]);

    const filtered = useMemo(() => {
        return allSubjects.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                s.description.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesLevel = level === "All" || s.level === level;
            return matchesSearch && matchesLevel;
        });
    }, [debouncedSearch, level]);

    const navigate = (slug: string) => {
        window.history.pushState({}, '', `/subjects/${slug}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <>
            {/* Hero */}
            <section className="relative bg-gradient-to-b from-slate-50 to-white pt-32 sm:pt-40 pb-8 sm:pb-12 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6">
                        <BookOpen className="w-4 h-4" />
                        40 subjects available
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Subject</span> 📖
                    </h1>
                    <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-6 sm:mb-8">
                        Browse our full range of GCSE, A-Level, 11+, and BTEC subjects. Every subject comes with expert tutors, starter quizzes, and flexible pricing.
                    </p>

                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search subjects…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-primary/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-shadow shadow-soft"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Level filter pills */}
            <section className="bg-white border-b border-slate-100 ">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex gap-2 py-4 overflow-x-auto">
                        {levels.map(lv => (
                            <button
                                key={lv}
                                onClick={() => setLevel(lv)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${level === lv
                                    ? 'bg-primary text-white shadow-card'
                                    : 'bg-slate-100 text-slate-600 hover:bg-primary/10'
                                    }`}
                            >
                                {lv === "All" ? "All Levels" : lv}
                            </button>
                        ))}
                        <span className="flex items-center text-sm text-slate-400 ml-auto">
                            {filtered.length} subject{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </section>

            {/* Subject Grid */}
            <section className="py-8 sm:py-12 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <GraduationCap className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                            <p className="text-slate-400">No subjects match your search. Try different keywords or filter.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {filtered.map((subject, idx) => (
                                <button
                                    key={subject.slug}
                                    onClick={() => navigate(subject.slug)}
                                    className="relative group text-left card-default p-5"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`text-2xl w-11 h-11 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center shrink-0 shadow-soft`}>
                                            <span className="text-lg">{subject.icon}</span>
                                        </span>
                                        <div className="min-w-0">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-primary/60 mb-1.5">
                                                {subject.level}
                                            </span>
                                            <h3 className="text-sm font-bold text-primary group-hover:text-primary transition-colors truncate">
                                                {subject.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                {subject.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-10 sm:py-16 bg-white overflow-hidden border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Don't Just Take Our Word For It</h2>
                        <p className="text-slate-500 ">See what our students and parents have to say.</p>
                    </div>
                    <TestimonialsCarousel />
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-10 sm:py-16 bg-primary text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Can't find your subject? 🤔</h2>
                    <p className="text-white/70 mb-8">
                        We're always adding new subjects. Get in touch and we'll do our best to match you with the right tutor.
                    </p>
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-bold shadow-card hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        Get Started 🚀
                    </a>
                </div>
            </section>
        </>
    );
}
