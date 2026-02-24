'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Flame, Star, BookOpen, Target, CalendarCheck } from 'lucide-react';
import { studentProfile } from '@/lib/data';

export function WelcomeBanner() {
    const { data: session } = useSession();

    // Use the logged-in student's first name, fallback to profile data
    const firstName = session?.user?.name?.split(' ')[0] ?? studentProfile.firstName;

    const now = new Date();
    const formatted = now.toLocaleDateString('en-LK', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const stats = [
        { icon: Flame, label: 'Day Streak', value: studentProfile.streakDays, color: '#f97316' },
        { icon: BookOpen, label: 'Subjects', value: 4, color: '#818cf8' },
        { icon: Target, label: 'Avg. Progress', value: `${studentProfile.totalProgress}%`, color: '#34d399' },
        { icon: Star, label: 'Rank', value: 'Top 5%', color: '#d4a843' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border border-zinc-800"
            style={{ background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)' }}
        >
            {/* Background dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.05]"
                    style={{ background: 'radial-gradient(circle, #d4a843 0%, transparent 70%)' }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
                <div className="absolute inset-0 opacity-[0.012]"
                    style={{ backgroundImage: `radial-gradient(circle, #d4a843 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            </div>

            <div className="relative p-5 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* ── Left: Greeting ──────────────────── */}
                    <div className="flex-1">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarCheck size={13} className="text-zinc-500" />
                                <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">{formatted}</p>
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-100 mb-2">
                                Welcome back,{' '}
                                <span className="gold-text italic">{firstName}</span>
                            </h1>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                                You have{' '}
                                <span className="text-zinc-200 font-semibold">{studentProfile.upcomingAssignments} upcoming assignments</span>{' '}
                                due this week. Keep up the great work and stay consistent!
                            </p>
                        </motion.div>

                        {/* Quick actions */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-2 mt-4">
                            <Link href="/courses"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-950 transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                                Browse Courses
                            </Link>
                            <Link href="/schedule"
                                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 transition-all">
                                View Schedule
                            </Link>
                        </motion.div>
                    </div>

                    {/* ── Right: Stats ─────────────────────── */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="grid grid-cols-4 md:grid-cols-2 gap-2.5 md:gap-3 md:w-56">
                        {stats.map(({ icon: Icon, label, value, color }, i) => (
                            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                                className="bg-zinc-950/60 rounded-xl p-2.5 md:p-3 border border-zinc-800/80 text-center">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                                    <Icon size={14} style={{ color }} />
                                </div>
                                <p className="text-lg md:text-xl font-bold text-zinc-100" style={{ color }}>{value}</p>
                                <p className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
