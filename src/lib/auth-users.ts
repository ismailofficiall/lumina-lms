/**
 * ─────────────────────────────────────────────────────────────────
 * LUMINA LMS — Authorised Student List
 * ─────────────────────────────────────────────────────────────────
 *
 * Add or remove students here.  Each entry needs:
 *   name     → displayed in the dashboard
 *   email    → what the student types to log in
 *   password → what the student types to log in
 *
 * After editing, restart the dev server (Ctrl+C then npm run dev).
 *
 * ⚠️  For production: move passwords to environment variables and
 *     store hashed values.  This simple list is fine for private
 *     use with a small number of trusted students.
 * ─────────────────────────────────────────────────────────────────
 */

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    password: string; // plain-text — fine for private internal use
    year: string;
    avatar: string;
}

export const ALLOWED_STUDENTS: AuthUser[] = [
    {
        id: 'Ismail Ibrahim',
        name: 'Ismail Ibrahim',
        email: 'ismail@lumina.lk',
        password: 'admin@2507',
        year: 'Admin',
        avatar: 'II',
    },
    {
        id: 'Nadha Naleem',
        name: 'Nadha Naleem',
        email: 'nadha@lumina.lk',
        password: 'admini@2507',
        year: 'Admin',
        avatar: 'NN',
    },
    {
        id: 'Zeefa Haq',
        name: 'Zeefa Haq',
        email: 'zeefa@lumina.lk',
        password: 'zeefa@234',
        year: 'Admin',
        avatar: 'ZH',
    },
    {
        id: 'Amna Inthikab',
        name: 'Amna Inthikab',
        email: 'amna@lumina.lk',
        password: 'amna_342',
        year: 'Year 13 · Sri Lanka A/L',
        avatar: 'AI',
    },
    {
        id: 'Hamna Inaam',
        name: 'Hamna Inaam',
        email: 'hamna@lumina.lk',
        password: 'hamna.564',
        year: 'Year 13 · Sri Lanka A/L',
        avatar: 'HI',
    },
];

/** Returns the matching student or null */
export function findStudent(email: string, password: string): AuthUser | null {
    const lower = email.toLowerCase().trim();
    return (
        ALLOWED_STUDENTS.find(
            s => s.email.toLowerCase() === lower && s.password === password
        ) ?? null
    );
}
