'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import {
    LayoutDashboard, BookOpen, CalendarDays, FolderOpen, Settings,
    ChevronLeft, ChevronRight, GraduationCap, LogOut, X, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/courses', icon: BookOpen },
    { label: 'Schedule', href: '/schedule', icon: CalendarDays },
    { label: 'Resources', href: '/resources', icon: FolderOpen },
    { label: 'Settings', href: '/settings', icon: Settings },
];

const subjectLinks = [
    { label: 'Economics', href: '/courses?subject=economics', color: '#818cf8' },
    { label: 'Accounting', href: '/courses?subject=accounting', color: '#34d399' },
    { label: 'Business Studies', href: '/courses?subject=bst', color: '#fbbf24' },
    { label: 'ICT', href: '/courses?subject=ict', color: '#f472b6' },
];

/* ────────────────────────── Desktop sidebar ──────────────────────── */
const sidebarVariants = {
    expanded: { width: '256px' },
    collapsed: { width: '68px' },
};

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    // Derive display info from session, fall back to generic
    const userName = session?.user?.name ?? 'Student';
    const userEmail = session?.user?.email ?? '';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <motion.aside
            variants={sidebarVariants}
            animate={collapsed ? 'collapsed' : 'expanded'}
            initial="expanded"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden md:flex relative flex-col h-screen bg-zinc-950 border-r border-zinc-800/60 z-40 flex-shrink-0"
            style={{ overflow: 'hidden' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-800/60">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                    <GraduationCap size={18} className="text-zinc-950" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            <span className="font-serif text-xl font-semibold gold-text tracking-wide">Lumina</span>
                            <p className="text-[10px] text-zinc-500 font-sans -mt-0.5 tracking-widest uppercase">Learning Portal</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 px-2 mb-2">
                            Main Menu
                        </motion.p>
                    )}
                </AnimatePresence>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link key={item.label} href={item.href}
                            className={cn('sidebar-link w-full border', isActive ? 'active border-transparent' : 'border-transparent hover:border-zinc-800', collapsed && 'justify-center px-0')}
                            title={collapsed ? item.label : undefined}>
                            <Icon size={18} className="flex-shrink-0" style={isActive ? { color: '#d4a843' } : { color: '#71717a' }} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden whitespace-nowrap">
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}

                <div className="h-px bg-zinc-800/60 my-3" />

                <AnimatePresence>
                    {!collapsed && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 px-2 mb-2">
                            Subjects
                        </motion.p>
                    )}
                </AnimatePresence>

                {subjectLinks.map(({ label, href, color }) => (
                    <Link key={label} href={href} className={cn('sidebar-link w-full border border-transparent', collapsed && 'justify-center px-0')}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap text-sm">
                                    {label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            {/* User + Sign-Out */}
            <div className="border-t border-zinc-800/60 p-3">
                <div className={cn('flex items-center gap-3 p-2 rounded-xl', collapsed && 'justify-center')}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-zinc-950" style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                        {initials}
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-200 truncate">{userName}</p>
                                <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.button
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={handleSignOut}
                                title="Sign out"
                                className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                            >
                                <LogOut size={15} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Show sign-out in collapsed mode as icon only */}
                {collapsed && (
                    <button
                        onClick={handleSignOut}
                        title="Sign out"
                        className="w-full flex justify-center p-2 mt-1 text-zinc-600 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
                    >
                        <LogOut size={15} />
                    </button>
                )}
            </div>

            {/* Collapse toggle */}
            <button onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3.5 top-[72px] w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-all shadow-lg z-50">
                {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
        </motion.aside>
    );
}

/* ────────────────────────── Mobile drawer ───────────────────────── */
export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const userName = session?.user?.name ?? 'Student';
    const userEmail = session?.user?.email ?? '';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    const handleSignOut = async () => {
        setOpen(false);
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <>
            {/* Bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60 safe-area-bottom">
                <div className="flex items-center justify-around px-1 py-1">
                    {navItems.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link key={item.label} href={item.href}
                                className={cn('flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 flex-1',
                                    isActive ? 'text-amber-400' : 'text-zinc-500 active:bg-zinc-800/60'
                                )}>
                                <Icon size={20} />
                                <span className="text-[10px] font-medium truncate">{item.label.replace('My ', '')}</span>
                            </Link>
                        );
                    })}

                    {/* More button */}
                    <button onClick={() => setOpen(true)}
                        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 flex-1 text-zinc-500 active:bg-zinc-800/60">
                        <Menu size={20} />
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </div>
            </nav>

            {/* Slide-up drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-50"
                            onClick={() => setOpen(false)} />
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 rounded-t-3xl overflow-hidden">
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-zinc-700" />
                            </div>
                            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                                        <GraduationCap size={13} className="text-zinc-950" />
                                    </div>
                                    <span className="font-serif font-semibold gold-text">Lumina</span>
                                </div>
                                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="p-4 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                        <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
                                            className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                                isActive
                                                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                                            )}>
                                            <Icon size={18} />
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                <div className="h-px bg-zinc-800 my-2" />
                                <p className="text-[10px] text-zinc-600 uppercase tracking-wider px-4 pb-1 font-semibold">Subjects</p>
                                {subjectLinks.map(({ label, href, color }) => (
                                    <Link key={label} href={href} onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-all">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            {/* Profile + sign-out row */}
                            <div className="flex items-center gap-3 px-5 py-4 border-t border-zinc-800 mx-4 mb-4 rounded-xl bg-zinc-900/60">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-zinc-950" style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-200 truncate">{userName}</p>
                                    <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    title="Sign out"
                                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10"
                                >
                                    <LogOut size={14} /> Sign out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
