import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Star, Clock, Award, ShieldCheck, ChevronRight, X, ExternalLink, GraduationCap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getSubjectBySlug, type Subject } from '@/content/subjects';
import { getQuizForSubject } from '@/content/quizzes';
import { getStripeLinksForSubject, tierEmojis, type StripeTierLink } from '@/content/stripe-links';
import { availableTutors } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import StarterQuiz from '@/components/StarterQuiz';
import { useDocumentHead } from '@/lib/useDocumentHead';
import { SubjectStatsSection } from '@/components/ImprovementGraph';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';

interface SubjectDetailPageProps {
    slug: string;
}

// Pricing modal
function PricingModal({ subject, tiers, onClose }: { subject: Subject; tiers: StripeTierLink[]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-card max-w-lg w-full max-h-[80vh] overflow-y-auto border border-slate-200 ">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div>
                        <h3 className="text-lg font-bold text-primary ">Book {subject.name}</h3>
                        <p className="text-sm text-slate-500 ">Choose your pricing tier</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary/10 transition-colors">
                        <X className="w-4 h-4 text-primary " />
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    <p className="text-xs text-slate-400 mb-2">All prices are monthly (4 × 1hr sessions per month)</p>
                    {tiers.map(tier => (
                        <button
                            key={tier.tierName}
                            onClick={() => {
                                onClose();
                                const url = `/checkout?tier=${encodeURIComponent(tier.tierName)}&subject=${subject.slug}`;
                                window.history.pushState({}, '', url);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="flex items-center justify-between w-full p-4 rounded-2xl border border-slate-200 hover:border-secondary/40 hover:shadow-card transition-all group text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{tierEmojis[tier.tierName] || '📦'}</span>
                                <div>
                                    <p className="font-bold text-primary text-sm">{tier.tierName}</p>
                                    <p className="text-xs text-slate-400">{tier.ratio} student-to-tutor</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary ">{tier.priceLabel}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-secondary transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function SubjectDetailPage({ slug }: SubjectDetailPageProps) {
    const subject = getSubjectBySlug(slug);

    useDocumentHead({
        title: subject ? `${subject.name} Tuition` : "Subject Not Found",
        description: subject ? `Expert ${subject.name} tuition. ${subject.description}` : undefined
    });

    const { user } = useAuth();
    const [showPricing, setShowPricing] = useState(false);

    if (!subject) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-primary mb-4">Subject Not Found</h1>
                <p className="text-slate-500 mb-6">We couldn't find that subject. Browse our full catalogue below.</p>
                <a href="/subjects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-card">
                    <ArrowLeft className="w-4 h-4" /> View All Subjects
                </a>
            </div>
        );
    }

    const quiz = getQuizForSubject(slug);
    const tiers = getStripeLinksForSubject(slug);

    const subjectTerms = [subject.name.toLowerCase(), subject.level.toLowerCase()];
    const matchedTutors = availableTutors.filter(t =>
        t.subjects.some(ts => {
            const lower = ts.toLowerCase();
            return subjectTerms.some(term => lower.includes(term.replace('gcse ', '').replace('a-level ', '').replace('11+ ', '').replace('btec ', '')));
        })
    );

    function handleBook() {
        window.history.pushState({}, '', `/subjects/${slug}/book`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    const navigate = (href: string) => {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <>
            {/* Subject Hero */}
            <section className="relative bg-gradient-to-b from-slate-50 to-white pt-10 sm:pt-16 pb-8 sm:pb-12 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                    <button onClick={() => navigate('/subjects')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary mb-6 transition-colors font-semibold">
                        <ArrowLeft className="w-4 h-4" /> All Subjects
                    </button>
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center shrink-0 shadow-card`}>
                            <span className="text-3xl">{subject.icon}</span>
                        </div>
                        <div className="flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-primary/60 mb-2">
                                {subject.level}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">{subject.name}</h1>
                            <p className="text-slate-500 leading-relaxed max-w-2xl">{subject.longDescription}</p>
                        </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {subject.examBoards.map(eb => (
                            <span key={eb} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-dark text-xs font-bold flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> {eb}
                            </span>
                        ))}
                    </div>

                    {/* Key topics */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {subject.keyTopics.map(topic => (
                            <span key={topic} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium">
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Book CTA */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleBook}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-bold shadow-card hover:-translate-y-1 transition-all text-sm"
                            style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}
                        >
                            <BookOpen className="w-4 h-4" />
                            Book this Subject 🚀
                        </button>
                        <a
                            href="#quiz"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-primary/15 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-sm"
                        >
                            Try Starter Quiz
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Starter Quiz */}
            <section id="quiz" className="py-10 sm:py-16 bg-slate-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-2">📝 Starter Quiz</h2>
                        <p className="text-slate-500 text-sm">
                            Test your current knowledge with a quick 5-question quiz. No account needed.
                        </p>
                    </div>
                    <StarterQuiz quiz={quiz} />
                </div>
            </section>

            {/* Specification / Curriculum */}
            {subject.curriculum && subject.curriculum.length > 0 && (
                <section className="py-10 sm:py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-secondary" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-primary">What You'll Cover 📋</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 sm:mb-10 max-w-2xl">
                            Our {subject.name} tutoring follows the full specification across all major exam boards.
                            Here's a summary of the topics we teach and how Let's Go Tutors helps you master each one.
                        </p>

                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                            {subject.curriculum.map((item, i) => {
                                const IconComponent = item.icon ? LucideIcons[item.icon as keyof typeof LucideIcons] as React.ElementType : LucideIcons.CheckCircle;
                                return (
                                    <div
                                        key={i}
                                        className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-secondary/40 hover:shadow-card transition-all flex flex-col"
                                    >
                                        {item.image && (
                                            <div className="w-full h-32 overflow-hidden bg-slate-200 shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-start gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center text-[10px] font-bold text-secondary">
                                                            {i + 1}
                                                        </span>
                                                        <IconComponent className="shrink-0 w-4 h-4 text-slate-400 " />
                                                        <h3 className="font-bold text-primary text-sm leading-snug line-clamp-1">
                                                            {item.title.replace(/^\d+\.\s*/, '')}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 text-center">
                            <button
                                onClick={handleBook}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold shadow-card hover:-translate-y-1 transition-all text-sm"
                                style={{ background: 'linear-gradient(135deg, #0B0D2E, #334155)' }}
                            >
                                <BookOpen className="w-4 h-4" />
                                Start {subject.name} Today
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Proven Results */}
            <section className="py-10 sm:py-16 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <SubjectStatsSection subjectName={subject.name} level={subject.level} />
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

            {/* Tutors for this subject */}
            <section className="py-10 sm:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">Our Tutors for {subject.name} 👩‍🏫</h2>
                    <p className="text-slate-500 text-sm mb-8">
                        {matchedTutors.length > 0
                            ? `We have ${matchedTutors.length} experienced tutor${matchedTutors.length > 1 ? 's' : ''} for this subject.`
                            : "We're currently recruiting tutors for this subject. Register your interest and we'll match you soon."}
                    </p>

                    {matchedTutors.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                            {matchedTutors.map(tutor => (
                                <div key={tutor.id} className="card-default p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={tutor.imageUrl}
                                            alt={tutor.name}
                                            className="w-12 h-12 rounded-full object-cover bg-slate-100 ring-2 ring-secondary/20"
                                        />
                                        <div>
                                            <h3 className="font-bold text-primary text-sm">{tutor.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-secondary">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span>{tutor.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{tutor.bio}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {tutor.subjects.slice(0, 3).map(s => (
                                            <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 text-primary/60 text-[10px] font-bold">{s}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 ">
                                        <span className="text-sm font-bold text-primary ">£{tutor.hourlyRate}/hr</span>
                                        <button
                                            onClick={handleBook}
                                            className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors"
                                        >
                                            Book →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 rounded-3xl border border-dashed border-primary/15 bg-white ">
                            <p className="text-sm text-slate-500 ">Tutors coming soon for this subject.</p>
                            <button
                                onClick={() => navigate('/register')}
                                className="inline-flex items-center gap-1.5 text-sm text-secondary font-bold mt-3 hover:text-secondary-dark"
                            >
                                Register interest <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-10 sm:py-16 bg-primary text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to start {subject.name}? 🎉</h2>
                    <p className="text-white/70 mb-8">
                        Book your first session today. Your first consultation is on us.
                    </p>
                    <button
                        onClick={handleBook}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-bold shadow-card hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <BookOpen className="w-4 h-4" />
                        Book this Subject
                    </button>
                </div>
            </section>

            {/* Pricing Modal */}
            {showPricing && (
                <PricingModal subject={subject} tiers={tiers} onClose={() => setShowPricing(false)} />
            )}
        </>
    );
}
