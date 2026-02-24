'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { deadlines } from '@/lib/data';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Build the calendar for the CURRENT month dynamically
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfWeek = new Date(year, month, 1).getDay();

const subjectColors: Record<string, string> = {
    economics: '#818cf8',
    accounting: '#34d399',
    bst: '#fbbf24',
    ict: '#f472b6',
};

const subjectNames: Record<string, string> = {
    economics: 'Economics',
    accounting: 'Accounting',
    bst: 'Business Studies',
    ict: 'ICT',
};

// Map deadline day numbers for calendar dots
const deadlineDays: Record<number, string> = {
    25: 'ict',
    27: 'economics',
};

const sessions: Record<number, string[]> = {
    24: ['Economics', 'ICT Lab'],
    25: ['Accounting'],
    26: ['BST', 'Economics'],
    27: ['ICT', 'Accounting'],
    28: ['BST'],
};

const sessionSubjectMap: Record<string, string> = {
    Economics: 'economics',
    'ICT Lab': 'ict',
    Accounting: 'accounting',
    BST: 'bst',
    ICT: 'ict',
};

export default function SchedulePage() {
    const today = new Date().getDate();
    const monthLabel = `${months[month]} ${year}`;

    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

    return (
        <DashboardLayout breadcrumbs={['Home', 'Schedule']}>
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="font-serif text-3xl font-semibold text-zinc-100">
                        Schedule & <span className="gold-text italic">Calendar</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">{months[month]} {year} · Your academic timetable</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Calendar ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                    >
                        {/* Month header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                            <h2 className="font-semibold text-zinc-200">{monthLabel}</h2>
                            <div className="flex gap-2">
                                {['Econ', 'Acct', 'BST', 'ICT'].map((s, i) => {
                                    const keys = ['economics', 'accounting', 'bst', 'ict'];
                                    return (
                                        <span key={s} className="flex items-center gap-1 text-[11px] text-zinc-500">
                                            <span className="w-2 h-2 rounded-full" style={{ background: subjectColors[keys[i]] }} />
                                            {s}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-zinc-800/60">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="py-2 text-center text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Cells */}
                        <div className="grid grid-cols-7">
                            {calendarCells.map((day, i) => {
                                const isToday = day === today;
                                const hasSessions = day !== null && sessions[day];
                                const hasDeadline = day !== null && deadlineDays[day];

                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[72px] p-1.5 border-b border-r border-zinc-800/30 ${isToday ? 'bg-zinc-800/40' : day ? 'hover:bg-zinc-800/20 transition-colors cursor-pointer' : ''
                                            }`}
                                    >
                                        {day && (
                                            <>
                                                <span
                                                    className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'text-zinc-950' : 'text-zinc-400'
                                                        }`}
                                                    style={isToday ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                                                >
                                                    {day}
                                                </span>

                                                {/* Session pills */}
                                                <div className="mt-1 space-y-0.5">
                                                    {hasSessions && sessions[day].slice(0, 2).map(s => (
                                                        <div
                                                            key={s}
                                                            className="text-[9px] font-medium px-1 py-0.5 rounded truncate"
                                                            style={{
                                                                background: `${subjectColors[sessionSubjectMap[s]]}20`,
                                                                color: subjectColors[sessionSubjectMap[s]],
                                                            }}
                                                        >
                                                            {s}
                                                        </div>
                                                    ))}
                                                    {/* Deadline dot */}
                                                    {hasDeadline && (
                                                        <div
                                                            className="text-[9px] font-medium px-1 py-0.5 rounded flex items-center gap-0.5"
                                                            style={{
                                                                background: `${subjectColors[deadlineDays[day]]}15`,
                                                                color: '#f87171',
                                                            }}
                                                        >
                                                            <AlertCircle size={8} /> Due
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* ── Sidebar: Today + Deadlines ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-4"
                    >
                        {/* Today's sessions */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                                <Clock size={14} style={{ color: '#d4a843' }} />
                                <h3 className="text-sm font-semibold text-zinc-200">Today — {months[month]} {today}</h3>
                            </div>
                            <div className="p-3 space-y-2">
                                {(sessions[today] ?? []).map((s, i) => (
                                    <div key={s} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-800">
                                        <div className="w-1 h-8 rounded-full self-stretch" style={{ background: subjectColors[sessionSubjectMap[s]] }} />
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">{s}</p>
                                            <p className="text-[11px] text-zinc-600">{i === 1 ? '3:00 PM · Live' : '9:00 AM'}</p>
                                        </div>
                                        {i === 1 && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming deadlines */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-200">Upcoming Deadlines</h3>
                            </div>
                            <div className="divide-y divide-zinc-800/60">
                                {deadlines.slice(0, 4).map(d => (
                                    <div key={d.id} className={`flex items-start gap-3 px-4 py-3 ${d.borderClass}`}>
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-300 font-medium">{d.title}</p>
                                            <p className="text-[11px] text-zinc-600 mt-0.5">{subjectNames[d.subject]} · {d.dueDate}</p>
                                        </div>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                            style={{
                                                color: d.daysLeft <= 3 ? '#f87171' : d.daysLeft <= 7 ? '#fbbf24' : '#34d399',
                                                background: d.daysLeft <= 3 ? 'rgba(248,113,113,0.1)' : d.daysLeft <= 7 ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
                                            }}
                                        >
                                            {d.daysLeft}d
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
