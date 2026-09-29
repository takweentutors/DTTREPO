// ──────────────────────────────────────────────────────────
// Centralised content for Let's Go Tutors
// ──────────────────────────────────────────────────────────

/* ── Hero Section ── */
export const hero = {
 headline: "Launch Your Learning Journey with Let's Go Tutors",
 subheadline:
 "Blast off to academic success with our cutting-edge LMS — trusted by thousands of students to reach new heights.",
 cta: { label: "Get Started", href: "/register" },
 ctaSecondary: { label: "Choose Plan", href: "/pricing" },
};

/* ── Subject Buttons ── */
export const subjects = [
 { name: "Maths", slug: "/subjects/gcse-maths", icon: "📐" },
 { name: "Biology", slug: "/subjects/gcse-biology", icon: "🧬" },
 { name: "Chemistry", slug: "/subjects/gcse-chemistry", icon: "🧪" },
 { name: "Physics", slug: "/subjects/gcse-physics", icon: "⚡" },
 { name: "Philosophy", slug: "/subjects/a-level-philosophy", icon: "💭" },
 { name: "English Lit", slug: "/subjects/gcse-english-literature", icon: "📚" },
 { name: "English Lang", slug: "/subjects/gcse-english-language", icon: "📝" },
 { name: "Politics", slug: "/subjects/a-level-politics", icon: "🏛️" },
 { name: "Spanish", slug: "/subjects/gcse-spanish", icon: "🇪🇸" },
 { name: "Geography", slug: "/subjects/gcse-geography", icon: "🌍" },
 { name: "History", slug: "/subjects/gcse-history", icon: "🏰" },
];

/* ── Pricing Tiers ── */
export interface PricingTier {
 name: string;
 emoji: string;
 subtitle: string;
 ratio: string;
 price: string;
 period: string;
 features: string[];
 highlight: boolean;
 monthlyPriceNum: number; // Numeric value for calculations
}

// ──────────────────────────────────────────────────────────
// PRICING: All prices shown are MONTHLY (4 sessions × 1 hr per month)
// ──────────────────────────────────────────────────────────

export const pricingTiers: Record<string, PricingTier[]> = {
 '11+': [
 {
 name: "Mission Commander",
 emoji: "🏆",
 subtitle: "Premium Personalised Excellence",
 ratio: "1:1",
 price: "£125",
 period: "/ month",
 monthlyPriceNum: 125,
 features: [
 "Fully personalised 11+ learning plan",
 "Direct 1:1 tutor attention every session",
 "Exam technique & interview preparation",
 "Monthly performance reports to parents",
 "24/7 resource access via LMS",
 "Tutor matching based on learning style",
 ],
 highlight: true,
 },
 {
 name: "Star Navigator",
 emoji: "🥇",
 subtitle: "Focused Partnership",
 ratio: "2:1",
 price: "£75",
 period: "/ month",
 monthlyPriceNum: 75,
 features: [
 "Small pair-based learning",
 "Personalised lesson plans",
 "Exam technique support",
 "Progress tracking & feedback",
 "Homework review sessions",
 "Parent communication updates",
 ],
 highlight: false,
 },
 {
 name: "Space Explorer",
 emoji: "🥈",
 subtitle: "Collaborative Learning",
 ratio: "3:1",
 price: "£50",
 period: "/ month",
 monthlyPriceNum: 50,
 features: [
 "Close-knit group of three",
 "Structured lesson plans",
 "Peer discussion & confidence building",
 "Progress tracking",
 "Homework feedback",
 "Monthly reports",
 ],
 highlight: false,
 },
 {
 name: "Rocket Starter",
 emoji: "🥉",
 subtitle: "Group Support",
 ratio: "5:1",
 price: "£30",
 period: "/ month",
 monthlyPriceNum: 30,
 features: [
 "Affordable group sessions",
 "Group problem solving",
 "Exam-style practice papers",
 "Regular topic reviews",
 "Shared resource access",
 ],
 highlight: false,
 },
 {
 name: "Launch Pad",
 emoji: "✏️",
 subtitle: "Affordable Exam Prep",
 ratio: "6:1",
 price: "£25",
 period: "/ month",
 monthlyPriceNum: 25,
 features: [
 "Targeted exam preparation",
 "Key topic revision sessions",
 "Practice paper walkthroughs",
 "Group Q&A sessions",
 "Basic progress tracking",
 ],
 highlight: false,
 },
 {
 name: "Ground Control",
 emoji: "📘",
 subtitle: "Lowest Cost Access",
 ratio: "10:1",
 price: "£15",
 period: "/ month",
 monthlyPriceNum: 15,
 features: [
 "Maximum affordability",
 "Structured group revision",
 "Core concept coverage",
 "Exam tips & techniques",
 "Access to learning resources",
 ],
 highlight: false,
 },
 ],
 'GCSE': [
 {
 name: "Mission Commander",
 emoji: "🏆",
 subtitle: "Premium Personalised Excellence",
 ratio: "1:1",
 price: "£175",
 period: "/ month",
 monthlyPriceNum: 175,
 features: [
 "Dedicated 1:1 tutor attention",
 "Custom learning plan per exam board",
 "24/7 resource access via LMS",
 "Monthly progress reports to parents",
 "Exam technique & grade boosting",
 "Tutor matching to learning style",
 ],
 highlight: true,
 },
 {
 name: "Star Navigator",
 emoji: "🥇",
 subtitle: "Focused Partnership",
 ratio: "2:1",
 price: "£125",
 period: "/ month",
 monthlyPriceNum: 125,
 features: [
 "Small pair-based dynamic",
 "Personalised lesson plans",
 "Exam technique support",
 "Progress tracking & homework feedback",
 "Flexible booking options",
 "Parent communication updates",
 ],
 highlight: false,
 },
 {
 name: "Space Explorer",
 emoji: "🥈",
 subtitle: "Collaborative Learning",
 ratio: "3:1",
 price: "£100",
 period: "/ month",
 monthlyPriceNum: 100,
 features: [
 "Interactive group sessions",
 "Structured syllabus coverage",
 "Group problem solving",
 "Weekly assignments & feedback",
 "Monthly progress reports",
 ],
 highlight: false,
 },
 {
 name: "Rocket Starter",
 emoji: "🥉",
 subtitle: "Group Support",
 ratio: "5:1",
 price: "£80",
 period: "/ month",
 monthlyPriceNum: 80,
 features: [
 "Small group support",
 "Exam-focused practice papers",
 "Shared resources & materials",
 "Regular topic reviews",
 "Termly progress reports",
 ],
 highlight: false,
 },
 {
 name: "Launch Pad",
 emoji: "✏️",
 subtitle: "Affordable Exam Prep",
 ratio: "6:1",
 price: "£75",
 period: "/ month",
 monthlyPriceNum: 75,
 features: [
 "Targeted revision sessions",
 "Past paper walkthroughs",
 "Exam technique workshops",
 "Group Q&A and support",
 "Basic progress tracking",
 ],
 highlight: false,
 },
 {
 name: "Ground Control",
 emoji: "📘",
 subtitle: "Lowest Cost Access",
 ratio: "10:1",
 price: "£50",
 period: "/ month",
 monthlyPriceNum: 50,
 features: [
 "Maximum affordability",
 "Structured group revision",
 "Core concept reinforcement",
 "Exam tips & techniques",
 "Access to learning resources",
 ],
 highlight: false,
 },
 ],
 'A-Level': [
 {
 name: "Mission Commander",
 emoji: "🏆",
 subtitle: "Premium Personalised Excellence",
 ratio: "1:1",
 price: "£225",
 period: "/ month",
 monthlyPriceNum: 225,
 features: [
 "Bespoke exam board programme",
 "Deep dive explanations & essay structure",
 "Exam technique mastery",
 "UCAS deadline & personal statement support",
 "24/7 LMS resource access",
 "Tutor matching to subject specialism",
 ],
 highlight: true,
 },
 {
 name: "Star Navigator",
 emoji: "🥇",
 subtitle: "Focused Partnership",
 ratio: "2:1",
 price: "£175",
 period: "/ month",
 monthlyPriceNum: 175,
 features: [
 "Shared support in small pair",
 "Debate & critical thinking practice",
 "Synoptic links mastery",
 "Individual feedback per session",
 "Progress tracking",
 "Parent communication",
 ],
 highlight: false,
 },
 {
 name: "Space Explorer",
 emoji: "🥈",
 subtitle: "Collaborative Learning",
 ratio: "3:1",
 price: "£150",
 period: "/ month",
 monthlyPriceNum: 150,
 features: [
 "Close-knit group learning",
 "Structured syllabus coverage",
 "Peer discussion & analysis",
 "Frequent tutor check-ins",
 "Monthly reports",
 ],
 highlight: false,
 },
 {
 name: "Rocket Starter",
 emoji: "🥉",
 subtitle: "Group Support",
 ratio: "5:1",
 price: "£130",
 period: "/ month",
 monthlyPriceNum: 130,
 features: [
 "Affordable A-Level option",
 "Essay planning workshops",
 "Peer support & confidence building",
 "Regular topic reviews",
 "Steady improvement tracking",
 ],
 highlight: false,
 },
 {
 name: "Launch Pad",
 emoji: "✏️",
 subtitle: "Affordable Exam Prep",
 ratio: "6:1",
 price: "£75",
 period: "/ month",
 monthlyPriceNum: 75,
 features: [
 "Targeted A-Level revision",
 "Past paper & mark scheme analysis",
 "Exam technique workshops",
 "Group Q&A sessions",
 "Basic progress tracking",
 ],
 highlight: false,
 },
 {
 name: "Ground Control",
 emoji: "📘",
 subtitle: "Lowest Cost Access",
 ratio: "10:1",
 price: "£65",
 period: "/ month",
 monthlyPriceNum: 65,
 features: [
 "Maximum affordability",
 "Structured group revision",
 "Core concept reinforcement",
 "Exam tips & techniques",
 "Access to learning resources",
 ],
 highlight: false,
 },
 ],
 'BTEC': [
 {
 name: "Mission Commander",
 emoji: "🏆",
 subtitle: "Premium Personalised Excellence",
 ratio: "1:1",
 price: "£200",
 period: "/ month",
 monthlyPriceNum: 200,
 features: [
 "Plan tailored to BTEC units",
 "Coursework & assignment support",
 "Focus on distinction-level work",
 "Practical application guidance",
 "24/7 LMS access",
 "Tutor matching to specialism",
 ],
 highlight: true,
 },
 {
 name: "Star Navigator",
 emoji: "🥇",
 subtitle: "Focused Partnership",
 ratio: "2:1",
 price: "£150",
 period: "/ month",
 monthlyPriceNum: 150,
 features: [
 "Semi-personalised lessons",
 "Peer-to-peer learning",
 "Assignment feedback & review",
 "Group engagement activities",
 "Progress tracking",
 "Parent communication",
 ],
 highlight: false,
 },
 {
 name: "Space Explorer",
 emoji: "🥈",
 subtitle: "Collaborative Learning",
 ratio: "3:1",
 price: "£120",
 period: "/ month",
 monthlyPriceNum: 120,
 features: [
 "Small focused sessions",
 "Case study discussions",
 "Rotational tutor attention",
 "Assignment workshops",
 "Monthly reports",
 ],
 highlight: false,
 },
 {
 name: "Rocket Starter",
 emoji: "🥉",
 subtitle: "Group Support",
 ratio: "5:1",
 price: "£100",
 period: "/ month",
 monthlyPriceNum: 100,
 features: [
 "Blended learning approach",
 "Project-focused sessions",
 "Real-world case discussions",
 "Group feedback",
 "Excellent value",
 ],
 highlight: false,
 },
 {
 name: "Launch Pad",
 emoji: "✏️",
 subtitle: "Affordable Exam Prep",
 ratio: "6:1",
 price: "£70",
 period: "/ month",
 monthlyPriceNum: 70,
 features: [
 "Targeted coursework support",
 "Unit criterion walkthroughs",
 "Group revision sessions",
 "Assignment planning help",
 "Basic progress tracking",
 ],
 highlight: false,
 },
 {
 name: "Ground Control",
 emoji: "📘",
 subtitle: "Lowest Cost Access",
 ratio: "10:1",
 price: "£50",
 period: "/ month",
 monthlyPriceNum: 50,
 features: [
 "Maximum affordability",
 "Structured group revision",
 "Core concept coverage",
 "Assignment tips & guidance",
 "Access to learning resources",
 ],
 highlight: false,
 },
 ],
};

/* ── Level Display Config ── */
export interface LevelConfig {
 label: string;
 key: string;
 heading: string;
 subheading: string;
 primaryColor: string; // Tailwind CSS class prefix
 gradientFrom: string;
 gradientTo: string;
 accentBg: string;
 accentText: string;
 accentBorder: string;
 buttonBg: string;
 buttonHover: string;
 highlightRing: string;
 highlightBorder: string;
 highlightShadow: string;
 badgeBg: string;
 badgeText: string;
 checkColor: string;
 heroBgFrom: string;
 heroBgTo: string;
}

export const levelConfigs: Record<string, LevelConfig> = {
 '11+': {
 label: '11+',
 key: '11+',
 heading: 'Please see our 11+ pricing',
 subheading: 'Choose the right support for your child\'s success.',
 primaryColor: 'cyan',
 gradientFrom: 'from-cyan-600',
 gradientTo: 'to-sky-500',
 accentBg: 'bg-cyan-50',
 accentText: 'text-cyan-700',
 accentBorder: 'border-cyan-200',
 buttonBg: 'bg-cyan-600',
 buttonHover: 'hover:bg-cyan-700',
 highlightRing: 'ring-cyan-100',
 highlightBorder: 'border-cyan-200',
 highlightShadow: 'shadow-cyan-100/50',
 badgeBg: 'bg-cyan-600',
 badgeText: 'text-white',
 checkColor: 'text-cyan-500',
 heroBgFrom: 'from-cyan-50',
 heroBgTo: 'to-white',
 },
 'GCSE': {
 label: 'GCSE',
 key: 'GCSE',
 heading: 'Please see our GCSE pricing',
 subheading: 'Choose the right support for your child\'s success.',
 primaryColor: 'slate',
 gradientFrom: 'from-slate-700',
 gradientTo: 'to-slate-900',
 accentBg: 'bg-slate-100',
 accentText: 'text-slate-800',
 accentBorder: 'border-slate-200',
 buttonBg: 'bg-slate-800',
 buttonHover: 'hover:bg-slate-900',
 highlightRing: 'ring-slate-100',
 highlightBorder: 'border-slate-300',
 highlightShadow: 'shadow-slate-200/50',
 badgeBg: 'bg-slate-800',
 badgeText: 'text-white',
 checkColor: 'text-slate-700',
 heroBgFrom: 'from-slate-100',
 heroBgTo: 'to-white',
 },
 'A-Level': {
 label: 'A-Level',
 key: 'A-Level',
 heading: 'Please see our A-Level pricing',
 subheading: 'Choose the right support for your child\'s success.',
 primaryColor: 'orange',
 gradientFrom: 'from-orange-500',
 gradientTo: 'to-amber-500',
 accentBg: 'bg-orange-50',
 accentText: 'text-orange-700',
 accentBorder: 'border-orange-200',
 buttonBg: 'bg-orange-500',
 buttonHover: 'hover:bg-orange-600',
 highlightRing: 'ring-orange-100',
 highlightBorder: 'border-orange-200',
 highlightShadow: 'shadow-orange-100/50',
 badgeBg: 'bg-orange-500',
 badgeText: 'text-white',
 checkColor: 'text-orange-500',
 heroBgFrom: 'from-orange-50',
 heroBgTo: 'to-white',
 },
 'BTEC': {
 label: 'BTEC',
 key: 'BTEC',
 heading: 'Please see our BTEC pricing',
 subheading: 'Choose the right support for your child\'s success.',
 primaryColor: 'slate',
 gradientFrom: 'from-slate-700',
 gradientTo: 'to-slate-900',
 accentBg: 'bg-slate-100',
 accentText: 'text-slate-800',
 accentBorder: 'border-slate-200',
 buttonBg: 'bg-slate-800',
 buttonHover: 'hover:bg-slate-900',
 highlightRing: 'ring-slate-100',
 highlightBorder: 'border-slate-300',
 highlightShadow: 'shadow-slate-200/50',
 badgeBg: 'bg-slate-800',
 badgeText: 'text-white',
 checkColor: 'text-slate-700',
 heroBgFrom: 'from-slate-100',
 heroBgTo: 'to-white',
 },
};

/* ── Testimonials ── */
export interface Testimonial {
 name: string;
 role: string;
 text: string;
 rating: number;
}

export const testimonials: Testimonial[] = [
 {
 name: "Amina Rafiq",
 role: "Parent (Tutored Sept 2023 – June 2025)",
 text: "Let's Go Tutors matched my daughter with an outstanding maths tutor. Lessons were structured, progress was tracked each month, and her confidence transformed. Homework feedback was detailed and helpful — we've seen far better classroom engagement as a result.",
 rating: 5,
 },
 {
 name: "Liam Carter",
 role: "Tutee, Year 10 (2024–2025)",
 text: "My tutor made tricky topics simple and always checked I understood before moving on. Sessions were clear, focused and actually enjoyable — my school grades improved and I feel more prepared for exams.",
 rating: 5,
 },
 {
 name: "Sana Iqbal",
 role: "Tutor (Contracted Jan 2024 – present)",
 text: "As a Let's Go tutor I appreciate the professional onboarding and the platform's emphasis on quality. Students are well-prepared for lessons, communication is smooth, and I see real, measurable improvement term to term.",
 rating: 5,
 },
 {
 name: "Richard Dawkiss",
 role: "School Coordinator (Partnership 2023–2025)",
 text: "Let's Go Tutors provided targeted intervention for our underperforming cohorts. Pupils returned to lessons more confident and attainment across core subjects rose after the programme.",
 rating: 5,
 },
 {
 name: "Oliver Mason",
 role: "Parent",
 text: "Flexible scheduling and clear reporting made all the difference. The tutor adapted to my son's learning style and kept us updated. Professional and reliable — would recommend.",
 rating: 5,
 },
 {
 name: "Mei Chen",
 role: "Tutee, Year 9",
 text: "The lessons are so engaging and easy to follow. The LMS made revising simple — I could watch replays and track my progress. My English improved massively.",
 rating: 5,
 },
 {
 name: "Dr. Rasha Aziz",
 role: "Tutor",
 text: "The platform supports tutors with resources and admin so we can focus on teaching. I've had several students progress by multiple grade bands through targeted lessons.",
 rating: 5,
 },
 {
 name: "Sally Biswitcher",
 role: "SENCo",
 text: "Let's Go Tutors were sensitive to our pupils' needs and provided highly tailored one-to-one sessions. The pastoral communication with school staff was excellent.",
 rating: 5,
 },
 {
 name: "Hassan Patel",
 role: "Parent",
 text: "Affordable, professional and effective. The tutor built my son's confidence and we saw steady improvement in his homework and tests.",
 rating: 5,
 },
 {
 name: "Isabella Russo",
 role: "Tutee",
 text: "My tutor made revision manageable and gave me past-paper practice every week. I felt calm going into exams because I knew exactly what to focus on.",
 rating: 5,
 },
];

/* ── 3-Step Teaching Process ── */
export const teachingProcess = [
 {
 step: 1,
 title: "Diagnose & Personalise",
 description:
 "We begin with an initial assessment to identify strengths, weaknesses, and learning style. Each student receives a tailored plan that matches their goals, exam board, and pace.",
 cta: { label: "Learn More", href: "/about-the-lms" },
 },
 {
 step: 2,
 title: "Teach & Practise",
 description:
 "Tutors deliver engaging, interactive lessons that break down complex concepts into manageable steps. Students apply their learning through guided practice, exam-style questions, and feedback in real time.",
 cta: { label: "See our Subjects", href: "/subjects" },
 },
 {
 step: 3,
 title: "Review & Progress",
 description:
 "Each session ends with a recap and measurable targets. We track progress with regular reviews, share feedback with parents, and adapt the plan to ensure consistent improvement and exam readiness.",
 cta: { label: "Join Now", href: "/register" },
 },
];

/* ── What Makes Us Different ── */
export const differentiators = {
 headline: "What Makes Us Different?",
 description:
 "At Let's Go Tutors, we go beyond traditional tutoring — combining expert educators, a powerful learning management system, and a personalised approach to help every student reach their full potential. Our tutors don't just teach; they mentor, motivate, and guide students with real insight into exam success. With 24/7 access to resources, progress tracking, and interactive support, Let's Go Tutors transforms learning into a confident, goal-driven mission.",
 vision: {
 title: "Our Vision",
 text: "To launch every learner toward academic excellence and lifelong success. Let's Go Tutors envisions a future where education is accessible, engaging, and tailored to every student's potential — propelling them to new heights.",
 },
 mission: {
 title: "Our Mission",
 text: "To deliver high-quality, personalised tutoring supported by expert educators and innovative technology. We aim to make learning effective, enjoyable, and results-driven — helping students excel across BTEC, A Level, GCSE, and 11+ courses.",
 },
 process: {
 title: "Our Process",
 text: "At Let's Go Tutors, we combine expert teaching with smart technology. Each student begins with an assessment to identify strengths and goals, followed by a tailored learning plan delivered through our interactive LMS. Continuous progress tracking, feedback, and one-to-one support ensure every learner stays motivated and achieves measurable growth.",
 },
};

/* ── The Let's Go Tutors Story (About Page) ── */
export const brandStory = {
 sectionTitle: "OUR MISSION",
 headline: "The Let's Go Tutors Story — Built by Educators, Launched for Purpose",
 paragraphs: [
 "Let's Go Tutors was born from frustration — and passion. A group of experienced educators and tutors, with over a decade of combined teaching experience, came together after years of watching traditional tuition platforms fail students. We saw endless systems that promised \"personalised learning\" but delivered generic lessons, poor feedback, and zero transparency. Students were treated like numbers; tutors were left without the tools to truly teach.",
 "We knew it could be different.",
 "So, we launched Let's Go Tutors — from the ground up — a tutoring platform designed by educators, for learners. We integrated cutting-edge Learning Management System (LMS) technology that actually tracks progress, delivers meaningful reports, and fosters real communication between tutors, students, and parents. Every session is powered by data, guided by human expertise, and centred around one goal: helping every learner reach new heights.",
 "Our tutors are not just instructors — they're mentors and navigators. They use Let's Go Tutors' tools to see where students excel, where they struggle, and how to close that gap with precision and care. For parents, that means total transparency. For students, that means visible progress. And for tutors, it means finally being part of a system that values teaching as much as learning.",
 "Let's Go Tutors isn't just another tuition service — it's a launchpad. A mission led by educators who believe every learner deserves better.",
 ],
 callToAction:
 "Whether you're a tutor who wants to teach with purpose, or a parent who wants more than promises, Let's Go Tutors is where genuine learning begins.",
};

/* ── Footer About Block ── */
export const footerAbout = {
 tagline:
 "A launchpad for learners — built on precision, care, and results.",
 lmsLine:
 "Smart LMS technology + outstanding tutors = measurable progress at every stage of the mission.",
 missionLine:
 "Propelling confident learners through discovery, growth, and success.",
 aboutLearning:
 "At Let's Go Tutors, we believe learning is more than passing exams — it's about building strong foundations, confidence, and independence. Our approach combines expert tutors with smart technology, ensuring every lesson is tailored, every step is measured, and every student is supported to reach their full potential.",
 email: "info@letsgotutors.com",
};

/* ── CTA Block ── */
export const ctaBlock = {
 headline: "Heard enough?",
 subline: "Ready to pick a subject?",
 joinTeamLabel: "JOIN THE TEAM",
};
