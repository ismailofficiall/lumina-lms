// ===================================
// LUMINA LMS — Mock Data
// Sri Lanka A/L Syllabus Edition
// ===================================

export const studentProfile = {
    name: 'Aaliyah Fernando',
    firstName: 'Aaliyah',
    avatar: 'AF',
    year: 'Year 13 · Sri Lanka A/L',
    email: 'a.fernando@lumina.lk',
    upcomingAssignments: 2,
    liveLectureToday: 'ICT',
    streakDays: 14,
    totalProgress: 68,
};

export type SubjectKey = 'economics' | 'accounting' | 'bst' | 'ict';

export interface Course {
    id: string;
    subject: SubjectKey;
    title: string;
    instructor: string;
    instructorTitle: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    lastAccessed: string;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    accentColor: string;
    tagClass: string;
    nextLesson: string;
    liveSession?: string;
}

export const courses: Course[] = [
    {
        id: 'economics',
        subject: 'economics',
        title: 'Economics',
        instructor: 'Arshad Ismail',
        instructorTitle: 'Economics Educator & A/L Specialist',
        progress: 0,
        totalLessons: 6,
        completedLessons: 0,
        lastAccessed: 'Not started',
        color: '#818cf8',
        gradientFrom: 'from-indigo-900/40',
        gradientTo: 'to-violet-900/20',
        accentColor: '#6366f1',
        tagClass: 'tag-economics',
        nextLesson: 'Final Seminar Series 2025 — Session 1',
        liveSession: undefined,
    },
    {
        id: 'accounting',
        subject: 'accounting',
        title: 'Accounting',
        instructor: 'Lakshita Rathnayake',
        instructorTitle: 'Accounting Educator & A/L Specialist',
        progress: 0,
        totalLessons: 30,
        completedLessons: 0,
        lastAccessed: 'Not started',
        color: '#34d399',
        gradientFrom: 'from-emerald-900/40',
        gradientTo: 'to-teal-900/20',
        accentColor: '#10b981',
        tagClass: 'tag-accounting',
        nextLesson: 'Past Paper Discussion 2012 – 2024 · Session 1',
        liveSession: undefined,
    },
    {
        id: 'bst',
        subject: 'bst',
        title: 'Business Studies',
        instructor: 'Hanam Naleem',
        instructorTitle: 'Business Studies Educator & A/L Specialist',
        progress: 0,
        totalLessons: 6,
        completedLessons: 0,
        lastAccessed: 'Not started',
        color: '#fbbf24',
        gradientFrom: 'from-amber-900/40',
        gradientTo: 'to-yellow-900/20',
        accentColor: '#f59e0b',
        tagClass: 'tag-bst',
        nextLesson: 'Bootcamp Recordings — Session 1',
        liveSession: undefined,
    },
    {
        id: 'ict',
        subject: 'ict',
        title: 'ICT',
        instructor: 'Ms. Nishadi Rathnayake',
        instructorTitle: 'B.Sc. (IT), University of Moratuwa',
        progress: 83,
        totalLessons: 40,
        completedLessons: 33,
        lastAccessed: 'Just now',
        color: '#f472b6',
        gradientFrom: 'from-pink-900/40',
        gradientTo: 'to-rose-900/20',
        accentColor: '#ec4899',
        tagClass: 'tag-ict',
        nextLesson: 'Chapter 10: Networks & Cyber Security',
        liveSession: 'Today, 3:00 PM',
    },
];

export type DeadlinePriority = 'high' | 'medium' | 'low';

export interface Deadline {
    id: string;
    subject: SubjectKey;
    title: string;
    type: 'Quiz' | 'Assignment' | 'Essay' | 'Project' | 'Exam';
    dueDate: string;
    daysLeft: number;
    priority: DeadlinePriority;
    borderClass: string;
}

export const deadlines: Deadline[] = [
    {
        id: 'd1',
        subject: 'ict',
        title: 'Database Design Project',
        type: 'Project',
        dueDate: 'Feb 25, 2026',
        daysLeft: 1,
        priority: 'high',
        borderClass: 'deadline-ict',
    },
    {
        id: 'd2',
        subject: 'economics',
        title: 'Market Structures Essay',
        type: 'Essay',
        dueDate: 'Feb 27, 2026',
        daysLeft: 3,
        priority: 'high',
        borderClass: 'deadline-economics',
    },
    {
        id: 'd3',
        subject: 'accounting',
        title: 'Chapter 11 Quiz',
        type: 'Quiz',
        dueDate: 'Mar 1, 2026',
        daysLeft: 5,
        priority: 'medium',
        borderClass: 'deadline-accounting',
    },
    {
        id: 'd4',
        subject: 'bst',
        title: 'Business Plan Assignment',
        type: 'Assignment',
        dueDate: 'Mar 4, 2026',
        daysLeft: 8,
        priority: 'medium',
        borderClass: 'deadline-bst',
    },
    {
        id: 'd5',
        subject: 'economics',
        title: 'Macroeconomics Mock Exam',
        type: 'Exam',
        dueDate: 'Mar 10, 2026',
        daysLeft: 14,
        priority: 'low',
        borderClass: 'deadline-economics',
    },
];

export interface RecentActivity {
    id: string;
    subject: SubjectKey;
    title: string;
    type: 'Video' | 'Slides' | 'Notes' | 'Quiz';
    duration?: string;
    pages?: number;
    accessedAt: string;
    tagClass: string;
    subjectColor: string;
}

export const recentActivities: RecentActivity[] = [
    {
        id: 'r1',
        subject: 'ict',
        title: 'Networks & Communication Protocols',
        type: 'Video',
        duration: '42 min',
        accessedAt: '30 minutes ago',
        tagClass: 'tag-ict',
        subjectColor: '#f472b6',
    },
    {
        id: 'r2',
        subject: 'economics',
        title: 'Price Elasticity of Demand — Lecture 7',
        type: 'Slides',
        pages: 24,
        accessedAt: '2 hours ago',
        tagClass: 'tag-economics',
        subjectColor: '#818cf8',
    },
    {
        id: 'r3',
        subject: 'accounting',
        title: 'Double Entry Bookkeeping Notes',
        type: 'Notes',
        pages: 15,
        accessedAt: 'Yesterday, 8:45 PM',
        tagClass: 'tag-accounting',
        subjectColor: '#34d399',
    },
    {
        id: 'r4',
        subject: 'bst',
        title: 'SWOT Analysis — Chapter 5 Quiz',
        type: 'Quiz',
        duration: '15 min',
        accessedAt: 'Yesterday, 5:00 PM',
        tagClass: 'tag-bst',
        subjectColor: '#fbbf24',
    },
];

export const weeklySchedule = [
    { day: 'Mon', date: 23, sessions: ['Economics', 'ICT Lab'] },
    { day: 'Tue', date: 24, sessions: ['Accounting'] },
    { day: 'Wed', date: 25, sessions: ['BST', 'Economics'] },
    { day: 'Thu', date: 26, sessions: ['ICT', 'Accounting'] },
    { day: 'Fri', date: 27, sessions: ['BST'] },
];

export const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Courses', href: '/courses', icon: 'BookOpen' },
    { label: 'Schedule', href: '/schedule', icon: 'CalendarDays' },
    { label: 'Resources', href: '/resources', icon: 'FolderOpen' },
    { label: 'Settings', href: '/settings', icon: 'Settings' },
];
