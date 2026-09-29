
import { ArrowLeft, Star, ArrowRight, BookOpen, MapPin, Mail, Phone, Users, HelpCircle, Briefcase, Eye, Target, Compass } from "lucide-react";
import { availableTutors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { brandStory, differentiators } from "@/content/site-content";

export default function GenericMarketingPage({ params }: { params: { slug: string } }) {
    const knownSlugs = [
        "gcse-maths", "gcse-biology", "gcse-chemistry", "gcse-physics",
        "a-level-philosophy", "gcse-english-literature", "gcse-english-language",
        "a-level-politics", "gcse-spanish", "gcse-geography", "gcse-history",
        "subjects", "about-the-lms", "careers", "faq", "resources", "contact"
    ];

    if (!params.slug || !knownSlugs.includes(params.slug)) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white ">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
                    😕
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
                <p className="text-slate-600 mb-8 max-w-md text-lg">
                    We couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="flex gap-4">
                    <a href="/" className="btn-secondary">Go Home</a>
                    <a href="/subjects" className="px-6 py-3 rounded-full font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                        Browse Subjects
                    </a>
                </div>
            </div>
        );
    }

    // --- STATIC PAGE CONTENT RENDERING ---

    // 1. FAQ Page
    if (params.slug === 'faq') {
        return (
            <div className="min-h-screen bg-white ">
                <div className="bg-primary text-white pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
                    <div className="container-custom text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-slate-300 max-w-2xl mx-auto">Got questions? We've got answers. Everything you need to know about Let's Go Tutors.</p>
                    </div>
                </div>
                <div className="container-custom py-8 sm:py-12 lg:py-16">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            { q: "How are tutors vetted?", a: "Every tutor undergoes a rigorous selection process, including an interview, mock lesson, and full DBS check. Only 5% of applicants make it to our platform." },
                            { q: "Can I switch tutors?", a: "Absolutely. We offer a 'Perfect Match Guarantee'. If you don't click with your tutor after the first session, we'll find you a new one for free." },
                            { q: "How do online sessions work?", a: "We use a proprietary virtual classroom with interactive whiteboards, screen sharing, and recording capabilities so you can revisit lessons anytime." },
                            { q: "What is the cancellation policy?", a: "You can cancel or reschedule any session for free up to 24 hours before the start time." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 ">
                                <h3 className="flex items-start gap-3 font-bold text-lg text-slate-900 mb-2">
                                    <HelpCircle className="w-6 h-6 text-secondary shrink-0" />
                                    {item.q}
                                </h3>
                                <p className="text-slate-600 pl-9 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 2. About Page
    if (params.slug === 'about-the-lms') {
        const vmpCards = [
            { data: differentiators.vision, icon: <Eye className="w-6 h-6" />, color: "from-slate-800 to-slate-900" },
            { data: differentiators.mission, icon: <Target className="w-6 h-6" />, color: "from-orange-500 to-orange-600" },
            { data: differentiators.process, icon: <Compass className="w-6 h-6" />, color: "from-cyan-500 to-cyan-600" },
        ];
        return (
            <div className="min-h-screen bg-white ">
                {/* Hero */}
                <div className="bg-primary text-white pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
                    <div className="container-custom text-center max-w-3xl mx-auto">
                        <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-4">{brandStory.sectionTitle}</p>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">{brandStory.headline}</h1>
                        <p className="text-blue-100 text-lg leading-relaxed">{differentiators.description}</p>
                    </div>
                </div>

                {/* Vision / Mission / Process cards */}
                <div className="container-custom py-8 sm:py-12 lg:py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {vmpCards.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-5`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.data.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.data.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Let's Go Tutors Story */}
                <div className="container-custom pb-10 sm:pb-16 lg:pb-20">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-6">
                            {brandStory.paragraphs.map((p, i) => (
                                <p key={i} className={`text-slate-700 leading-relaxed ${p.length < 60 ? 'text-xl font-bold text-slate-900 ' : 'text-lg'}`}>
                                    {p}
                                </p>
                            ))}
                        </div>
                        <div className="mt-12 p-8 bg-white rounded-2xl border border-slate-100 text-center">
                            <p className="text-lg text-slate-700 font-medium mb-6">{brandStory.callToAction}</p>
                            <a href="/register" className="btn-secondary inline-block">Join Let's Go Tutors Today <ArrowRight className="w-4 h-4 inline ml-1" /></a>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white py-10 sm:py-16 border-t border-slate-100">
                    <div className="container-custom grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-8">
                            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
                            <p className="text-slate-600 ">Active Tutors</p>
                        </div>
                        <div className="p-8">
                            <h3 className="text-4xl font-bold text-secondary mb-2">10k+</h3>
                            <p className="text-slate-600 ">Sessions Completed</p>
                        </div>
                        <div className="p-8">
                            <h3 className="text-4xl font-bold text-cyan-600 mb-2">98%</h3>
                            <p className="text-slate-600 ">Pass Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Contact Page
    if (params.slug === 'contact') {
        return (
            <div className="min-h-screen bg-white ">
                <div className="container-custom pt-32 pb-10 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-primary p-10 text-white md:w-2/5 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
                                <p className="text-blue-100 mb-8">We'd love to hear from you. Fill out the form or reach out directly.</p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Mail className="w-5 h-5 text-secondary" />
                                        <span>info@letsgotutors.com</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone className="w-5 h-5 text-secondary" />
                                        <span>+44 123 456 7890</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <MapPin className="w-5 h-5 text-secondary" />
                                        <span>123 Education Lane, London</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12">
                                <p className="text-sm text-blue-200">Office Hours: Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>
                        <div className="p-10 md:w-3/5">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <input className="w-full h-10 px-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-secondary focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <input className="w-full h-10 px-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-secondary focus:outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <input type="email" className="w-full h-10 px-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-secondary focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Message</label>
                                    <textarea className="w-full h-32 p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-secondary focus:outline-none" />
                                </div>
                                <Button className="w-full btn-secondary">Send Message</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Careers Page
    if (params.slug === 'careers') {
        return (
            <div className="min-h-screen bg-white ">
                <div className="bg-primary text-white pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">Join Our Mission</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">We're looking for passionate educators and innovators to help us shape the future of learning.</p>
                </div>
                <div className="container-custom py-10 sm:py-16 lg:py-20">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Open Positions</h2>
                    <div className="grid gap-6">
                        {[
                            { title: "Senior Mathematics Tutor", type: "Part-time / Remote", dept: "Education" },
                            { title: "A-Level Science Specialist", type: "Full-time / Remote", dept: "Education" },
                            { title: "Student Success Manager", type: "Full-time / London", dept: "Operations" },
                            { title: "Full Stack Developer", type: "Full-time / Remote", dept: "Engineering" },
                        ].map((job, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-slate-200 hover:border-secondary transition-colors group cursor-pointer bg-white ">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-secondary transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 5. Resources Page
    if (params.slug === 'resources') {
        const resourceCategories = [
            { title: "GCSE Revision Guides", desc: "Comprehensive study notes and revision materials for all GCSE subjects, aligned with AQA, Edexcel, and OCR exam boards.", href: "/subjects", icon: <BookOpen className="w-6 h-6" /> },
            { title: "A-Level Study Materials", desc: "In-depth resources for A-Level students including past paper walkthroughs, topic summaries, and exam technique guides.", href: "/subjects", icon: <Star className="w-6 h-6" /> },
            { title: "Subject Guides", desc: "Browse our full catalogue of subjects and find expert tutors matched to your learning goals.", href: "/subjects", icon: <Users className="w-6 h-6" /> },
        ];
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-primary text-white pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
                    <div className="container-custom text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">Student Resources</h1>
                        <p className="text-blue-100 max-w-2xl mx-auto text-lg">Everything you need to support your learning journey — from revision guides to subject-specific study materials.</p>
                    </div>
                </div>
                <div className="container-custom py-10 sm:py-16 lg:py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {resourceCategories.map((cat, i) => (
                            <a key={i} href={cat.href} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group no-underline">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-orange-500 text-white flex items-center justify-center mb-5">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-secondary transition-colors">{cat.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{cat.desc}</p>
                            </a>
                        ))}
                    </div>
                    <div className="mt-16 text-center bg-slate-50 rounded-2xl p-10 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Need Personalised Help?</h2>
                        <p className="text-slate-600 max-w-xl mx-auto mb-6">Our expert tutors can create custom study plans tailored to your exam board, learning style, and goals.</p>
                        <a href="/register" className="btn-secondary inline-block">Find a Tutor <ArrowRight className="w-4 h-4 inline ml-1" /></a>
                    </div>
                </div>
            </div>
        );
    }

    // --- DYNAMIC CONTENT (SUBJECTS / TUTORS) ---

    const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    // Logic to find relevant tutors
    const searchTerms = params.slug.split('-').filter(term => !['gcse', 'a', 'level', 'subjects', 'the', 'lms', 'resources'].includes(term));
    const showAll = params.slug === 'subjects';

    const tutors = availableTutors.filter(tutor => {
        if (showAll) return true;
        if (searchTerms.length === 0) return false;

        return tutor.subjects.some(subject =>
            searchTerms.some(term => {
                const subjectLower = subject.toLowerCase();
                if (term === 'maths') return subjectLower.includes('math');
                return subjectLower.includes(term);
            })
        );
    });

    return (
        <div className="min-h-screen bg-white/50">
            <div className="bg-white border-b border-slate-200 ">
                <div className="container-custom pt-32 pb-12 md:pt-40 md:pb-20">
                    <a href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </a>

                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">{title}</h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                            {showAll
                                ? "Browse our comprehensive list of expert tutors. Filter by subject and find the perfect match for your academic goals."
                                : `Master ${title} with expert tuition. Our vetted tutors provide personalized support to help you improve your grades and build confidence.`
                            }
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/register" className="btn-secondary">
                                {showAll ? "Get Started" : `Find a ${title} Tutor`}
                            </a>
                            <a href="/resources" className="px-6 py-3 rounded-full font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-white transition-colors shadow-sm">
                                View Resources
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8 sm:py-12 lg:py-16">
                {/* Tutors Section */}
                {searchTerms.length > 0 || showAll ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 ">
                                {showAll ? "All Expert Tutors" : `Available Tutors for ${title}`}
                            </h2>
                            <span className="text-sm text-slate-500 font-medium">{tutors.length} tutors available</span>
                        </div>

                        {tutors.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tutors.map(tutor => (
                                    <div key={tutor.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                                        <div className="p-6 flex gap-5 items-start">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md relative">
                                                {tutor.imageUrl ? (
                                                    <img src={tutor.imageUrl} alt={tutor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                                                        {tutor.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-secondary transition-colors">{tutor.name}</h3>
                                                <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium mt-1">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span>{tutor.rating}</span>
                                                    <span className="text-slate-400 font-normal">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 mt-2">£{tutor.hourlyRate}<span className="font-normal text-slate-500 ">/hr</span></p>
                                            </div>
                                        </div>

                                        <div className="px-6 pb-6 flex-1">
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">{tutor.bio}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {tutor.subjects.slice(0, 3).map(sub => (
                                                    <span key={sub} className="px-2.5 py-1 bg-white text-slate-600 text-xs rounded-md font-medium border border-slate-100">
                                                        {sub}
                                                    </span>
                                                ))}
                                                {tutor.subjects.length > 3 && (
                                                    <span className="px-2.5 py-1 bg-white text-slate-500 text-xs rounded-md font-medium border border-slate-100">
                                                        +{tutor.subjects.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/50 border-t border-slate-100 mt-auto">
                                            <a href="/register" className="w-full block">
                                                <Button className="w-full btn-secondary shadow-sm hover:shadow group-hover:bg-secondary/90">
                                                    View Profile <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No tutors found</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-6">
                                    We don't have any tutors listed for {title} right now. Our network is growing daily!
                                </p>
                                <a href="/register" className="text-secondary hover:underline font-semibold">
                                    Register to get notified
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Content Coming Soon</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We are currently updating our {title} page with the latest information. Please check back shortly.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
