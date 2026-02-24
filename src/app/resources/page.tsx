'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    FileText, Video, BookOpen, Download, Search,
    ExternalLink, Clock, Tag,
} from 'lucide-react';

const subjectColors: Record<string, string> = {
    Economics: '#818cf8',
    Accounting: '#34d399',
    'Business Studies': '#fbbf24',
    ICT: '#f472b6',
};

const subjectTagClass: Record<string, string> = {
    Economics: 'tag-economics',
    Accounting: 'tag-accounting',
    'Business Studies': 'tag-bst',
    ICT: 'tag-ict',
};

type ResourceType = 'Slides' | 'Video' | 'Notes' | 'Textbook' | 'Past Paper';

interface Resource {
    id: string;
    title: string;
    subject: string;
    type: ResourceType;
    size?: string;
    duration?: string;
    uploadedAt: string;
    description: string;
}

const resources: Resource[] = [
    {
        id: '1',
        title: 'Price Elasticity of Demand — Complete Notes',
        subject: 'Economics',
        type: 'Notes',
        size: '2.4 MB',
        uploadedAt: 'Feb 22, 2026',
        description: 'Comprehensive notes covering all PED concepts, formulas, and worked examples.',
    },
    {
        id: '2',
        title: 'Market Structures Lecture Slides (Ch. 7–8)',
        subject: 'Economics',
        type: 'Slides',
        size: '8.1 MB',
        uploadedAt: 'Feb 20, 2026',
        description: 'Full slide deck from Dr. Chen covering monopoly, oligopoly and perfect competition.',
    },
    {
        id: '3',
        title: 'Double Entry Bookkeeping — Video Tutorial',
        subject: 'Accounting',
        type: 'Video',
        duration: '38 min',
        uploadedAt: 'Feb 19, 2026',
        description: 'Step-by-step video from Prof. Alderton on ledger entries and trial balances.',
    },
    {
        id: '4',
        title: 'Partnership Accounts — Practice Questions',
        subject: 'Accounting',
        type: 'Past Paper',
        size: '1.2 MB',
        uploadedAt: 'Feb 17, 2026',
        description: '20 exam-style questions on partnership profit sharing and goodwill.',
    },
    {
        id: '5',
        title: 'SWOT & PESTLE Analysis Framework',
        subject: 'Business Studies',
        type: 'Slides',
        size: '5.6 MB',
        uploadedAt: 'Feb 15, 2026',
        description: 'Frameworks and worked business case examples from Ms. Sharma.',
    },
    {
        id: '6',
        title: 'Business Studies A-Level Textbook (PDF)',
        subject: 'Business Studies',
        type: 'Textbook',
        size: '42 MB',
        uploadedAt: 'Jan 5, 2026',
        description: 'Full Cambridge A-Level BST textbook for self-study reference.',
    },
    {
        id: '7',
        title: 'Network Topologies & Protocols — Lecture',
        subject: 'ICT',
        type: 'Video',
        duration: '42 min',
        uploadedAt: 'Feb 23, 2026',
        description: 'Recorded lecture by Mr. Okafor covering OSI model, TCP/IP, and LAN/WAN.',
    },
    {
        id: '8',
        title: 'Database Design — ER Diagrams & SQL Notes',
        subject: 'ICT',
        type: 'Notes',
        size: '3.8 MB',
        uploadedAt: 'Feb 18, 2026',
        description: 'Detailed notes on entity-relationship modelling and normalisation.',
    },
];

const typeIconMap: Record<ResourceType, React.ElementType> = {
    Slides: FileText,
    Video: Video,
    Notes: BookOpen,
    Textbook: BookOpen,
    'Past Paper': FileText,
};

const typeColors: Record<ResourceType, string> = {
    Slides: '#818cf8',
    Video: '#f472b6',
    Notes: '#34d399',
    Textbook: '#fbbf24',
    'Past Paper': '#f97316',
};

const subjectFilters = ['All', 'Economics', 'Accounting', 'Business Studies', 'ICT'];
const typeFilters: (ResourceType | 'All')[] = ['All', 'Slides', 'Video', 'Notes', 'Textbook', 'Past Paper'];

export default function ResourcesPage() {
    const [subjectFilter, setSubjectFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState<ResourceType | 'All'>('All');
    const [search, setSearch] = useState('');

    const filtered = resources.filter(r => {
        const matchSubject = subjectFilter === 'All' || r.subject === subjectFilter;
        const matchType = typeFilter === 'All' || r.type === typeFilter;
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.subject.toLowerCase().includes(search.toLowerCase());
        return matchSubject && matchType && matchSearch;
    });

    return (
        <DashboardLayout breadcrumbs={['Home', 'Resources']}>
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="font-serif text-3xl font-semibold text-zinc-100">
                        Study <span className="gold-text italic">Resources</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">{resources.length} files · Slides, videos, notes &amp; past papers</p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-wrap gap-3 items-center"
                >
                    {/* Subject */}
                    <div className="flex gap-2 flex-wrap">
                        {subjectFilters.map(s => (
                            <button
                                key={s}
                                onClick={() => setSubjectFilter(s)}
                                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${subjectFilter === s
                                    ? 'text-zinc-950'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                                    }`}
                                style={subjectFilter === s ? { background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' } : {}}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

                    {/* Type */}
                    <div className="flex gap-2 flex-wrap">
                        {typeFilters.map(t => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${typeFilter === t
                                    ? 'bg-zinc-700 text-zinc-200'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="ml-auto flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-600 transition-colors">
                        <Search size={14} className="text-zinc-600" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search resources..."
                            className="bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none w-36"
                        />
                    </div>
                </motion.div>

                {/* Resource Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map((r, i) => {
                            const Icon = typeIconMap[r.type];
                            const color = subjectColors[r.subject];
                            return (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    whileHover={{ y: -4 }}
                                    className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:border-zinc-700 transition-all"
                                    style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
                                >
                                    {/* Icon + type badge */}
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                                        >
                                            <Icon size={20} style={{ color }} />
                                        </div>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                            style={{ background: `${typeColors[r.type]}15`, color: typeColors[r.type] }}
                                        >
                                            {r.type}
                                        </span>
                                    </div>

                                    {/* Title + description */}
                                    <div>
                                        <h3 className="font-medium text-zinc-200 leading-snug group-hover:text-zinc-100 transition-colors">
                                            {r.title}
                                        </h3>
                                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed line-clamp-2">{r.description}</p>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-zinc-800">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${subjectTagClass[r.subject]}`}>
                                            {r.subject}
                                        </span>
                                        <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                                            <Clock size={10} /> {r.uploadedAt}
                                        </span>
                                        {r.size && <span className="text-[11px] text-zinc-600 ml-auto">{r.size}</span>}
                                        {r.duration && <span className="text-[11px] text-zinc-600 ml-auto">{r.duration}</span>}
                                    </div>

                                    {/* Actions - visible on hover */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-zinc-950 transition-all"
                                            style={{ background: 'linear-gradient(135deg, #d4a843, #e8d5a3)' }}
                                        >
                                            <ExternalLink size={12} /> Open
                                        </button>
                                        <button className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                                            <Download size={13} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <p className="text-5xl mb-4">📂</p>
                        <p className="text-zinc-400 font-medium">No resources found.</p>
                        <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters.</p>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
