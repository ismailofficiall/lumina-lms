'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, TrendingUp, Calculator, Briefcase, Monitor,
    ArrowRight, Star, ChevronDown, CheckCircle2, Users, BookOpen,
    Play, Sparkles, Menu, X, BarChart3, Clock, Award, Zap,
} from 'lucide-react';

/* ─────────────────────────────── DATA ─────────────────────────────── */
const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Subjects', href: '#subjects' },
    { label: 'How it works', href: '#how' },
    { label: 'Testimonials', href: '#testimonials' },
];

const subjects = [
    {
        title: 'Economics',
        icon: TrendingUp,
        color: '#818cf8',
        gradient: 'from-indigo-900/60 to-violet-900/30',
        tag: 'tag-economics',
        desc: 'Master micro & macro, market structures, monetary policy, and the Sri Lankan economic context.',
        topics: ['Supply & Demand', 'Market Structures', 'Government Policy', 'International Trade'],
    },
    {
        title: 'Accounting',
        icon: Calculator,
        color: '#34d399',
        gradient: 'from-emerald-900/60 to-teal-900/30',
        tag: 'tag-accounting',
        desc: 'From double-entry to final accounts, ratio analysis, and Sri Lankan corporate reporting standards.',
        topics: ['Financial Statements', 'Double Entry', 'Partnership Accounts', 'Ratio Analysis'],
    },
    {
        title: 'Business Studies',
        icon: Briefcase,
        color: '#fbbf24',
        gradient: 'from-amber-900/60 to-yellow-900/30',
        tag: 'tag-bst',
        desc: 'Develop strategic thinking in marketing, HR, operations, and business ethics — Sri Lanka & global context.',
        topics: ['Marketing Mix', 'Business Strategy', 'Operations Mgmt', 'Human Resources'],
    },
    {
        title: 'ICT',
        icon: Monitor,
        color: '#f472b6',
        gradient: 'from-pink-900/60 to-rose-900/30',
        tag: 'tag-ict',
        desc: 'Computer systems, networking, databases, programming, and cybersecurity for the A/L curriculum.',
        topics: ['Networking', 'Databases & SQL', 'Programming Concepts', 'Cybersecurity'],
    },
];

const features = [
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Track performance across all A/L subjects with detailed insights aligned to your exam targets.', color: '#818cf8' },
    { icon: Clock, title: 'Live Online Lectures', desc: 'Join real-time sessions with qualified Sri Lankan instructors — ask questions in the moment.', color: '#f472b6' },
    { icon: BookOpen, title: 'Rich Resource Library', desc: 'Access slides, notes, videos, past papers (including Sri Lanka AL papers), and textbooks in one place.', color: '#34d399' },
    { icon: Award, title: 'Smart Assessments', desc: 'Practice with adaptive quizzes mapped to Cambridge/Edexcel A/L mark schemes and examiner reports.', color: '#fbbf24' },
    { icon: Zap, title: 'AI Study Assistant', desc: 'Get instant explanations, worked examples, and personalised study recommendations for your subject.', color: '#f97316' },
    { icon: Users, title: 'Study Groups', desc: 'Collaborate with peers in subject-specific circles from schools across Sri Lanka.', color: '#a78bfa' },
];

const testimonials = [
    {
        name: 'Dilini S.',
        role: 'A/L Economics · Colombo',
        avatar: 'DS',
        quote: 'Lumina completely changed how I study for A/L. The progress tracking keeps me motivated and the live lectures are brilliant — feels like a proper tuition class!',
        stars: 5,
        color: '#818cf8',
    },
    {
        name: 'Kasun P.',
        role: 'A/L Accounting & BST · Kandy',
        avatar: 'KP',
        quote: "I went from struggling with accounting to getting an A at my mock exams. The step-by-step video explanations follow our exact syllabus — couldn't ask for more.",
        stars: 5,
        color: '#34d399',
    },
    {
        name: 'Nimasha R.',
        role: 'A/L ICT Student · Galle',
        avatar: 'NR',
        quote: 'The resource library is incredible — past papers, lecture slides, everything beautifully organised. Finally an LMS designed for Sri Lankan A/L students!',
        stars: 5,
        color: '#f472b6',
    },
];

const stats = [
    { value: '4,800+', label: 'Sri Lankan Students' },
    { value: '184', label: 'Expert Lessons' },
    { value: '96%', label: 'Pass Rate' },
    { value: '4.9 ★', label: 'Average Rating' },
];

const steps = [
    { num: '01', title: 'Create your account', desc: 'Sign up in seconds and get instant access to all four A/L subjects.', color: '#d4a843' },
    { num: '02', title: 'Choose your subjects', desc: 'Enrol in Economics, Accounting, Business Studies, or ICT.', color: '#818cf8' },
    { num: '03', title: 'Learn & practise', desc: 'Watch lectures, take quizzes, and study with past papers & exam resources.', color: '#34d399' },
    { num: '04', title: 'Track & achieve', desc: 'Monitor your progress and hit your A/L academic goals.', color: '#f472b6' },
];

/* ─────────────────────────── NAVBAR ─────────────────────────────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/60 shadow-xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                        <GraduationCap size={16} className="text-zinc-950" />
                    </div>
                    <span className="font-serif text-xl font-semibold gold-text">Lumina</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(l => (
                        <a key={l.label} href={l.href} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">{l.label}</a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">Sign in</Link>
                    <Link href="/login" className="text-sm font-semibold text-zinc-950 px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                        Get Started
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button className="md:hidden text-zinc-400 hover:text-zinc-200 p-1" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-950/98 backdrop-blur-xl border-b border-zinc-800 overflow-hidden"
                    >
                        <div className="px-4 py-5 space-y-1">
                            {navLinks.map(l => (
                                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                                    className="block text-sm text-zinc-400 hover:text-zinc-100 py-2.5 px-3 rounded-xl hover:bg-zinc-800/50 transition-all">
                                    {l.label}
                                </a>
                            ))}
                            <div className="pt-3 flex flex-col gap-2 border-t border-zinc-800 mt-3">
                                <Link href="/login" className="text-sm text-center py-2.5 text-zinc-400 hover:text-zinc-200 transition-colors">Sign in</Link>
                                <Link href="/login" className="text-sm font-semibold text-zinc-950 px-4 py-3 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

/* ─────────────────────────── PAGE ─────────────────────────────────── */
export default function HomePage() {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    return (
        <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
            <Navbar />

            {/* ══════════ HERO ══════════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #d4a843 0%, transparent 70%)', filter: 'blur(60px)' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', filter: 'blur(60px)' }} />
                    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(212,168,67,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.5) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
                </div>

                <motion.div style={{ y: heroY }} className="relative z-10 text-center max-w-5xl mx-auto w-full">
                    {/* Badge */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                        style={{ background: 'rgba(212,168,67,0.08)', borderColor: 'rgba(212,168,67,0.25)' }}>
                        <Sparkles size={13} style={{ color: '#d4a843' }} />
                        <span className="text-xs font-medium" style={{ color: '#d4a843' }}>
                            The premium learning platform for Sri Lanka A/L students
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                        className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-zinc-100 leading-[1.1] mb-6">
                        Study Smarter.{' '}
                        <span className="gold-text italic block sm:inline">Achieve More.</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8 px-2">
                        Lumina is the all-in-one learning platform for students mastering{' '}
                        <span className="text-zinc-200 font-medium">Economics, Accounting, Business Studies</span> and{' '}
                        <span className="text-zinc-200 font-medium">ICT</span> for the Sri Lanka A/L examination. Live lectures, rich resources, and progress tracking — beautifully designed.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-zinc-950 transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #d4a843 0%, #e8d5a3 50%, #d4a843 100%)' }}>
                            Start Learning Free <ArrowRight size={18} />
                        </Link>
                        <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100 transition-all">
                            <Play size={16} fill="currentColor" /> View Dashboard
                        </Link>
                    </motion.div>

                    {/* Trust bar */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-zinc-600">
                        {['No credit card required', 'Sri Lanka A/L syllabus aligned', '4,800+ students enrolled'].map(t => (
                            <span key={t} className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} style={{ color: '#d4a843' }} />
                                {t}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-700">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ChevronDown size={18} />
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════════ STATS BAR ══════════ */}
            <section className="py-12 sm:py-16 border-y border-zinc-800/60" style={{ background: 'rgba(24,24,27,0.5)' }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((s, i) => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center">
                                <p className="font-serif text-3xl sm:text-4xl font-bold gold-text">{s.value}</p>
                                <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ SUBJECTS ══════════ */}
            <section id="subjects" className="py-16 sm:py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#d4a843' }}>Four Core A/L Subjects</span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 mt-3 mb-4">
                            Everything You Need to <span className="gold-text italic">Excel</span>
                        </h2>
                        <p className="text-zinc-500 max-w-xl mx-auto text-base sm:text-lg">
                            Each subject is taught by experienced Sri Lankan instructors, fully aligned with the Edexcel / Cambridge A/L curriculum.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {subjects.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -6 }}
                                    className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer">
                                    <div className={`h-2 bg-gradient-to-r ${s.gradient}`} />
                                    <div className="p-6">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                            <Icon size={22} style={{ color: s.color }} />
                                        </div>
                                        <h3 className="font-serif text-xl font-semibold text-zinc-100 mb-2">{s.title}</h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">{s.desc}</p>
                                        <ul className="space-y-1.5">
                                            {s.topics.map(t => (
                                                <li key={t} className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/login" className="mt-6 flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: s.color }}>
                                            Explore subject <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ FEATURES ══════════ */}
            <section id="features" className="py-16 sm:py-24 px-4" style={{ background: 'rgba(24,24,27,0.4)' }}>
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#d4a843' }}>Platform Features</span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 mt-3 mb-4">
                            Built for <span className="gold-text italic">Academic Excellence</span>
                        </h2>
                        <p className="text-zinc-500 max-w-xl mx-auto text-base sm:text-lg">
                            Every feature is purposefully designed to help you learn faster, retain more, and achieve better A/L results.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                                        <Icon size={22} style={{ color: f.color }} />
                                    </div>
                                    <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ HOW IT WORKS ══════════ */}
            <section id="how" className="py-16 sm:py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#d4a843' }}>How It Works</span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 mt-3">
                            Start learning in <span className="gold-text italic">minutes</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative">
                        {/* Connector */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-zinc-800" />
                        {steps.map((step, i) => (
                            <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                                className="relative flex flex-col items-center text-center">
                                <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-xl sm:text-2xl font-serif font-bold text-zinc-950 shadow-lg" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)` }}>
                                    {step.num}
                                </div>
                                <h3 className="font-semibold text-zinc-200 mb-1.5 text-sm sm:text-base">{step.title}</h3>
                                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ TESTIMONIALS ══════════ */}
            <section id="testimonials" className="py-16 sm:py-24 px-4" style={{ background: 'rgba(24,24,27,0.4)' }}>
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#d4a843' }}>Student Reviews</span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 mt-3">
                            Loved by <span className="gold-text italic">students across Sri Lanka</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.stars }).map((_, j) => (
                                        <Star key={j} size={14} fill="#d4a843" style={{ color: '#d4a843' }} />
                                    ))}
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-zinc-950" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-zinc-200">{t.name}</p>
                                        <p className="text-xs text-zinc-600">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CTA ══════════ */}
            <section className="py-16 sm:py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-zinc-800"
                        style={{ background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)' }}>
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, #d4a843 0%, transparent 70%)' }} />
                        <div className="relative z-10">
                            <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                                <GraduationCap size={26} className="text-zinc-950" />
                            </div>
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                                Ready to <span className="gold-text italic">get started?</span>
                            </h2>
                            <p className="text-zinc-400 text-base sm:text-lg mb-8">
                                Join 4,800+ Sri Lankan students already mastering their A/L subjects with Lumina. No credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-zinc-950 hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                                    Create Free Account <ArrowRight size={18} />
                                </Link>
                                <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200 transition-all text-center">
                                    Explore Dashboard
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════ FOOTER ══════════ */}
            <footer className="border-t border-zinc-800/60 py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Top row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                                    <GraduationCap size={14} className="text-zinc-950" />
                                </div>
                                <span className="font-serif text-lg gold-text font-semibold">Lumina</span>
                            </div>
                            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
                                The premium academic platform for Sri Lanka A/L students. Aligned with Cambridge & Edexcel curricula.
                            </p>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Contact', 'Help Centre'].map(l => (
                                <a key={l} href="#" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{l}</a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-800/60">
                        <p className="text-zinc-700 text-xs text-center sm:text-left">
                            © 2026 Lumina LMS. All rights reserved.
                        </p>
                        <p className="text-zinc-700 text-xs text-center sm:text-right">
                            Powered by{' '}
                            <span className="font-semibold" style={{ color: '#d4a843' }}>InCo.</span>
                            {' '}· Crafted with ❤️ in Sri Lanka
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
