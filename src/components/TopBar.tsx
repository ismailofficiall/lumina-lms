'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Search, Bell, ChevronRight, Command, X, CheckCheck, BookOpen, Video, FileText, Play } from 'lucide-react';
import { courses } from '@/lib/data';
import { courseContents } from '@/lib/courseContent';

interface TopBarProps {
    breadcrumbs?: string[];
}

/* ── Search index ───────────────────────────────── */
interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    href: string;
    type: 'course' | 'lesson' | 'resource';
    color: string;
}

const subjectColors: Record<string, string> = {
    economics: '#818cf8',
    accounting: '#34d399',
    bst: '#fbbf24',
    ict: '#f472b6',
};

function buildIndex(): SearchResult[] {
    const results: SearchResult[] = [];

    // Courses
    courses.forEach(c => {
        results.push({
            id: c.id,
            title: c.title,
            subtitle: `Course · Instructor: ${c.instructor}`,
            href: `/courses/${c.id}`,
            type: 'course',
            color: c.color,
        });
    });

    // Lessons
    courseContents.forEach(cc => {
        const course = courses.find(c => c.id === cc.id);
        cc.chapters.forEach(ch => {
            ch.lessons.forEach(l => {
                results.push({
                    id: l.id,
                    title: l.title,
                    subtitle: `${course?.title ?? cc.id} · ${ch.title}`,
                    href: `/courses/${cc.id}/lesson/${l.id}`,
                    type: 'lesson',
                    color: course?.color ?? '#818cf8',
                });
            });
        });
    });

    return results;
}

const searchIndex = buildIndex();

const typeIcon: Record<string, any> = {
    course: BookOpen,
    lesson: Video,
    resource: FileText,
};

/* ── Notifications ──────────────────────────────── */
const initialNotifs = [
    { id: 1, text: 'ICT live lecture starts in 30 minutes', time: 'Just now', unread: true, href: '/courses/ict' },
    { id: 2, text: 'New assignment posted: Economics Essay', time: '1h ago', unread: true, href: '/schedule' },
    { id: 3, text: 'Prof. Alderton replied to your question', time: '3h ago', unread: false, href: '/courses/accounting' },
    { id: 4, text: 'Your weekly progress digest is ready', time: '1d ago', unread: false, href: '/dashboard' },
];

/* ── Component ──────────────────────────────────── */
export function TopBar({ breadcrumbs = ['Dashboard'] }: TopBarProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'S';
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState(initialNotifs);
    const inputRef = useRef<HTMLInputElement>(null);

    const unreadCount = notifs.filter(n => n.unread).length;

    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredResults = query.trim().length >= 2
        ? searchIndex.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.subtitle.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : [];

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const quickLinks: SearchResult[] = [
        { id: 'ql1', title: 'Economics — Market Structures', subtitle: 'Ch. 8 · Video', href: '/courses/economics/lesson/econ-8-1', type: 'lesson', color: '#818cf8' },
        { id: 'ql2', title: 'ICT — Network Protocols', subtitle: 'Ch. 10 · Video', href: '/courses/ict/lesson/ict-10-1', type: 'lesson', color: '#f472b6' },
        { id: 'ql3', title: 'Accounting — Partnership Quiz', subtitle: 'Ch. 12 · Quiz', href: '/courses/accounting/lesson/acc-12-4', type: 'lesson', color: '#34d399' },
        { id: 'ql4', title: 'Resources Library', subtitle: 'All study materials', href: '/resources', type: 'resource', color: '#fbbf24' },
    ];

    const displayed = query.trim().length >= 2 ? filteredResults : quickLinks;

    // Keyboard shortcut Cmd+K / Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotifOpen(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    }, [searchOpen]);

    const handleResultClick = (href: string) => {
        setSearchOpen(false);
        setQuery('');
        router.push(href);
    };

    // Breadcrumb URL mapper
    const getCrumbHref = (crumb: string, index: number) => {
        const c = crumb.toLowerCase();
        if (c === 'dashboard' || c === 'home') return '/dashboard';
        if (c === 'courses' || c === 'my courses') return '/courses';
        if (c === 'schedule') return '/schedule';
        if (c === 'resources') return '/resources';
        if (c === 'settings') return '/settings';

        // Subject pages
        if (['economics', 'accounting', 'bst', 'ict'].includes(c)) return `/courses/${c}`;

        return null;
    };

    // Search Keyboard Nav
    useEffect(() => {
        if (!searchOpen) return;
        const handleSearchKeys = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % displayed.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + displayed.length) % displayed.length);
            } else if (e.key === 'Enter') {
                if (displayed[selectedIndex]) {
                    handleResultClick(displayed[selectedIndex].href);
                }
            }
        };
        window.addEventListener('keydown', handleSearchKeys);
        return () => window.removeEventListener('keydown', handleSearchKeys);
    }, [searchOpen, selectedIndex, displayed]);

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
    const dismissNotif = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifs(prev => prev.filter(n => n.id !== id));
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
            {/* ── Breadcrumbs ─────────────────────── */}
            <nav className="flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    const href = getCrumbHref(crumb, i);

                    return (
                        <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
                            {i > 0 && <ChevronRight size={13} className="text-zinc-600" />}
                            {!isLast && href ? (
                                <Link href={href} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                                    {crumb}
                                </Link>
                            ) : (
                                <span className={isLast ? 'text-zinc-200 font-medium' : 'text-zinc-500'}>
                                    {crumb}
                                </span>
                            )}
                        </span>
                    );
                })}
            </nav>

            {/* ── Right controls ──────────────────── */}
            <div className="flex items-center gap-3">
                {/* Search trigger */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all text-sm md:w-52 w-auto"
                >
                    <Search size={14} />
                    <span className="hidden md:inline">Search...</span>
                    <span className="ml-auto hidden md:flex items-center gap-0.5 text-[10px] bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5">
                        <Command size={9} />K
                    </span>
                </button>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => { setNotifOpen(!notifOpen); }}
                        className="relative w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all"
                    >
                        <Bell size={16} />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-40"
                                    onClick={() => setNotifOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-11 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                                        <h3 className="font-semibold text-sm text-zinc-200">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs flex items-center gap-1 hover:text-zinc-300 transition-colors"
                                                style={{ color: '#d4a843' }}
                                            >
                                                <CheckCheck size={12} /> Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="divide-y divide-zinc-800 max-h-72 overflow-y-auto">
                                        {notifs.length === 0 ? (
                                            <div className="py-8 text-center text-zinc-600 text-sm">No notifications</div>
                                        ) : notifs.map(n => (
                                            <Link
                                                key={n.id}
                                                href={n.href}
                                                onClick={() => setNotifOpen(false)}
                                                className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer group ${n.unread ? 'bg-zinc-800/30' : ''}`}
                                            >
                                                {n.unread
                                                    ? <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#d4a843' }} />
                                                    : <span className="w-2 h-2 flex-shrink-0" />
                                                }
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-zinc-300">{n.text}</p>
                                                    <p className="text-xs text-zinc-600 mt-0.5">{n.time}</p>
                                                </div>
                                                <button
                                                    onClick={e => dismissNotif(n.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-all flex-shrink-0 mt-0.5"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Avatar */}
                <Link href="/settings">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-zinc-950 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-offset-zinc-950 transition-all"
                        style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}
                    >
                        {userInitials}
                    </div>
                </Link>
            </div>

            {/* ── Search Modal (fullscreen overlay) ── */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50"
                            onClick={() => { setSearchOpen(false); setQuery(''); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -16 }}
                            transition={{ duration: 0.15 }}
                            className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
                        >
                            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Input */}
                                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
                                    <Search size={16} className="text-zinc-500 flex-shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search courses, lessons, resources..."
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 text-sm outline-none"
                                    />
                                    {query && (
                                        <button onClick={() => setQuery('')} className="text-zinc-600 hover:text-zinc-400">
                                            <X size={15} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setSearchOpen(false); setQuery(''); }}
                                        className="text-[11px] bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-zinc-500"
                                    >
                                        Esc
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="p-2 max-h-80 overflow-y-auto">
                                    {query.trim().length > 0 && query.trim().length < 2 && (
                                        <p className="text-xs text-zinc-600 px-3 py-2">Keep typing to search...</p>
                                    )}

                                    {displayed.length === 0 && query.trim().length >= 2 && (
                                        <p className="text-sm text-zinc-500 px-3 py-6 text-center">No results for &quot;{query}&quot;</p>
                                    )}

                                    {displayed.length > 0 && (
                                        <>
                                            <p className="text-[10px] text-zinc-600 px-3 py-1.5 uppercase tracking-widest font-semibold">
                                                {query.trim().length >= 2 ? 'Results' : 'Quick Links'}
                                            </p>
                                            {displayed.map((r: SearchResult, idx: number) => {
                                                const Icon = typeIcon[r.type];
                                                const isSelected = idx === selectedIndex;
                                                return (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => handleResultClick(r.href)}
                                                        onMouseEnter={() => setSelectedIndex(idx)}
                                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${isSelected ? 'bg-zinc-800 ring-1 ring-zinc-700' : 'hover:bg-zinc-800/50'}`}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                            style={{ background: `${r.color}20` }}
                                                        >
                                                            <Icon size={14} style={{ color: r.color }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{r.title}</p>
                                                            <p className="text-[11px] text-zinc-600 truncate">{r.subtitle}</p>
                                                        </div>
                                                        <Play size={12} className={`flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-zinc-400' : 'opacity-0 group-hover:opacity-100 text-zinc-600'}`} />
                                                    </button>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>

                                {/* Footer hint */}
                                <div className="flex items-center gap-3 px-4 py-2.5 border-t border-zinc-800 text-[11px] text-zinc-700">
                                    <span>↑↓ Navigate</span>
                                    <span>↵ Open</span>
                                    <span className="ml-auto">Esc to close</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
