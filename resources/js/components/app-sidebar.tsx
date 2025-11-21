import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";

// Icons
import {
    Home,
    Map,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export function AppSidebar() {
    const { url } = usePage();
    const [collapsed, setCollapsed] = useState(false);

    // Navigation items — Itinerary REMOVED
    const nav = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Trips", href: "/trips", icon: Map },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const logout = () => router.post("/logout");

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 flex flex-col transition-all duration-300 shadow-xl",
                "border-r border-slate-700/40",
                collapsed ? "w-16" : "w-60"
            )}
            style={{
                background:
                    "linear-gradient(180deg, rgba(37,65,180,1) 0%, rgba(31,41,55,1) 60%, rgba(17,24,39,1) 100%)",
            }}
        >
            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center h-12 hover:bg-white/10 transition-colors border-b border-slate-700/40"
            >
                {collapsed ? (
                    <ChevronRight className="text-white" />
                ) : (
                    <ChevronLeft className="text-white" />
                )}
            </button>

            {/* MAIN NAV LINKS */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
                {nav.map((item) => {
                    const active = url.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg group transition-all relative overflow-hidden",

                                // Glowing hover border
                                "hover:border-sky-400 hover:border shadow-sky-500/20 hover:shadow-lg",

                                // Active styling
                                active && "bg-white/20 border border-sky-400"
                            )}
                        >
                            {/* Icon */}
                            <item.icon className="w-5 h-5 text-white group-hover:text-sky-300 transition-all" />

                            {/* Text (hidden in collapse) */}
                            {!collapsed && (
                                <span className="text-white text-sm font-medium group-hover:text-sky-200 transition-all">
                                    {item.name}
                                </span>
                            )}

                            {/* Active glow line */}
                            {active && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-sky-400 animate-pulse"></span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* LOGOUT BUTTON — pinned at bottom */}
            <div className="p-3 border-t border-slate-700/40 mt-auto">
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg group transition-all relative overflow-hidden",
                        "hover:border-red-400 hover:border shadow-red-500/20 hover:shadow-lg"
                    )}
                >
                    <LogOut className="w-5 h-5 text-red-300 group-hover:text-red-400" />
                    {!collapsed && (
                        <span className="text-red-200 text-sm font-medium group-hover:text-red-400 transition-all">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
