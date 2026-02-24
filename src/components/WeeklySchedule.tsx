'use client';

import { motion } from 'framer-motion';
import { weeklySchedule } from '@/lib/data';

const subjectColors: Record<string, string> = {
    'Economics': '#818cf8',
    'ICT Lab': '#f472b6',
    'ICT': '#f472b6',
    'Accounting': '#34d399',
    'BST': '#fbbf24',
    'Business Studies': '#fbbf24',
};

export function WeeklySchedule() {
    // Today is Tuesday, Feb 24
    const todayIndex = 0; // Mon shown as index 0 but today is Tue (index 1)
    const todayDate = 24;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <h2 className="font-semibold text-zinc-200 text-sm">This Week</h2>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">February 2026</span>
            </div>

            <div className="p-4">
                {/* Day columns */}
                <div className="grid grid-cols-5 gap-2">
                    {weeklySchedule.map((day, i) => {
                        const isToday = day.date === todayDate;
                        return (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={`flex flex-col items-center rounded-xl p-2 border transition-all ${isToday
                                        ? 'border-gold-500 bg-gold-500/5'
                                        : 'border-transparent hover:bg-zinc-800/40'
                                    }`}
                                style={isToday ? { borderColor: 'rgba(212,168,67,0.4)', background: 'rgba(212,168,67,0.04)' } : {}}
                            >
                                <span className={`text-[11px] font-medium uppercase tracking-wider ${isToday ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    {day.day}
                                </span>
                                <span
                                    className={`text-lg font-bold mt-1 mb-2 w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'text-zinc-950' : 'text-zinc-400'
                                        }`}
                                    style={isToday ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                                >
                                    {day.date}
                                </span>

                                {/* Session dots/pills */}
                                <div className="flex flex-col gap-1 w-full">
                                    {day.sessions.map(session => {
                                        const color = subjectColors[session] || '#71717a';
                                        return (
                                            <div
                                                key={session}
                                                className="text-[9px] font-medium px-1.5 py-0.5 rounded-md text-center truncate"
                                                style={{
                                                    background: `${color}20`,
                                                    color: color,
                                                    border: `1px solid ${color}30`,
                                                }}
                                            >
                                                {session}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
