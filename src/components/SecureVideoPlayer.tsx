'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Loader2, RotateCcw, FastForward, Clock, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecureVideoPlayerProps {
    youtubeId: string;
    title: string;
    color: string;
    lessonId?: string; // used as localStorage key for resume
}

const STORAGE_KEY = (lessonId: string) => `lumina_progress_${lessonId}`;

/** Parse "h:mm:ss", "m:ss", or plain seconds string → total seconds */
function parseTimestamp(raw: string): number | null {
    const parts = raw.trim().split(':').map(p => parseFloat(p.trim()));
    if (parts.some(p => isNaN(p))) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1 && !isNaN(parts[0])) return parts[0];
    return null;
}

function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SecureVideoPlayer({ youtubeId, title, color, lessonId }: SecureVideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // ── Resume / Jump state ──────────────────────────────────────────────
    const [savedTime, setSavedTime] = useState<number | null>(null);
    const [showResumeBanner, setShowResumeBanner] = useState(false);
    const [jumpInput, setJumpInput] = useState('');
    const [jumpError, setJumpError] = useState(false);
    const [showJump, setShowJump] = useState(false);

    const hideRef = useRef<NodeJS.Timeout | null>(null);
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    /* ── Generic YT Command Sender ── */
    const postYT = useCallback((func: string, args: unknown[] = []) => {
        if (!iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func, args }),
            '*'
        );
    }, []);

    /* ── Load saved timestamp from localStorage ── */
    useEffect(() => {
        if (!lessonId) return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY(lessonId));
            if (raw) {
                const t = parseFloat(raw);
                if (t > 5) { // only show if more than 5s in
                    setSavedTime(t);
                    setShowResumeBanner(true);
                }
            }
        } catch { /* noop */ }
    }, [lessonId]);

    /* ── Auto-save progress every 5s ── */
    useEffect(() => {
        if (!lessonId || !playing) return;
        saveTimerRef.current = setInterval(() => {
            if (currentTime > 5) {
                try { localStorage.setItem(STORAGE_KEY(lessonId), String(currentTime)); } catch { /* noop */ }
            }
        }, 5000);
        return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current); };
    }, [lessonId, playing, currentTime]);

    /* ── Also save on unmount (page leave) ── */
    useEffect(() => {
        return () => {
            if (lessonId && currentTime > 5) {
                try { localStorage.setItem(STORAGE_KEY(lessonId), String(currentTime)); } catch { /* noop */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    /* ── Deep State Listener ── */
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (!e.origin.includes('youtube')) return;
            try {
                const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

                if (data.event === 'onReady') {
                    setLoading(false);
                    postYT('listen', []);
                    postYT('getAttribute', ['duration']);
                }

                const info = data.info || (data.event === 'infoDelivery' ? data.info : null);
                if (info) {
                    if (info.playerState !== undefined) {
                        const status = info.playerState;
                        if (status === 1) { setPlaying(true); setHasPlayedOnce(true); setLoading(false); }
                        if (status === 2 || status === 0) setPlaying(false);
                    }
                    if (info.currentTime !== undefined && !isDragging) setCurrentTime(info.currentTime);
                    if (info.duration !== undefined && info.duration > 0) setDuration(info.duration);
                    if (info.playbackRate !== undefined) setPlaybackRate(info.playbackRate);
                }

                if (data.event === 'onStateChange') {
                    const status = data.info;
                    if (status === 1) { setPlaying(true); setHasPlayedOnce(true); setLoading(false); }
                    if (status === 2 || status === 0) setPlaying(false);
                }
            } catch { /* ignore */ }
        };

        window.addEventListener('message', handler);
        setHasMounted(true);

        const fallback = setTimeout(() => setLoading(false), 4000);
        return () => {
            window.removeEventListener('message', handler);
            clearTimeout(fallback);
        };
    }, [playbackRate, postYT, isDragging]);

    /* ── Smooth Progress Movement ── */
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (playing && !isDragging) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (duration > 0 && prev >= duration) return prev;
                    return prev + 0.1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [playing, isDragging, duration]);

    /* ── Controls Auto-hide ── */
    const resetHide = useCallback(() => {
        setShowControls(true);
        if (hideRef.current) clearTimeout(hideRef.current);
        if (playing) {
            hideRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [playing]);

    /* ── Fullscreen change listener ── */
    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    /* ── Keyboard Shortcuts ── */
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
            if (e.code === 'ArrowLeft') { e.preventDefault(); skip(-10); }
            if (e.code === 'ArrowRight') { e.preventDefault(); skip(10); }
            if (e.code === 'ArrowLeft' && e.shiftKey) { e.preventDefault(); skip(-60); }
            if (e.code === 'ArrowRight' && e.shiftKey) { e.preventDefault(); skip(60); }
            if (e.code === 'KeyM') { e.preventDefault(); toggleMute(e as any); }
            if (e.code === 'KeyF') { e.preventDefault(); toggleFullscreen(e as any); }
            if (e.code === 'KeyJ') { e.preventDefault(); setShowJump(v => !v); }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, currentTime, duration, postYT]);

    /* ── Actions ── */
    const togglePlay = () => {
        if (playing) {
            postYT('pauseVideo');
            setPlaying(false);
        } else {
            postYT('playVideo');
            setPlaying(true);
            setHasPlayedOnce(true);
            if (containerRef.current && !document.fullscreenElement) {
                containerRef.current.requestFullscreen().catch(() => { });
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e?.stopPropagation();
        if (muted) { postYT('unMute'); setMuted(false); }
        else { postYT('mute'); setMuted(true); }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e?.stopPropagation();
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
        else document.exitFullscreen();
    };

    const seekTo = (val: number) => {
        const clamped = Math.max(0, Math.min(duration || val, val));
        setCurrentTime(clamped);
        postYT('seekTo', [clamped, true]);
    };

    const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        seekTo(val);
    };

    const onScrubInput = (e: React.FormEvent<HTMLInputElement>) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        seekTo(val);
    };

    const skip = (seconds: number) => {
        seekTo(currentTime + seconds);
    };

    const changeRate = (rate: number) => {
        setPlaybackRate(rate);
        postYT('setPlaybackRate', [rate]);
    };

    /* ── Resume from saved ── */
    const handleResume = () => {
        if (savedTime !== null) {
            seekTo(savedTime);
            postYT('playVideo');
            setPlaying(true);
            setHasPlayedOnce(true);
        }
        setShowResumeBanner(false);
    };

    const handleDismissResume = () => setShowResumeBanner(false);

    /* ── Jump to timestamp ── */
    const handleJump = (e?: React.FormEvent) => {
        e?.preventDefault();
        const t = parseTimestamp(jumpInput);
        if (t === null) {
            setJumpError(true);
            setTimeout(() => setJumpError(false), 1200);
            return;
        }
        seekTo(t);
        setJumpInput('');
        setShowJump(false);
    };

    const noCtx = (e: React.MouseEvent) => e.preventDefault();

    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&version=3&widgetid=1&controls=0&disablekb=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&playsinline=1&fs=0&origin=${hasMounted ? encodeURIComponent(window.location.origin) : ''}`;

    const progressPct = (currentTime / (duration || 1)) * 100;

    return (
        <div
            ref={containerRef}
            className="group relative w-full aspect-video rounded-3xl overflow-hidden bg-black select-none shadow-2xl"
            onContextMenu={noCtx}
            onMouseMove={resetHide}
        >
            {/* ── YouTube Engine ── */}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ border: 'none' }}
            />

            {/* ── Click Overlay ── */}
            <div className="absolute inset-0 z-10" onClick={togglePlay}>
                <div className="absolute inset-y-0 left-0 w-1/4" onDoubleClick={(e) => { e.stopPropagation(); skip(-10); }} />
                <div className="absolute inset-y-0 right-0 w-1/4" onDoubleClick={(e) => { e.stopPropagation(); skip(10); }} />
            </div>

            {/* ── Resume Banner ── */}
            <AnimatePresence>
                {showResumeBanner && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium shadow-2xl backdrop-blur-sm"
                        style={{ background: 'rgba(15,15,15,0.92)', border: `1px solid ${color}40` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Clock size={14} style={{ color }} />
                        <span className="text-zinc-300">
                            Resume from <span className="font-bold" style={{ color }}>{formatTime(savedTime ?? 0)}</span>
                        </span>
                        <button
                            onClick={handleResume}
                            className="ml-1 px-3 py-1 rounded-xl text-xs font-bold text-zinc-950 hover:opacity-90 transition-all"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                        >
                            Resume
                        </button>
                        <button
                            onClick={handleDismissResume}
                            className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors ml-1"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Jump to Timestamp Panel ── */}
            <AnimatePresence>
                {showJump && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3 min-w-[260px]"
                        style={{ background: 'rgba(9,9,11,0.95)', border: `1px solid ${color}30` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <CornerDownRight size={12} style={{ color }} /> Jump to Timestamp
                        </p>
                        <form onSubmit={handleJump} className="flex gap-2">
                            <input
                                autoFocus
                                value={jumpInput}
                                onChange={e => { setJumpInput(e.target.value); setJumpError(false); }}
                                placeholder="e.g. 1:23:45 or 45:30"
                                className="flex-1 bg-zinc-900 border rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none font-mono transition-colors"
                                style={{ borderColor: jumpError ? '#ef4444' : `${color}40` }}
                                onKeyDown={e => e.key === 'Escape' && setShowJump(false)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 hover:opacity-90 transition-all flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                            >
                                Go
                            </button>
                        </form>
                        {jumpError && (
                            <p className="text-xs text-red-400">Invalid format — try <code className="text-red-300">1:23:45</code></p>
                        )}
                        <p className="text-[10px] text-zinc-600">
                            Tip: Press <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">J</kbd> to toggle · <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">Shift+←/→</kbd> to skip 1 min
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Initial Loading ── */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
                    >
                        <Loader2 size={40} className="animate-spin mb-4" style={{ color }} />
                        <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Initializing Stream</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Dynamic Center Button ── */}
            <AnimatePresence>
                {!playing && !loading && (
                    <motion.div
                        key="center-ui"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            className="flex items-center justify-center rounded-full shadow-2xl"
                            style={{ width: '96px', height: '96px', background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                        >
                            <Play size={36} fill="white" className="text-white ml-1" />
                        </motion.div>
                        {!hasPlayedOnce && (
                            <div className="mt-8 text-center">
                                <h3 className="text-white text-2xl font-bold tracking-tight mb-1">{title}</h3>
                                <p className="text-white/50 text-sm">Click to enter secure classroom</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Control Bar ── */}
            <motion.div
                animate={{ opacity: (showControls || !playing) ? 1 : 0, y: (showControls || !playing) ? 0 : 20 }}
                className="absolute inset-x-0 bottom-0 z-30 p-6 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"
            >
                {/* ── Scrubber row ── */}
                <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                    <span className="text-[11px] font-bold text-white/70 tabular-nums w-12 text-right shrink-0">
                        {formatTime(currentTime)}
                    </span>

                    {/* Progress bar */}
                    <div className="relative flex-1 h-1.5 group/seek">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            step={0.5}
                            value={currentTime}
                            onChange={onScrub}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-none"
                                style={{ background: color, width: `${progressPct}%` }}
                            />
                        </div>
                        {/* Thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                            style={{ left: `calc(${progressPct}% - 8px)` }}
                        />
                    </div>

                    <span className="text-[11px] font-bold text-white/70 tabular-nums w-12 shrink-0">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* ── Buttons row ── */}
                <div className="flex items-center justify-between pointer-events-auto">
                    {/* Left group */}
                    <div className="flex items-center gap-5">
                        <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                            {playing
                                ? <Pause size={28} className="text-white" fill="white" />
                                : <Play size={28} className="text-white" fill="white" />}
                        </button>

                        {/* Skip buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); skip(-10); }}
                                className="text-white/60 hover:text-white transition-colors p-1 group/btn flex flex-col items-center"
                                title="Back 10s (←)"
                            >
                                <RotateCcw size={18} />
                                <span className="text-[8px] text-white/30 group-hover/btn:text-white/50 -mt-0.5">10</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); skip(10); }}
                                className="text-white/60 hover:text-white transition-colors p-1 group/btn flex flex-col items-center"
                                title="Forward 10s (→)"
                            >
                                <FastForward size={18} />
                                <span className="text-[8px] text-white/30 group-hover/btn:text-white/50 -mt-0.5">10</span>
                            </button>
                        </div>

                        <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                        </button>

                        {/* Jump-to timestamp button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowJump(v => !v); }}
                            title="Jump to timestamp (J)"
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border ${showJump ? 'text-zinc-950 border-transparent' : 'text-white/50 border-white/10 hover:text-white hover:border-white/20'}`}
                            style={showJump ? { background: `linear-gradient(135deg, ${color}, ${color}cc)`, border: 'none' } : {}}
                        >
                            <Clock size={13} />
                            <span className="hidden sm:inline">Jump to</span>
                        </button>
                    </div>

                    {/* Right group */}
                    <div className="flex items-center gap-4">
                        {/* Speed */}
                        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                            {[0.75, 1, 1.25, 1.5, 2].map(r => (
                                <button
                                    key={r}
                                    onClick={() => changeRate(r)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${playbackRate === r ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    {r}x
                                </button>
                            ))}
                        </div>

                        <button onClick={toggleFullscreen} className="text-white/60 hover:text-white hover:scale-110 transition-all">
                            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
