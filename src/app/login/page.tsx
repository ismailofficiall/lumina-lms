'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setLoading(true);
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        setLoading(false);

        if (result?.error) {
            if (result.error.includes('DEVICE_LIMIT')) {
                setError('Device limit reached. You are already signed in on 2 devices. Please sign out from one device first.');
            } else {
                setError('Incorrect email or password. Please try again.');
            }
        } else {
            router.push('/dashboard');
        }
    };


    return (
        <div className="min-h-screen bg-zinc-950 flex">

            {/* ── Left panel (decorative) ─────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
                <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(212,168,67,0.08) 0%, transparent 60%)' }} />
                <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(129,140,248,0.06) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(212,168,67,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,1) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                    }} />

                <div className="relative z-10 max-w-md text-center">
                    <div className="flex items-center gap-3 justify-center mb-12">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                            <GraduationCap size={24} className="text-zinc-950" />
                        </div>
                        <span className="font-serif text-3xl font-bold gold-text">Lumina</span>
                    </div>

                    <h2 className="font-serif text-4xl font-bold text-zinc-100 mb-4 leading-tight">
                        Your gateway to{' '}
                        <span className="gold-text italic">academic excellence</span>
                    </h2>
                    <p className="text-zinc-500 leading-relaxed mb-10">
                        Expert instruction in Economics, Accounting, Business Studies, and ICT —
                        tailored for Sri Lanka A/L students.
                    </p>

                    {/* Subject pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { label: 'Economics', tag: 'tag-economics' },
                            { label: 'Accounting', tag: 'tag-accounting' },
                            { label: 'Business Studies', tag: 'tag-bst' },
                            { label: 'ICT', tag: 'tag-ict' },
                        ].map(s => (
                            <span key={s.label} className={`text-sm px-4 py-1.5 rounded-full font-medium ${s.tag}`}>
                                {s.label}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[
                            { value: '4,800+', label: 'Students' },
                            { value: '60+', label: 'Videos' },
                            { value: '96%', label: 'Pass Rate' },
                        ].map(s => (
                            <div key={s.label} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                                <p className="font-serif text-2xl font-bold gold-text">{s.value}</p>
                                <p className="text-xs text-zinc-600 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Access badge */}
                    <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                        style={{ background: 'rgba(212,168,67,0.06)', borderColor: 'rgba(212,168,67,0.2)' }}>
                        <ShieldCheck size={13} style={{ color: '#d4a843' }} />
                        <span className="text-xs" style={{ color: '#d4a843' }}>
                            Access restricted to enrolled students only
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Right panel (login form) ─────────── */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #d4a843, #9c7a2f)' }}>
                            <GraduationCap size={18} className="text-zinc-950" />
                        </div>
                        <span className="font-serif text-2xl font-bold gold-text">Lumina</span>
                    </Link>

                    {/* Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.25)' }}>
                                <ShieldCheck size={18} style={{ color: '#d4a843' }} />
                            </div>
                            <div>
                                <h1 className="font-serif text-xl font-semibold text-zinc-100">Student Sign In</h1>
                                <p className="text-xs text-zinc-500">Lumina · InCo. Learning Portal</p>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Email Address</label>
                                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 focus-within:border-zinc-600 transition-colors">
                                    <Mail size={15} className="text-zinc-600 flex-shrink-0" />
                                    <input
                                        type="email"
                                        placeholder="you@lumina.lk"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        autoComplete="email"
                                        className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-700 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Password</label>
                                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 focus-within:border-zinc-600 transition-colors">
                                    <Lock size={15} className="text-zinc-600 flex-shrink-0" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-700 outline-none"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-zinc-600 hover:text-zinc-400">
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-zinc-950 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Verifying access...
                                    </span>
                                ) : (
                                    <>Sign In <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>

                        {/* Note */}
                        <div className="mt-6 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                            <p className="text-xs text-zinc-600 text-center leading-relaxed">
                                Access is limited to enrolled students only.<br />
                                Contact your instructor if you need help signing in.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-center text-zinc-700 mt-5">
                        © 2026 Lumina LMS · Powered by{' '}
                        <span className="font-semibold" style={{ color: '#d4a843' }}>InCo.</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
