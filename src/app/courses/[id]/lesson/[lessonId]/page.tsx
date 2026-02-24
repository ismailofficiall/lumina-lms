'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SecureVideoPlayer } from '@/components/SecureVideoPlayer';
import { SecurePDFViewer } from '@/components/SecurePDFViewer';
import { courses } from '@/lib/data';
import { getCourseContent, type Lesson } from '@/lib/courseContent';
import {
    Play, SkipForward, SkipBack,
    CheckCircle2, Circle, ChevronRight, FileText,
    BookOpen, ArrowLeft, List, X, Star, Send,
} from 'lucide-react';


const typeColors: Record<string, string> = {
    video: '#f472b6', slides: '#818cf8', notes: '#34d399', quiz: '#fbbf24',
};

/* ─── Secure Video — wraps SecureVideoPlayer or shows placeholder ─── */
function VideoContent({ lesson, color }: { lesson: Lesson; color: string }) {
    if (lesson.youtubeId && lesson.youtubeId !== 'REPLACE_ME') {
        return (
            <SecureVideoPlayer
                youtubeId={lesson.youtubeId}
                title={lesson.title}
                color={color}
                lessonId={lesson.id}
            />
        );
    }
    // Placeholder shown until a real YouTube ID is added
    return (
        <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center gap-4 select-none"
            style={{ background: `radial-gradient(ellipse at center, ${color}06 0%, #09090b 70%)` }}
            onContextMenu={e => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
                <Play size={30} style={{ color }} fill="currentColor" className="ml-1" />
            </div>
            <div className="text-center px-6">
                <p className="font-serif text-xl font-semibold text-zinc-200 mb-1">{lesson.title}</p>
                <p className="text-zinc-600 text-sm">Add a YouTube video ID to <code className="text-zinc-500">courseContent.ts</code></p>
                <p className="text-xs text-zinc-700 mt-1">Set <code>youtubeId: &quot;YOUR_VIDEO_ID&quot;</code> on this lesson</p>
            </div>
        </div>
    );
}

/* ─── Slides Viewer — PDF if available, else interactive placeholder ── */
function SlidesViewer({ lesson, color }: { lesson: Lesson; color: string }) {
    if (lesson.pdfUrl) {
        const pages = parseInt(lesson.duration.replace(' slides', '')) || undefined;
        return <SecurePDFViewer pdfUrl={lesson.pdfUrl} title={lesson.title} color={color} pages={pages} />;
    }

    const totalSlides = parseInt(lesson.duration.replace(' slides', '')) || 12;
    const [slide, setSlide] = useState(1);

    const slideContent = [
        { icon: '📌', title: 'Introduction', body: 'Overview of key concepts and learning objectives for this chapter.' },
        { icon: '📊', title: 'Theory & Concepts', body: 'Core theoretical framework — understanding the principles behind the topic.' },
        { icon: '🔍', title: 'Deep Dive', body: 'Detailed analysis of the main concepts with worked examples.' },
        { icon: '✏️', title: 'Worked Example', body: 'Step-by-step walkthrough of an examination-style question.' },
        { icon: '💡', title: 'Key Formulae', body: 'Important equations and rules to memorise for the exam.' },
        { icon: '📈', title: 'Diagrams', body: 'Visual representations and annotated diagrams for clarity.' },
        { icon: '🧪', title: 'Case Study', body: 'Real-world application of the theory in a practical setting.' },
        { icon: '❓', title: 'Practice Questions', body: 'Exam-style questions to test your understanding of the topic.' },
        { icon: '⭐', title: 'Summary', body: 'Key takeaways and points to remember before your assessment.' },
    ];

    const current = slideContent[(slide - 1) % slideContent.length];

    return (
        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            {/* Slide display */}
            <div
                className="aspect-video flex flex-col items-center justify-center p-12 text-center relative"
                style={{ background: `radial-gradient(ellipse at center, ${color}06 0%, #09090b 70%)` }}
            >
                <div className="text-6xl mb-4">{current.icon}</div>
                <h3 className="font-serif text-2xl font-bold text-zinc-100 mb-3">{lesson.title}</h3>
                <p className="text-lg text-zinc-400 font-medium">{current.title}</p>
                <p className="text-zinc-500 text-sm mt-2 max-w-md">{current.body}</p>
                <div className="absolute bottom-4 right-4 text-xs text-zinc-700 font-mono">{slide} / {totalSlides}</div>
            </div>

            {/* Slide controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
                <button
                    disabled={slide === 1}
                    onClick={() => setSlide(s => s - 1)}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                >
                    <SkipBack size={15} /> Previous
                </button>
                <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalSlides, 12) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlide(i + 1)}
                            className="w-1.5 h-1.5 rounded-full transition-all"
                            style={{ background: slide === i + 1 ? color : '#3f3f46' }}
                        />
                    ))}
                </div>
                <button
                    disabled={slide === totalSlides}
                    onClick={() => setSlide(s => Math.min(s + 1, totalSlides))}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                >
                    Next <SkipForward size={15} />
                </button>
            </div>
        </div>
    );
}

/* ─── Quiz ──────────────────────────────────────────────── */
function QuizView({ lesson, color }: { lesson: Lesson; color: string }) {
    const questions = [
        {
            q: 'Which of the following best defines the concept discussed in this chapter?',
            options: ['Option A: The primary definition with key characteristics', 'Option B: A related but distinct concept', 'Option C: An incorrect interpretation', 'Option D: A partial explanation missing key elements'],
            correct: 0,
        },
        {
            q: 'What is the key formula or rule associated with this topic?',
            options: ['Formula A: The correct expression with proper variables', 'Formula B: An incorrect version', 'Formula C: A formula from a different topic', 'Formula D: A partial formula'],
            correct: 0,
        },
        {
            q: 'In an exam scenario, how would you apply this concept?',
            options: ['Approach A: Step-by-step application of the correct method', 'Approach B: An incomplete analysis', 'Approach C: Mixing up relevant concepts', 'Approach D: Ignoring key constraints'],
            correct: 0,
        },
    ];

    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const score = submitted
        ? questions.filter((q, i) => answers[i] === q.correct).length
        : 0;

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <FileText size={15} style={{ color }} />
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-200">{lesson.title}</h3>
                    <p className="text-xs text-zinc-500">{questions.length} questions · {lesson.duration}</p>
                </div>
                {submitted && (
                    <div className="ml-auto text-right">
                        <p className="font-bold text-lg" style={{ color: score === questions.length ? '#34d399' : color }}>
                            {score}/{questions.length}
                        </p>
                        <p className="text-xs text-zinc-500">{Math.round((score / questions.length) * 100)}%</p>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-6">
                {questions.map((q, qi) => (
                    <div key={qi}>
                        <p className="text-sm font-semibold text-zinc-200 mb-3">
                            {qi + 1}. {q.q}
                        </p>
                        <div className="space-y-2">
                            {q.options.map((opt, oi) => {
                                const selected = answers[qi] === oi;
                                const correct = submitted && oi === q.correct;
                                const wrong = submitted && selected && oi !== q.correct;
                                return (
                                    <button
                                        key={oi}
                                        disabled={submitted}
                                        onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                                        className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ${correct ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                            : wrong ? 'border-red-500/50 bg-red-500/10 text-red-300'
                                                : selected ? 'text-zinc-100'
                                                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                                            }`}
                                        style={selected && !submitted ? { borderColor: `${color}40`, background: `${color}10`, color: '#e4e4e7' } : {}}
                                    >
                                        <span className="font-mono text-xs opacity-60 mr-2">{String.fromCharCode(65 + oi)}.</span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {!submitted ? (
                    <button
                        onClick={() => setSubmitted(true)}
                        disabled={Object.keys(answers).length < questions.length}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-zinc-950 disabled:opacity-40 transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                    >
                        Submit Answers
                    </button>
                ) : (
                    <div className="rounded-xl p-4 text-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                        <p className="font-semibold text-zinc-200 mb-1">
                            {score === questions.length ? '🎉 Perfect score!' : score >= 2 ? '✅ Good effort!' : '📚 Keep studying!'}
                        </p>
                        <p className="text-sm text-zinc-500">You scored {score} out of {questions.length}.</p>
                        <button
                            onClick={() => { setAnswers({}); setSubmitted(false); }}
                            className="mt-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Notes Viewer — PDF if available, else rich-text placeholder ─── */
function NotesViewer({ lesson, color }: { lesson: Lesson; color: string }) {
    if (lesson.pdfUrl) {
        const pages = parseInt(lesson.duration.replace(' pages', '')) || undefined;
        return <SecurePDFViewer pdfUrl={lesson.pdfUrl} title={lesson.title} color={color} pages={pages} />;
    }
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BookOpen size={16} style={{ color: '#34d399' }} />
                    <h3 className="font-semibold text-zinc-200">{lesson.title}</h3>
                </div>
                <span className="text-xs text-zinc-500">{lesson.duration}</span>
            </div>
            <div className="p-6 prose prose-invert prose-zinc max-w-none">
                <div className="space-y-5 text-sm text-zinc-300 leading-relaxed">
                    <div className="p-4 rounded-xl border-l-2 border-zinc-600 bg-zinc-800/50">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Learning Objectives</p>
                        <ul className="list-disc list-inside space-y-1 text-zinc-400">
                            <li>Understand the core concepts covered in this chapter</li>
                            <li>Apply theoretical knowledge to examination questions</li>
                            <li>Analyse real-world examples using the frameworks studied</li>
                            <li>Evaluate different perspectives and approaches to the topic</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-zinc-100 mb-2 text-base">1. Key Definitions</h4>
                        <p className="text-zinc-400">The fundamental concepts of this topic form the basis of your understanding. It is essential to memorise precise definitions and be able to use them accurately in examination contexts.</p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider mb-1">⭐ Examiner's Tip</p>
                        <p className="text-zinc-300 text-sm">Always state the relevant theory or formula first, then apply it to the specific context of the question given. Markers award marks for explicit application.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-zinc-100 mb-2 text-base">2. Core Theory</h4>
                        <p className="text-zinc-400">The theoretical framework underpinning this chapter draws on established principles and models. Understanding the <em className="text-zinc-300">why</em> behind each concept will help you apply them flexibly in unseen examination scenarios.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-zinc-100 mb-2 text-base">3. Worked Example</h4>
                        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4">
                            <p className="text-zinc-400">
                                <strong className="text-zinc-200">Question:</strong> A firm operating in a competitive market faces a price of $50 per unit. Using the relevant theory, analyse the impact of a 10% increase in price on quantity demanded.
                            </p>
                            <p className="mt-3 text-zinc-400">
                                <strong className="text-zinc-200">Answer:</strong> Applying the relevant formula and the principles discussed in class, we can calculate the effect systematically using the step-by-step approach outlined in the lecture.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {['Key Point 1: Core definition must be precise', 'Key Point 2: Use diagrams wherever possible', 'Key Point 3: Apply theory to context', 'Key Point 4: Evaluate both sides'].map(p => (
                            <div key={p} className="flex items-start gap-2 bg-zinc-800/40 border border-zinc-800 rounded-lg p-3">
                                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#34d399' }} />
                                <span className="text-xs text-zinc-400">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────── PAGE ─────────────────────────────── */
export default function LessonPlayerPage() {
    // ── Page-level security: block right-click & selection on this page ──
    useEffect(() => {
        const noCtx = (e: MouseEvent) => e.preventDefault();
        const noSel = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', noCtx);
        document.addEventListener('selectstart', noSel);
        return () => {
            document.removeEventListener('contextmenu', noCtx);
            document.removeEventListener('selectstart', noSel);
        };
    }, []);
    const params = useParams();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;

    const course = courses.find(c => c.id === courseId);
    const content = getCourseContent(courseId);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!course || !content) {
        return (
            <DashboardLayout breadcrumbs={['Home', 'Courses', 'Lesson']}>
                <div className="text-center py-32">
                    <p className="text-zinc-400">Lesson not found.</p>
                    <Link href="/courses" className="text-sm text-blue-400 hover:underline mt-2 block">← Back</Link>
                </div>
            </DashboardLayout>
        );
    }

    const allLessons = content.chapters.flatMap(ch => ch.lessons.map(l => ({ ...l, chapterTitle: ch.title })));
    const currentIdx = allLessons.findIndex(l => l.id === lessonId);
    const lesson = allLessons[currentIdx];
    const prevLesson = allLessons[currentIdx - 1];
    const nextLesson = allLessons[currentIdx + 1];

    if (!lesson) {
        return (
            <DashboardLayout breadcrumbs={['Home', 'Courses', courseId]}>
                <div className="text-center py-32">
                    <p className="text-zinc-400">Lesson not found.</p>
                    <Link href={`/courses/${courseId}`} className="text-sm text-blue-400 hover:underline mt-2 block">← Back to course</Link>
                </div>
            </DashboardLayout>
        );
    }

    const breadcrumbs = ['Home', 'Courses', course.title, lesson.title];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-[1300px] mx-auto">
                {/* Top nav */}
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href={`/courses/${courseId}`}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                        <ArrowLeft size={15} /> Back to {course.title}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors border border-zinc-800 rounded-lg px-3 py-1.5"
                    >
                        {sidebarOpen ? <X size={14} /> : <List size={14} />}
                        {sidebarOpen ? 'Hide' : 'Show'} Contents
                    </button>
                </div>

                <div className={`grid gap-6 ${sidebarOpen ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {/* ── Main content ─ */}
                    <div className={sidebarOpen ? 'xl:col-span-2' : ''}>
                        <motion.div
                            key={lessonId}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            {/* Lesson header */}
                            <div>
                                <span
                                    className="text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
                                    style={{ background: `${typeColors[lesson.type]}15`, color: typeColors[lesson.type] }}
                                >
                                    {lesson.type}
                                </span>
                                <h1 className="font-serif text-2xl font-bold text-zinc-100 mt-2 mb-0.5">{lesson.title}</h1>
                                <p className="text-sm text-zinc-500">{(lesson as any).chapterTitle} · {lesson.duration}</p>
                            </div>

                            {/* Content pane */}
                            {lesson.type === 'video' && <VideoContent lesson={lesson} color={course.color} />}
                            {lesson.type === 'slides' && <SlidesViewer lesson={lesson} color={course.color} />}
                            {lesson.type === 'notes' && <NotesViewer lesson={lesson} color={course.color} />}
                            {lesson.type === 'quiz' && <QuizView lesson={lesson} color={course.color} />}

                            {/* Navigation */}
                            <div className="flex items-center justify-between gap-3 pt-2">
                                {prevLesson ? (
                                    <Link
                                        href={`/courses/${courseId}/lesson/${prevLesson.id}`}
                                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600 px-4 py-2.5 rounded-xl transition-all flex-1"
                                    >
                                        <ArrowLeft size={14} />
                                        <div className="text-left">
                                            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Previous</p>
                                            <p className="truncate max-w-[160px]">{prevLesson.title}</p>
                                        </div>
                                    </Link>
                                ) : <div />}

                                {nextLesson && (
                                    <Link
                                        href={`/courses/${courseId}/lesson/${nextLesson.id}`}
                                        className="flex items-center gap-2 text-sm font-medium text-zinc-950 px-4 py-2.5 rounded-xl transition-all hover:opacity-90 flex-1 justify-end"
                                        style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                                    >
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-950/70 uppercase tracking-wider">Next</p>
                                            <p className="truncate max-w-[160px]">{nextLesson.title}</p>
                                        </div>
                                        <ChevronRight size={14} />
                                    </Link>
                                )}
                            </div>

                            {/* Rating */}
                            {!submitted ? (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                                    <p className="text-sm font-semibold text-zinc-300 mb-3">Rate this lesson</p>
                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} onClick={() => setRating(s)}>
                                                <Star
                                                    size={22}
                                                    fill={s <= rating ? '#d4a843' : 'transparent'}
                                                    style={{ color: s <= rating ? '#d4a843' : '#3f3f46' }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            placeholder="Share your feedback (optional)..."
                                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-colors"
                                        />
                                        <button
                                            onClick={() => rating > 0 && setSubmitted(true)}
                                            disabled={rating === 0}
                                            className="px-4 py-2 rounded-xl disabled:opacity-40 transition-all hover:opacity-90"
                                            style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                                        >
                                            <Send size={14} className="text-zinc-950" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                                    <p className="text-zinc-300 font-medium">Thanks for your feedback! ⭐</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* ── Lesson sidebar ─ */}
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden h-fit max-h-[80vh] flex flex-col"
                        >
                            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-zinc-200">Course Content</h3>
                                <span className="text-[11px] text-zinc-600">
                                    {allLessons.filter(l => l.completed).length}/{allLessons.length} done
                                </span>
                            </div>

                            <div className="overflow-y-auto flex-1">
                                {content.chapters.map(chapter => (
                                    <div key={chapter.id} className="border-b border-zinc-800/60 last:border-none">
                                        <div className="px-4 py-2.5 bg-zinc-950/40">
                                            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider truncate">
                                                {chapter.title}
                                            </p>
                                        </div>
                                        {chapter.lessons.map(l => {
                                            const isCurrent = l.id === lessonId;
                                            const typeConf = { video: '#f472b6', slides: '#818cf8', notes: '#34d399', quiz: '#fbbf24' };
                                            return (
                                                <Link
                                                    key={l.id}
                                                    href={`/courses/${courseId}/lesson/${l.id}`}
                                                    className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors ${isCurrent ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
                                                        }`}
                                                >
                                                    {l.completed ? (
                                                        <CheckCircle2 size={14} style={{ color: '#34d399' }} className="flex-shrink-0" />
                                                    ) : (
                                                        <Circle size={14} className="text-zinc-700 flex-shrink-0" />
                                                    )}
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                        style={{ background: typeConf[l.type] }}
                                                    />
                                                    <p className={`text-xs truncate flex-1 ${isCurrent ? 'text-zinc-100 font-medium' : 'text-zinc-500'}`}>
                                                        {l.title}
                                                    </p>
                                                    {isCurrent && (
                                                        <Play size={10} fill={course.color} style={{ color: course.color, flexShrink: 0 }} />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
