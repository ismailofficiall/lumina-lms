'use client';

import { ReactNode } from 'react';
import { Sidebar, MobileNav } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
    children: ReactNode;
    breadcrumbs?: string[];
}

export function DashboardLayout({ children, breadcrumbs }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950">
            {/* Desktop Sidebar — hidden on mobile via Sidebar component itself */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar breadcrumbs={breadcrumbs} />

                {/* Scrollable page content — extra bottom padding on mobile for the tab bar */}
                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav — only visible on small screens */}
            <MobileNav />
        </div>
    );
}
