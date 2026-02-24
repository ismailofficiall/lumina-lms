'use client';

import { useState } from 'react';
import { FileText, Loader2, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SecurePDFViewerProps {
    pdfUrl: string;      // Full URL to the PDF, e.g. /files/chapter1.pdf or a hosted URL
    title: string;
    color: string;
    pages?: number;
}

export function SecurePDFViewer({ pdfUrl, title, color, pages }: SecurePDFViewerProps) {
    const [loading, setLoading] = useState(true);

    /* Block right-click everywhere on this component */
    const noCtx = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

    /*
     * We append #toolbar=0&navpanes=0 to hide the PDF reader chrome in
     * Chrome / Firefox / Edge. This removes the "Download" and "Print" buttons
     * from the built-in viewer. Note: Safari shows its own toolbar.
     *
     * For stronger protection, serve PDFs through a signed API route that
     * requires authentication, so raw PDF URLs are time-limited.
     */
    const viewerUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`;

    return (
        <div
            className="relative rounded-2xl overflow-hidden border border-zinc-800 select-none"
            onContextMenu={noCtx}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
            {/* ── Header bar ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                    <FileText size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{title}</p>
                    {pages && <p className="text-xs text-zinc-600">{pages} pages</p>}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-medium">
                    <Lock size={10} />
                    <span>Protected</span>
                </div>
            </div>

            {/* ── Loading state ── */}
            <AnimatePresence>
                {loading && (
                    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 top-[52px] z-20 flex flex-col items-center justify-center bg-zinc-950 gap-3">
                        <Loader2 size={26} className="animate-spin" style={{ color }} />
                        <p className="text-xs text-zinc-600">Loading document...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PDF iframe ── */}
            <div className="relative">
                <iframe
                    src={viewerUrl}
                    title={title}
                    className="w-full block"
                    style={{ height: '72vh', border: 'none' }}
                    onLoad={() => setLoading(false)}
                    /*
                     * allow-scripts + allow-same-origin is required for the browser's
                     * own PDF viewer to function inside the sandbox. We omit
                     * allow-downloads and allow-popups intentionally.
                     */
                    sandbox="allow-scripts allow-same-origin"
                />
                {/* Transparent overlay — blocks right-click. Note: events INSIDE
                    an iframe are sandboxed so we cannot perfectly block them,
                    but this overlay stops right-click on the page frame around it,
                    and "#toolbar=0" removes the download button from the PDF UI. */}
                <div
                    className="absolute top-0 left-0 right-0 h-4 z-10"
                    onContextMenu={noCtx}
                    style={{ pointerEvents: 'auto' }}
                />
            </div>

            {/* Watermark bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-900/80">
                <span className="text-[10px] text-zinc-700 select-none">🔒 Lumina · InCo. · Protected Document</span>
                <span className="text-[10px] text-zinc-700 select-none">© 2026 Lumina LMS</span>
            </div>
        </div>
    );
}
