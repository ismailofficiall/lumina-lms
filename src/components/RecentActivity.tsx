'use client';

import { motion } from 'framer-motion';
import { Play, FileText, StickyNote, Pencil, ArrowUpRight, Clock } from 'lucide-react';
import { recentActivities } from '@/lib/data';

const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
    Video: { icon: Play, label: 'Video' },
    Slides: { icon: FileText, label: 'Slides' },
    Notes: { icon: StickyNote, label: 'Notes' },
    Quiz: { icon: Pencil, label: 'Quiz' },
};

const subjectNames: Record<string, string> = {
    economics: 'Economics',
    accounting: 'Accounting',
    bst: 'Business Studies',
    ict: 'ICT',
};

export function RecentActivity() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: '#d4a843' }} />
                    <h2 className="font-semibold text-zinc-200 text-sm">Recent Activity</h2>
                </div>
                <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View history</button>
            </div>

            {/* Activity items */}
            <div className="p-4 space-y-2">
                {recentActivities.map((activity, i) => {
                    const { icon: Icon } = typeConfig[activity.type];
                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ x: 4 }}
                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer border border-transparent hover:border-zinc-700/50"
                        >
                            {/* Icon */}
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: `${activity.subjectColor}15`,
                                    border: `1px solid ${activity.subjectColor}25`
                                }}
                            >
                                <Icon size={16} style={{ color: activity.subjectColor }} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-zinc-100 transition-colors">
                                    {activity.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${activity.tagClass}`}>
                                        {subjectNames[activity.subject]}
                                    </span>
                                    <span className="text-[11px] text-zinc-600">·</span>
                                    <span className="text-[11px] text-zinc-600">
                                        {activity.type}
                                        {activity.duration && ` · ${activity.duration}`}
                                        {activity.pages && ` · ${activity.pages} pages`}
                                    </span>
                                </div>
                            </div>

                            {/* Time + chevron */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className="text-[10px] text-zinc-600">{activity.accessedAt}</span>
                                <ArrowUpRight
                                    size={13}
                                    className="text-zinc-700 group-hover:text-zinc-400 transition-colors"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
