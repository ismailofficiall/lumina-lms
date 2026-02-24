'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SubjectCard } from '@/components/SubjectCard';
import { courses } from '@/lib/data';
import { Search } from 'lucide-react';

const subjectFilters = [
    { key: 'all', label: 'All Subjects' },
    { key: 'economics', label: 'Economics' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'bst', label: 'Business Studies' },
    { key: 'ict', label: 'ICT' },
];

/* ── Inner component uses useSearchParams ── */
function CoursesContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('subject') ?? 'all';
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = courses.filter(c => {
        const matchesFilter = activeFilter === 'all' || c.subject === activeFilter;
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="font-serif text-3xl font-semibold text-zinc-100">
                    My <span className="gold-text italic">Courses</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    4 subjects enrolled · {courses.reduce((a, c) => a + c.completedLessons, 0)} lessons completed
                </p>
            </motion.div>

            {/* Filters + Search */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-wrap items-center gap-3"
            >
                <div className="flex items-center gap-2 flex-wrap">
                    {subjectFilters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${activeFilter === f.key
                                    ? 'text-zinc-950 shadow-md'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                }`}
                            style={activeFilter === f.key ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-600 transition-colors">
                    <Search size={14} className="text-zinc-600" />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none w-40"
                    />
                </div>
            </motion.div>

            {/* Course Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {filtered.map((course, i) => (
                        <SubjectCard key={course.id} course={course} index={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                >
                    <p className="text-5xl mb-4">📚</p>
                    <p className="text-zinc-400 font-medium">No courses match your search.</p>
                    <p className="text-zinc-600 text-sm mt-1">Try a different filter or search term.</p>
                </motion.div>
            )}

            {/* Overall Progress Summary */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {courses.map(course => (
                    <div
                        key={course.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-zinc-950"
                            style={{ background: `linear-gradient(135deg, ${course.accentColor}, ${course.color})` }}
                        >
                            {course.progress}%
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-300">{course.title}</p>
                            <div className="w-full mt-1.5 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${course.progress}%`, background: course.accentColor }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

/* ── Page wrapper provides the required Suspense boundary ── */
export default function CoursesPage() {
    return (
        <DashboardLayout breadcrumbs={['Home', 'My Courses']}>
            <Suspense fallback={
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-amber-400 animate-spin" />
                </div>
            }>
                <CoursesContent />
            </Suspense>
        </DashboardLayout>
    );
}
