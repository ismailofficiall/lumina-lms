'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { deadlines, type Deadline, type DeadlinePriority } from '@/lib/data';

const priorityConfig: Record<DeadlinePriority, { label: string; color: string; bg: string }> = {
    high: { label: 'Urgent', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    medium: { label: 'Soon', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    low: { label: 'Upcoming', color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)' },
};

const typeIcons: Record<string, string> = {
    Quiz: '📝', Assignment: '📋', Essay: '✍️', Project: '🔬', Exam: '📚',
};

const subjectNames = {
    economics: 'Economics', accounting: 'Accounting', bst: 'Business Studies', ict: 'ICT',
};

export function DeadlinesPanel() {
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const toggle = (id: string) =>
        setCompleted(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const pending = deadlines.filter(d => !completed.has(d.id));
    const done = deadlines.filter(d => completed.has(d.id));

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: '#d4a843' }} />
                    <h2 className="font-semibold text-zinc-200 text-sm">Upcoming Deadlines</h2>
                    {pending.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
                            {pending.length}
                        </span>
                    )}
                </div>
                <Link href="/schedule" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                    View all <ArrowRight size={11} />
                </Link>
            </div>

            {/* Deadline list */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                    {pending.map((deadline, i) => {
                        const priority = priorityConfig[deadline.priority];
                        return (
                            <motion.div
                                key={deadline.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={`flex items-start gap-3 px-5 py-4 hover:bg-zinc-800/40 transition-colors cursor-pointer border-b border-zinc-800/40 ${deadline.borderClass}`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggle(deadline.id)}
                                    className="mt-0.5 text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0"
                                >
                                    <Circle size={18} />
                                </button>

                                {/* Type emoji */}
                                <span className="text-base mt-0.5 flex-shrink-0">{typeIcons[deadline.type]}</span>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200 leading-tight">{deadline.title}</p>
                                            <p className="text-[11px] text-zinc-600 mt-0.5">
                                                {subjectNames[deadline.subject]} · {deadline.type}
                                            </p>
                                        </div>
                                        <span
                                            className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                            style={{ color: priority.color, background: priority.bg }}
                                        >
                                            {priority.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 mt-2">
                                        <Clock size={11} className="text-zinc-600" />
                                        <span className="text-[11px] text-zinc-500">{deadline.dueDate}</span>
                                        {deadline.daysLeft <= 3 ? (
                                            <span className="flex items-center gap-1 ml-2 text-[10px]" style={{ color: '#f87171' }}>
                                                <AlertCircle size={10} />
                                                {deadline.daysLeft === 1 ? 'Tomorrow!' : `${deadline.daysLeft} days left`}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-zinc-600 ml-2">{deadline.daysLeft} days left</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Completed items */}
                {done.length > 0 && (
                    <div className="border-t border-zinc-800/60">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-700 px-5 py-2 font-semibold">Completed</p>
                        {done.map(deadline => (
                            <div
                                key={deadline.id}
                                className="flex items-start gap-3 px-5 py-3 opacity-40 border-b border-zinc-800/30"
                            >
                                <button onClick={() => toggle(deadline.id)} className="mt-0.5 flex-shrink-0" style={{ color: '#34d399' }}>
                                    <CheckCircle2 size={18} />
                                </button>
                                <span className="text-base mt-0.5 flex-shrink-0">{typeIcons[deadline.type]}</span>
                                <div>
                                    <p className="text-sm text-zinc-400 line-through leading-tight">{deadline.title}</p>
                                    <p className="text-[11px] text-zinc-600 mt-0.5">{subjectNames[deadline.subject]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {pending.length === 0 && done.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <p className="text-3xl mb-2">🎉</p>
                        <p className="text-sm font-medium text-zinc-400">All clear!</p>
                        <p className="text-xs text-zinc-600 mt-1">No upcoming deadlines.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
