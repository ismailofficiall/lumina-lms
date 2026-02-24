'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { courses } from '@/lib/data';
import { getCourseContent, type Chapter, type Lesson } from '@/lib/courseContent';
import {
    Play, FileText, BookOpen, CheckCircle2, Circle,
    ChevronDown, TrendingUp, Calculator, Briefcase, Monitor,
    Clock, BarChart3, User, ArrowRight, Lock,
} from 'lucide-react';

const subjectIcons = {
    economics: TrendingUp,
    accounting: Calculator,
    bst: Briefcase,
    ict: Monitor,
};

const typeIconMap = {
    video: { icon: Play, label: 'Video', color: '#f472b6' },
    slides: { icon: FileText, label: 'Slides', color: '#818cf8' },
    notes: { icon: BookOpen, label: 'Notes', color: '#34d399' },
    quiz: { icon: FileText, label: 'Quiz', color: '#fbbf24' },
};

function LessonRow({
    lesson,
    courseId,
    isLocked,
}: {
    lesson: Lesson;
    courseId: string;
    isLocked: boolean;
}) {
    const typeConf = typeIconMap[lesson.type];
    const TypeIcon = typeConf.icon;

    return (
        <Link
            href={isLocked ? '#' : `/courses/${courseId}/lesson/${lesson.id}`}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isLocked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-zinc-800/60 cursor-pointer'
                }`}
            onClick={isLocked ? (e) => e.preventDefault() : undefined}
        >
            {/* Completion */}
            <div className="flex-shrink-0">
                {lesson.completed ? (
                    <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                ) : isLocked ? (
                    <Lock size={16} className="text-zinc-600" />
                ) : (
                    <Circle size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                )}
            </div>

            {/* Type icon */}
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${typeConf.color}15` }}
            >
                <TypeIcon size={14} style={{ color: typeConf.color }} />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate transition-colors ${lesson.completed
                        ? 'text-zinc-400'
                        : 'text-zinc-200 group-hover:text-zinc-100'
                    }`}>
                    {lesson.title}
                </p>
                {lesson.description && (
                    <p className="text-[11px] text-zinc-600 mt-0.5 truncate">{lesson.description}</p>
                )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${typeConf.color}15`, color: typeConf.color }}
                >
                    {typeConf.label}
                </span>
                <span className="text-[11px] text-zinc-600 hidden sm:block">{lesson.duration}</span>
                {!isLocked && !lesson.completed && (
                    <ArrowRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                )}
            </div>
        </Link>
    );
}

function ChapterAccordion({
    chapter,
    courseId,
    defaultOpen,
    index,
}: {
    chapter: Chapter;
    courseId: string;
    defaultOpen: boolean;
    index: number;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const completedCount = chapter.lessons.filter(l => l.completed).length;
    const totalCount = chapter.lessons.length;
    const allDone = completedCount === totalCount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
        >
            {/* Chapter header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${allDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                            }`}
                    >
                        {allDone ? <CheckCircle2 size={16} /> : `${index + 1}`}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-200">{chapter.title}</p>
                        <p className="text-[11px] text-zinc-600 mt-0.5">
                            {completedCount}/{totalCount} completed
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mini progress */}
                    <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        />
                    </div>
                    <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-zinc-500" />
                    </motion.div>
                </div>
            </button>

            {/* Lessons */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-2 pb-2 border-t border-zinc-800/60 pt-2 space-y-0.5">
                            {chapter.lessons.map((lesson, li) => {
                                // Lock lessons after the first incomplete chapter's first uncompleted lesson
                                const isLocked = !lesson.completed && !chapter.lessons.slice(0, li).every(l => l.completed);
                                return (
                                    <LessonRow
                                        key={lesson.id}
                                        lesson={lesson}
                                        courseId={courseId}
                                        isLocked={false} // allow access to all
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;

    const course = courses.find(c => c.id === courseId);
    const content = getCourseContent(courseId);

    if (!course || !content) {
        return (
            <DashboardLayout breadcrumbs={['Home', 'Courses', 'Not Found']}>
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-zinc-400 font-medium">Course not found</p>
                    <Link href="/courses" className="mt-4 text-sm text-blue-400 hover:underline">← Back to Courses</Link>
                </div>
            </DashboardLayout>
        );
    }

    const SubjectIcon = subjectIcons[course.subject];
    const allLessons = content.chapters.flatMap(c => c.lessons);
    const completedCount = allLessons.filter(l => l.completed).length;

    // Find next lesson
    const nextLesson = allLessons.find(l => !l.completed);
    const nextChapter = content.chapters.find(ch => ch.lessons.some(l => l.id === nextLesson?.id));

    return (
        <DashboardLayout breadcrumbs={['Home', 'Courses', course.title]}>
            <div className="max-w-[1100px] mx-auto space-y-6">
                {/* ── Hero Banner ─────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${course.gradientFrom} ${course.gradientTo} border border-zinc-800 p-6 md:p-8`}
                >
                    {/* Decorative blob */}
                    <div
                        className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-10 pointer-events-none"
                        style={{ background: course.accentColor }}
                    />
                    <div
                        className="absolute right-24 bottom-0 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
                        style={{ background: course.accentColor }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
                        {/* Info */}
                        <div className="flex-1">
                            <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-semibold mb-3 ${course.tagClass}`}>
                                A-Level · Cambridge
                            </span>
                            <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-100 leading-tight mb-2">
                                {course.title}
                            </h1>
                            <p className="text-zinc-400 text-sm mb-4">
                                Expert instruction in all major topics — from fundamentals to advanced exam technique.
                            </p>

                            {/* Instructor */}
                            <div className="flex items-center gap-2.5 mb-5">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-zinc-950"
                                    style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                                >
                                    {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">{course.instructor}</p>
                                    <p className="text-xs text-zinc-500">{course.instructorTitle}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: BookOpen, val: `${course.totalLessons} lessons`, color: course.color },
                                    { icon: Clock, val: `${Math.round(course.totalLessons * 28)} min total`, color: course.color },
                                    { icon: BarChart3, val: `${course.progress}% done`, color: course.color },
                                ].map(s => {
                                    const SI = s.icon;
                                    return (
                                        <span key={s.val} className="flex items-center gap-1.5 text-sm text-zinc-400">
                                            <SI size={14} style={{ color: s.color }} />
                                            {s.val}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-zinc-950/60 backdrop-blur border border-zinc-800 rounded-2xl p-5 min-w-[180px]">
                            <p className="text-xs text-zinc-500 mb-3">Your Progress</p>
                            <p className="font-serif text-4xl font-bold mb-1" style={{ color: course.color }}>
                                {course.progress}%
                            </p>
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress}%` }}
                                    transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                                    className="h-full rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${course.accentColor}, ${course.color})` }}
                                />
                            </div>
                            <p className="text-xs text-zinc-600">
                                {completedCount} / {allLessons.length} lessons
                            </p>

                            {nextLesson && (
                                <Link
                                    href={`/courses/${course.id}/lesson/${nextLesson.id}`}
                                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-950 hover:opacity-90 transition-all"
                                    style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                                >
                                    <Play size={12} fill="currentColor" /> Continue
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Next Up ──────────────────────────── */}
                {nextLesson && nextChapter && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="flex items-center gap-4 bg-zinc-900 border rounded-2xl px-5 py-4"
                        style={{ borderColor: `${course.accentColor}30` }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${course.accentColor}20` }}
                        >
                            <Play size={16} fill={course.accentColor} style={{ color: course.accentColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-500 mb-0.5">Up Next</p>
                            <p className="text-sm font-medium text-zinc-200 truncate">{nextLesson.title}</p>
                            <p className="text-[11px] text-zinc-600">{nextChapter.title} · {nextLesson.duration}</p>
                        </div>
                        <Link
                            href={`/courses/${course.id}/lesson/${nextLesson.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-950 hover:opacity-90 transition-all flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                        >
                            Start <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                )}

                {/* ── Chapter Accordion ───────────────── */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl font-semibold text-zinc-200">Course Content</h2>
                        <p className="text-xs text-zinc-500">{content.chapters.length} chapters · {allLessons.length} lessons</p>
                    </div>

                    {content.chapters.map((chapter, i) => (
                        <ChapterAccordion
                            key={chapter.id}
                            chapter={chapter}
                            courseId={course.id}
                            defaultOpen={i === content.chapters.findIndex(ch => ch.lessons.some(l => !l.completed))}
                            index={i}
                        />
                    ))}
                </section>
            </div>
        </DashboardLayout>
    );
}
