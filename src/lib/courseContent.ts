// ───────────────────────────────────────────────────────────────
// Full course content — Sri Lanka A/L Edition — Lumina by InCo.
// Structured from actual video playlists.
//
// HOW TO ADD YOUR YOUTUBE IDs:
//   1. Open each playlist in YouTube Studio
//   2. Click on a video
//   3. Copy the 11-character ID from the URL:
//      https://youtube.com/watch?v=XXXXXXXXXXX
//                                 ^^^^^^^^^^^ this is the ID
//   4. Replace 'REPLACE_ME' with your ID on the matching lesson below
// ───────────────────────────────────────────────────────────────

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'slides' | 'notes' | 'quiz';
    duration: string;
    completed: boolean;
    description?: string;
    /** YouTube 11-char video ID  — replace 'REPLACE_ME' with your real ID */
    youtubeId?: string;
    /** Relative or absolute URL to a PDF.  Place files in /public/pdfs/ */
    pdfUrl?: string;
}

export interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface CourseContent {
    id: string;
    chapters: Chapter[];
}

export const courseContents: CourseContent[] = [

    /* ══════════════════════════════════════════════════════════
       ECONOMICS
       Playlists:
         • ECON - FINAL SEMINAR SERIES - 2025  (5 videos)
         • ECON - SPECIAL SEMINAR SERIES - 2025 (1 video)
    ══════════════════════════════════════════════════════════ */
    {
        id: 'economics',
        chapters: [
            {
                id: 'econ-final-seminar',
                title: 'Final Seminar Series 2025',
                lessons: [
                    {
                        id: 'econ-fs-1',
                        title: 'Final Seminar — Session 1',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Final Seminar Series 2025 · Part 1',
                        youtubeId: 'REPLACE_ME', // ← paste your Economics YouTube video ID here
                    },
                    {
                        id: 'econ-fs-2',
                        title: 'Final Seminar — Session 2',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Final Seminar Series 2025 · Part 2',
                        youtubeId: 'REPLACE_ME',
                    },
                    {
                        id: 'econ-fs-3',
                        title: 'Final Seminar — Session 3',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Final Seminar Series 2025 · Part 3',
                        youtubeId: 'REPLACE_ME',
                    },
                    {
                        id: 'econ-fs-4',
                        title: 'Final Seminar — Session 4',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Final Seminar Series 2025 · Part 4',
                        youtubeId: 'REPLACE_ME',
                    },
                    {
                        id: 'econ-fs-5',
                        title: 'Final Seminar — Session 5',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Final Seminar Series 2025 · Part 5',
                        youtubeId: 'REPLACE_ME',
                    },
                ],
            },
            {
                id: 'econ-special-seminar',
                title: 'Special Seminar Series 2025',
                lessons: [
                    {
                        id: 'econ-ss-1',
                        title: 'Special Seminar — Session 1',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'ECON Special Seminar Series 2025',
                        youtubeId: 'REPLACE_ME',
                    },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════════
       ACCOUNTING
       Playlists:
         • AAT - QUESTIONS                         (1 video)
         • ACCT - 2012 TO 2024 PAST PAPER DISCUSSION (14 videos)
         • ACCT - FINAL 50 DAY MCQ MARATHON 2025   (11 videos)
         • ACCT - LIMITED COMPANY SEMINAR 2025      (4 videos)
    ══════════════════════════════════════════════════════════ */
    {
        id: 'accounting',
        chapters: [
            {
                id: 'acct-aat',
                title: 'AAT — Questions',
                lessons: [
                    {
                        id: 'acct-aat-1',
                        title: 'AAT Questions — Session 1',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'AAT Questions walkthrough session',
                        youtubeId: 'REPLACE_ME',
                    },
                ],
            },
            {
                id: 'acct-past-papers',
                title: 'Past Paper Discussion 2012 – 2024',
                lessons: [
                    { id: 'acct-pp-2024', title: 'Past Paper Discussion — 2024', type: 'video', duration: '2 hr 37 min', completed: false, description: 'Full walkthrough of the 2024 A/L Accounting Paper 2 — all questions solved and explained.', youtubeId: 'fNY4Nr7jJb0' },
                    { id: 'acct-pp-2023', title: 'Past Paper Discussion — 2023', type: 'video', duration: '3 hr 57 min', completed: false, description: 'Complete solution video for the 2023 A/L Accounting Paper 2.', youtubeId: 'dpTqClNzreI' },
                    { id: 'acct-pp-2022', title: 'Past Paper Discussion — 2022', type: 'video', duration: '2 hr 54 min', completed: false, description: 'Detailed breakdown of every question in the 2022 A/L Accounting Paper 2.', youtubeId: 'HMU1Cuv9GHE' },
                    { id: 'acct-pp-2021', title: 'Past Paper Discussion — 2021', type: 'video', duration: '2 hr 57 min', completed: false, description: 'Step-by-step solution to the 2021 A/L Accounting Paper 2 exam.', youtubeId: '9d38W4QLIM0' },
                    { id: 'acct-pp-2020', title: 'Past Paper Discussion — 2020', type: 'video', duration: '3 hr 46 min', completed: false, description: 'Full discussion and answers for the 2020 A/L Accounting Paper 2.', youtubeId: 'ChMMdYqnaZM' },
                    { id: 'acct-pp-2019', title: 'Past Paper Discussion — 2019', type: 'video', duration: '2 hr 44 min', completed: false, description: 'Comprehensive solution video covering all sections of the 2019 A/L Accounting Paper 2.', youtubeId: 'b3BGErNaYJc' },
                    { id: 'acct-pp-2018', title: 'Past Paper Discussion — 2018', type: 'video', duration: '3 hr 30 min', completed: false, description: 'In-depth solution for the 2018 A/L Accounting Paper 2.', youtubeId: 'PWRSMxzLt_8' },
                    { id: 'acct-pp-2017-2018', title: 'Past Paper Discussion — 2017 & 2018 (Combined)', type: 'video', duration: '3 hr 7 min', completed: false, description: 'Combined walkthrough of the 2017 and 2018 A/L Accounting Paper 2 past papers.', youtubeId: 'F06UhZpTx0k' },
                    { id: 'acct-pp-2017', title: 'Past Paper Discussion — 2017', type: 'video', duration: '1 hr 17 min', completed: false, description: 'Focused session on the 2017 A/L Accounting Paper 2 key questions.', youtubeId: 'qa2IFZQaWSY' },
                    { id: 'acct-pp-2016', title: 'Past Paper Discussion — 2016', type: 'video', duration: '3 hr 12 min', completed: false, description: 'Full solutions and explanations for the 2016 A/L Accounting Paper 2.', youtubeId: 'rxzXHGs29Vg' },
                    { id: 'acct-pp-2015', title: 'Past Paper Discussion — 2015', type: 'video', duration: '3 hr 38 min', completed: false, description: 'Complete discussion of the 2015 A/L Accounting Paper 2 exam.', youtubeId: 'BdXRAR-4P-0' },
                    { id: 'acct-pp-2014', title: 'Past Paper Discussion — 2014', type: 'video', duration: '3 hr 44 min', completed: false, description: 'Detailed worked solutions for the 2014 A/L Accounting Paper 2.', youtubeId: 'kt4hAeAmQXM' },
                    { id: 'acct-pp-2013', title: 'Past Paper Discussion — 2013', type: 'video', duration: '4 hr 7 min', completed: false, description: 'Thorough breakdown of all questions in the 2013 A/L Accounting Paper 2.', youtubeId: 'uizYak4EJ6I' },
                    { id: 'acct-pp-2012', title: 'Past Paper Discussion — 2012', type: 'video', duration: '4 hr 4 min', completed: false, description: 'Complete solution video for the 2012 A/L Accounting Paper 2 — the earliest in the series.', youtubeId: 'hAbnDr1IR3M' },
                ],
            },
            {
                id: 'acct-mcq-marathon',
                title: 'Final 50-Day MCQ Marathon 2025',
                lessons: [
                    { id: 'acct-mcq-1', title: 'MCQ Marathon — Day 1–5', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 1', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-2', title: 'MCQ Marathon — Day 6–10', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 2', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-3', title: 'MCQ Marathon — Day 11–15', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 3', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-4', title: 'MCQ Marathon — Day 16–20', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 4', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-5', title: 'MCQ Marathon — Day 21–25', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 5', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-6', title: 'MCQ Marathon — Day 26–30', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 6', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-7', title: 'MCQ Marathon — Day 31–35', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 7', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-8', title: 'MCQ Marathon — Day 36–40', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 8', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-9', title: 'MCQ Marathon — Day 41–45', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 9', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-10', title: 'MCQ Marathon — Day 46–50', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Session 10', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-mcq-11', title: 'MCQ Marathon — Final Review', type: 'video', duration: 'Video', completed: false, description: 'Final 50-Day MCQ Marathon · Final Session', youtubeId: 'REPLACE_ME' },
                ],
            },
            {
                id: 'acct-limited-company',
                title: 'Limited Company Seminar 2025',
                lessons: [
                    { id: 'acct-lc-1', title: 'Limited Company — Session 1', type: 'video', duration: 'Video', completed: false, description: 'Limited Company Seminar 2025 · Part 1', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-lc-2', title: 'Limited Company — Session 2', type: 'video', duration: 'Video', completed: false, description: 'Limited Company Seminar 2025 · Part 2', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-lc-3', title: 'Limited Company — Session 3', type: 'video', duration: 'Video', completed: false, description: 'Limited Company Seminar 2025 · Part 3', youtubeId: 'REPLACE_ME' },
                    { id: 'acct-lc-4', title: 'Limited Company — Session 4', type: 'video', duration: 'Video', completed: false, description: 'Limited Company Seminar 2025 · Part 4', youtubeId: 'REPLACE_ME' },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════════
       BUSINESS STUDIES
       Playlists:
         • BST - BOOTCAMP RECORDINGS (6 videos)
    ══════════════════════════════════════════════════════════ */
    {
        id: 'bst',
        chapters: [
            {
                id: 'bst-bootcamp',
                title: 'Bootcamp Recordings',
                lessons: [
                    { id: 'bst-bc-1', title: 'Bootcamp — Session 1', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 1', youtubeId: 'REPLACE_ME' },
                    { id: 'bst-bc-2', title: 'Bootcamp — Session 2', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 2', youtubeId: 'REPLACE_ME' },
                    { id: 'bst-bc-3', title: 'Bootcamp — Session 3', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 3', youtubeId: 'REPLACE_ME' },
                    { id: 'bst-bc-4', title: 'Bootcamp — Session 4', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 4', youtubeId: 'REPLACE_ME' },
                    { id: 'bst-bc-5', title: 'Bootcamp — Session 5', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 5', youtubeId: 'REPLACE_ME' },
                    { id: 'bst-bc-6', title: 'Bootcamp — Session 6', type: 'video', duration: 'Video', completed: false, description: 'BST Bootcamp Recordings · Session 6', youtubeId: 'REPLACE_ME' },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════════
       ICT
       No playlists provided yet — placeholder structure.
       Add your ICT YouTube video IDs the same way when ready.
    ══════════════════════════════════════════════════════════ */
    {
        id: 'ict',
        chapters: [
            {
                id: 'ict-placeholder',
                title: 'ICT Lectures',
                lessons: [
                    {
                        id: 'ict-1',
                        title: 'ICT — Session 1',
                        type: 'video',
                        duration: 'Video',
                        completed: false,
                        description: 'Add your ICT video IDs to courseContent.ts',
                        youtubeId: 'REPLACE_ME',
                    },
                ],
            },
        ],
    },
];

export function getCourseContent(id: string): CourseContent | undefined {
    return courseContents.find(c => c.id === id);
}
