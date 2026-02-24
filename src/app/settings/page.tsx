'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    User, Mail, Lock, Bell, Palette, Globe,
    Shield, ChevronRight, Check, Monitor, Moon, Sun,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const sections = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'language', label: 'Language', icon: Globe },
];

export default function SettingsPage() {
    const { data: session } = useSession();
    const userName = session?.user?.name ?? 'Student';
    const userEmail = session?.user?.email ?? '';
    const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    const firstName = userName.split(' ')[0];
    const lastName = userName.split(' ').slice(1).join(' ');

    const [activeSection, setActiveSection] = useState('profile');
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
    const [notifications, setNotifications] = useState({
        deadlines: true,
        liveClasses: true,
        grades: true,
        announcements: false,
        weeklyDigest: true,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <DashboardLayout breadcrumbs={['Home', 'Settings']}>
            <div className="max-w-[1000px] mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="font-serif text-3xl font-semibold text-zinc-100">
                        Account <span className="gold-text italic">Settings</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage your profile, preferences, and privacy</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* ── Left: Nav ───────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 h-fit"
                    >
                        {sections.map(s => {
                            const Icon = s.icon;
                            const isActive = activeSection === s.key;
                            return (
                                <button
                                    key={s.key}
                                    onClick={() => setActiveSection(s.key)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${isActive
                                        ? 'text-zinc-950'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                        }`}
                                    style={isActive ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} />
                                        {s.label}
                                    </div>
                                    <ChevronRight size={13} className={isActive ? 'opacity-70' : 'opacity-30'} />
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* ── Right: Content ──────────── */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:col-span-3 space-y-4"
                    >
                        {/* ── Profile ── */}
                        {activeSection === 'profile' && (
                            <>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                    <h2 className="font-semibold text-zinc-200 mb-5">Personal Information</h2>

                                    {/* Avatar */}
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-zinc-950"
                                            style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}
                                        >
                                            {userInitials}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-200">{userName}</p>
                                            <p className="text-sm text-zinc-500">{userEmail}</p>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { label: 'First Name', value: firstName, icon: User },
                                            { label: 'Last Name', value: lastName, icon: User },
                                            { label: 'Email Address', value: userEmail, icon: Mail, full: true },
                                        ].map(f => (
                                            <div key={f.label} className={f.full ? 'sm:col-span-2' : ''}>
                                                <label className="text-xs font-medium text-zinc-500 block mb-1.5">{f.label}</label>
                                                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 focus-within:border-zinc-600 transition-colors">
                                                    <f.icon size={14} className="text-zinc-600" />
                                                    <input
                                                        defaultValue={f.value}
                                                        className="flex-1 bg-transparent text-sm text-zinc-300 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                    <h2 className="font-semibold text-zinc-200 mb-5">Change Password</h2>
                                    <div className="space-y-3">
                                        {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                                            <div key={l}>
                                                <label className="text-xs font-medium text-zinc-500 block mb-1.5">{l}</label>
                                                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5">
                                                    <Lock size={14} className="text-zinc-600" />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder-zinc-700"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Notifications ── */}
                        {activeSection === 'notifications' && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h2 className="font-semibold text-zinc-200 mb-5">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {(Object.keys(notifications) as (keyof typeof notifications)[]).map(key => {
                                        const labels: Record<string, string> = {
                                            deadlines: 'Upcoming Deadlines',
                                            liveClasses: 'Live Class Reminders',
                                            grades: 'Grade & Feedback Updates',
                                            announcements: 'Course Announcements',
                                            weeklyDigest: 'Weekly Progress Digest',
                                        };
                                        const descriptions: Record<string, string> = {
                                            deadlines: 'Get notified 24h before assignments are due',
                                            liveClasses: 'Reminded 15 minutes before each live session',
                                            grades: 'When instructors publish feedback or grades',
                                            announcements: 'Course updates and new materials posted',
                                            weeklyDigest: 'A summary of your progress every Sunday',
                                        };
                                        const isOn = notifications[key];
                                        return (
                                            <div key={key} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-none">
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-300">{labels[key]}</p>
                                                    <p className="text-xs text-zinc-600 mt-0.5">{descriptions[key]}</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                                                    className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${isOn ? '' : 'bg-zinc-700'}`}
                                                    style={isOn ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isOn ? 'left-5' : 'left-0.5'}`}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Appearance ── */}
                        {activeSection === 'appearance' && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h2 className="font-semibold text-zinc-200 mb-5">Appearance</h2>
                                <p className="text-sm text-zinc-500 mb-4">Choose your preferred theme</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { key: 'dark', label: 'Dark Mode', icon: Moon },
                                        { key: 'light', label: 'Light Mode', icon: Sun },
                                        { key: 'system', label: 'System', icon: Monitor },
                                    ] as const).map(t => {
                                        const Icon = t.icon;
                                        const isSelected = theme === t.key;
                                        return (
                                            <button
                                                key={t.key}
                                                onClick={() => setTheme(t.key)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${isSelected
                                                    ? 'border-transparent'
                                                    : 'border-zinc-800 hover:border-zinc-700'
                                                    }`}
                                                style={isSelected ? { background: 'rgba(212,168,67,0.1)', borderColor: 'rgba(212,168,67,0.4)' } : {}}
                                            >
                                                <Icon size={20} style={isSelected ? { color: '#d4a843' } : { color: '#71717a' }} />
                                                <span className={`text-xs font-medium ${isSelected ? 'text-gold-400' : 'text-zinc-500'}`}
                                                    style={isSelected ? { color: '#d4a843' } : {}}>
                                                    {t.label}
                                                </span>
                                                {isSelected && <Check size={12} style={{ color: '#d4a843' }} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Privacy / Language ── */}
                        {(activeSection === 'privacy' || activeSection === 'language') && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center py-16">
                                <div className="text-4xl mb-4">{activeSection === 'privacy' ? '🔒' : '🌐'}</div>
                                <p className="text-zinc-400 font-medium capitalize">{activeSection} settings</p>
                                <p className="text-zinc-600 text-sm mt-1 text-center max-w-xs">
                                    {activeSection === 'privacy'
                                        ? 'Control your data, visibility, and connected services.'
                                        : 'Switch your display language and region format.'}
                                </p>
                                <button className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors">
                                    Coming Soon
                                </button>
                            </div>
                        )}

                        {/* Save button */}
                        {(activeSection === 'profile' || activeSection === 'notifications' || activeSection === 'appearance') && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-zinc-950 transition-all hover:opacity-90 active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}
                                >
                                    {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
