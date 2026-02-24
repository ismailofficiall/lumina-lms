'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Calculator, Briefcase, Monitor, Play } from 'lucide-react';
import { type Course } from '@/lib/data';

const subjectIcons = {
    economics: TrendingUp,
    accounting: Calculator,
    bst: Briefcase,
    ict: Monitor,
};

const subjectShortTitles = {
    economics: 'Economics',
    accounting: 'Accounting',
    bst: 'Business Studies',
    ict: 'ICT',
};

interface SubjectCardProps {
    course: Course;
    index: number;
}

export function SubjectCard({ course, index }: SubjectCardProps) {
    const Icon = subjectIcons[course.subject];
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={`/courses/${course.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                style={{
                    boxShadow: hovered
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${course.accentColor}12`
                        : '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 0.3s ease',
                    borderColor: hovered ? `${course.accentColor}30` : undefined,
                }}
            >
                {/* Gradient Header */}
                <div
                    className={`relative h-28 bg-gradient-to-br ${course.gradientFrom} ${course.gradientTo} flex items-end p-4 overflow-hidden`}
                >
                    {/* Decorative circles */}
                    <div
                        className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                        style={{ background: course.accentColor }}
                    />
                    <div
                        className="absolute right-8 top-6 w-10 h-10 rounded-full opacity-10"
                        style={{ background: course.accentColor }}
                    />

                    {/* Live badge */}
                    {course.liveSession && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-zinc-950/70 backdrop-blur px-2 py-1 rounded-full border border-zinc-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wide">Live Today</span>
                        </div>
                    )}

                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
                        style={{ background: `${course.accentColor}25`, border: `1px solid ${course.accentColor}40` }}
                    >
                        <Icon size={20} style={{ color: course.color }} />
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-semibold text-zinc-100 leading-tight">{course.title}</h3>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${course.tagClass}`}>
                            {subjectShortTitles[course.subject]}
                        </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-950 flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                        >
                            {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-300 leading-none">{course.instructor}</p>
                            <p className="text-[11px] text-zinc-600 mt-0.5">{course.instructorTitle}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-zinc-500">Progress</span>
                            <span className="text-xs font-semibold" style={{ color: course.color }}>
                                {course.progress}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: '0%' }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ delay: index * 0.1 + 0.4, duration: 0.8, ease: 'easeOut' }}
                                style={{ background: `linear-gradient(90deg, ${course.accentColor}, ${course.color})` }}
                            />
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-1">
                            {course.completedLessons}/{course.totalLessons} lessons completed
                        </p>
                    </div>

                    {/* Next Lesson */}
                    <p className="text-[11px] text-zinc-600 mb-4 truncate">
                        📖 {course.nextLesson}
                    </p>

                    {/* CTA Button */}
                    <div className="relative h-10 mt-auto">
                        <motion.div
                            animate={{ opacity: hovered ? 0 : 1, y: hovered ? -4 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 border border-zinc-800 rounded-xl"
                        >
                            Continue <ArrowRight size={14} />
                        </motion.div>

                        <motion.div
                            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-zinc-950 rounded-xl"
                            style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                        >
                            <Play size={14} fill="currentColor" />
                            Resume Course
                        </motion.div>
                    </div>
                </div>

                {/* Hover border glow */}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 40px ${course.accentColor}06` }}
                />
            </motion.div>
        </Link>
    );
}
