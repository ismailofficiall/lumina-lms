'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { SubjectCard } from '@/components/SubjectCard';
import { DeadlinesPanel } from '@/components/DeadlinesPanel';
import { RecentActivity } from '@/components/RecentActivity';
import { WeeklySchedule } from '@/components/WeeklySchedule';
import { motion } from 'framer-motion';
import { courses } from '@/lib/data';

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function DashboardPage() {
    return (
        <DashboardLayout breadcrumbs={['Home', 'Dashboard']}>
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="max-w-[1600px] mx-auto space-y-6"
            >
                {/* Welcome Banner */}
                <motion.div variants={fadeUp}>
                    <WelcomeBanner />
                </motion.div>

                {/* Subject Cards */}
                <motion.section variants={fadeUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-xl font-semibold text-zinc-200">My Courses</h2>
                        <a href="/courses" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all →</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {courses.map((course, i) => (
                            <SubjectCard key={course.id} course={course} index={i} />
                        ))}
                    </div>
                </motion.section>

                {/* Bottom row */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Deadlines */}
                    <div className="lg:col-span-1">
                        <DeadlinesPanel />
                    </div>
                    {/* Recent Activity */}
                    <div className="lg:col-span-1">
                        <RecentActivity />
                    </div>
                    {/* Weekly Schedule */}
                    <div className="lg:col-span-1">
                        <WeeklySchedule />
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
