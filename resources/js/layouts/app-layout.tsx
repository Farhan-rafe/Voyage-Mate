import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({ title, breadcrumbs, children }: any) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-hidden">

            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <main
                className={`
                    flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b 
                    from-white to-slate-50 p-6 text-slate-900 
                    transition-all duration-300
                    ${collapsed ? "ml-16" : "ml-60"}
                `}
            >
                {title && <Head title={title} />}
                {children}
            </main>
        </div>
    );
}
