import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './SessionProvider';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Lumina — The Academic Excellence Platform',
    description:
        'A premium Learning Management System for Economics, Accounting, Business Studies, and ICT students. Study smarter, achieve more.',
    keywords: ['LMS', 'Education', 'Economics', 'Accounting', 'Business Studies', 'ICT', 'A-Level'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}
            >
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
