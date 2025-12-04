import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Calendar, Map, PlaneTakeoff, Star, Compass, Clock } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
];

// Demo trips for "Popular Trip Ideas"
const demoTrips = [
    {
        id: 1,
        title: "Dubai Dreamscape",
        location: "Dubai, United Arab Emirates",
        price: "$1,800.00",
        budget: 1800,
        rating: 4.5,
        image:
            "https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
        id: 2,
        title: "Bali Bliss Retreat",
        location: "Bali, Indonesia",
        price: "$3,000.00",
        budget: 3000,
        rating: 5,
        image:
            "https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
        id: 3,
        title: "Mauritius Marvel",
        location: "Mauritius",
        price: "$2,500.00",
        budget: 2500,
        rating: 4.5,
        image:
            "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
];

type TodayItineraryItem = {
    id: number;
    trip_title: string;
    destination: string | null;
    date: string;
    time: string | null;
    title: string;
    location: string | null;
    notes: string | null;
};

// Type of the extra data we expect from Laravel
type DashboardStats = {
    activeTrips: number;
    totalTrips: number;
    upcomingTrip: {
        title: string;
        destination: string;
        start_date: string;
        days_until: number;
    } | null;
    usedBudgetPercent: number;
    favoritesCount: number;
    upcomingThisMonthCount: number;
    todayItineraryItems?: TodayItineraryItem[];
};

type PageProps = {
    dashboardStats: DashboardStats;
};

// Normalize and format time safely → ALWAYS return something
const formatTime = (time: string | null): string => {
    if (!time) return "--:--";

    // Common case: "HH:MM:SS" or "HH:MM"
    if (time.length >= 5) {
        return time.slice(0, 5);
    }

    // Fallback: try to normalize "H:M" → "HH:MM"
    const parts = time.split(":");
    if (parts.length >= 2) {
        const hh = parts[0].padStart(2, "0");
        const mm = parts[1].padStart(2, "0");
        return `${hh}:${mm}`;
    }

    return "--:--";
};

// Different small “vibe” lines for each itinerary item
const itineraryMessages = [
    "Squeeze in a little joy between stops today.",
    "Don’t forget to snap a picture for future you.",
    "Hydrate, breathe, and enjoy the moment.",
    "Perfect time to slow down and soak in the view.",
    "Tiny moments like this make the whole trip special.",
];

// Different mood options for Trip Overview
const moodOptions = [
    {
        title: "Adventurous & Ready",
        main: "You’re in a great place to explore new cities, new routes, and new memories.",
        tip: "Use your Trips page to line up those next bold moves — even a small weekend trip counts.",
    },
    {
        title: "Calm & Collected",
        main: "Your plans are under control — smooth schedules, balanced budgets, and chill vibes.",
        tip: "A quick review of dates and checklists keeps everything exactly where you want it.",
    },
    {
        title: "Dreamy & Planning Ahead",
        main: "You’ve planted the seeds for amazing trips — some still in your head, some already on the map.",
        tip: "Add a new trip idea today so you don’t forget that ‘one day I’ll go there’ destination.",
    },
    {
        title: "Busy Explorer Mode",
        main: "Your travel calendar looks exciting — lots of moving pieces, lots of stories loading.",
        tip: "Keep an eye on your budgets and to-dos so you can enjoy every moment without stress.",
    },
];

export default function Dashboard() {
    const { dashboardStats } = usePage<PageProps>().props;
    const {
        activeTrips,
        totalTrips,
        upcomingTrip,
        usedBudgetPercent,
        favoritesCount,
        upcomingThisMonthCount,
        todayItineraryItems = [],
    } = dashboardStats;

    // Deterministic “random” mood (no hooks, no imports needed)
    const moodIndexBase =
        activeTrips + totalTrips + upcomingThisMonthCount + usedBudgetPercent;
    const mood = moodOptions[moodIndexBase % moodOptions.length];

    // When user clicks a demo card's "Book Now" → go to destination search
    const bookTrip = (trip: (typeof demoTrips)[number]) => {
        router.get("/destinations");
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-8">
                    {/* ------------------------------------------------ */}
                    {/* HERO SECTION */}
                    {/* ------------------------------------------------ */}
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 p-7 text-white shadow-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.3),_transparent_55%)] opacity-90" />

                        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl space-y-3">
                                <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-100/90">
                                    🌍 <span>Greetings from</span>
                                </p>

                                <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight drop-shadow md:text-4xl">
                                    Voyage Mate Dashboard
                                </h1>

                                <p className="max-w-lg text-sm text-sky-50/90 md:text-base">
                                    Plan vibrant journeys with organized itineraries, smart budgets,
                                    and unforgettable destinations — all in one place.
                                </p>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <Button
                                        size="lg"
                                        className="bg-white px-6 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50"
                                        onClick={() => router.get("/trips/create")}
                                    >
                                        <PlaneTakeoff className="mr-2 h-4 w-4" />
                                        Create New Trip
                                    </Button>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-sky-100/70 bg-white/10 text-sm font-medium text-sky-50 hover:bg-white/20"
                                        onClick={() => router.get("/trips")}
                                    >
                                        <Map className="mr-2 h-4 w-4" />
                                        View All Trips
                                    </Button>
                                </div>
                            </div>

                            {/* Stats block */}
                            <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-xs backdrop-blur">
                                {/* Active Trips */}
                                <div className="overflow-hidden rounded-xl bg-white/95 text-slate-900 shadow">
                                    <div className="flex items-center gap-1 border-b border-sky-200 bg-sky-100 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-sky-800">
                                        <Compass className="h-3 w-3" />
                                        <span>Active Trips</span>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {activeTrips}
                                        </p>
                                        <p className="mt-1 text-[0.7rem] text-slate-500">
                                            Trips you&apos;ve created
                                        </p>
                                    </div>
                                </div>

                                {/* Upcoming Trip */}
                                <div className="overflow-hidden rounded-xl bg-white/95 text-slate-900 shadow">
                                    <div className="flex items-center gap-1 border-b border-indigo-200 bg-indigo-100 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-indigo-800">
                                        <Calendar className="h-3 w-3" />
                                        <span>Upcoming Trip</span>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {upcomingTrip
                                                ? upcomingTrip.destination ?? upcomingTrip.title
                                                : "No upcoming trip"}
                                        </p>
                                        <p className="mt-1 text-[0.7rem] text-slate-500">
                                            {upcomingTrip
                                                ? `${upcomingTrip.days_until} days to departure`
                                                : "Plan your next getaway"}
                                        </p>
                                    </div>
                                </div>

                                {/* Budget Used */}
                                <div className="overflow-hidden rounded-xl bg-white/95 text-slate-900 shadow">
                                    <div className="flex items-center gap-1 border-b border-purple-200 bg-purple-100 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-purple-800">
                                        <Star className="h-3 w-3" />
                                        <span>Budget Used</span>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {usedBudgetPercent}
                                            <span className="text-base align-top">%</span>
                                        </p>
                                        <p className="mt-1 text-[0.7rem] text-slate-500">
                                            Based on all trips &amp; expenses
                                        </p>
                                    </div>
                                </div>

                                {/* Favorites */}
                                <div className="overflow-hidden rounded-xl bg-white/95 text-slate-900 shadow">
                                    <div className="flex items-center gap-1 border-b border-emerald-200 bg-emerald-100 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-emerald-800">
                                        <span>❤️ Favorites</span>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {favoritesCount}
                                        </p>
                                        <p className="mt-1 text-[0.7rem] text-slate-500">
                                            Saved destinations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* POPULAR TRIP IDEAS */}
                    {/* ------------------------------------------------ */}
                    <section className="mt-2 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h2 className="flex items-center gap-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                                    ✨ Popular Trip Ideas
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Get inspired by these colorful getaways — turn them into your next
                                    plan.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                                Explore more
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {demoTrips.map((trip) => (
                                <Card
                                    key={trip.id}
                                    className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <img
                                            src={trip.image}
                                            alt={trip.title}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader className="space-y-1">
                                        <CardTitle className="flex items-center gap-1 text-base font-semibold">
                                            <span className="text-sky-600">🌴</span>
                                            <span>{trip.title}</span>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 text-xs text-slate-500">
                                            <Map className="h-3 w-3 text-sky-500" />
                                            <span>{trip.location}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-xs text-slate-700">
                                        <p>
                                            Discover vibrant cityscapes, unique culture, and
                                            unforgettable views tailored for explorers like you.
                                        </p>
                                        <div className="flex items-center justify-between text-[0.75rem]">
                                            <span className="font-semibold text-sky-600">
                                                {trip.price}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="text-amber-400">★★★★☆</span>
                                                <span className="text-slate-500">{trip.rating}</span>
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardContent className="pb-4">
                                        <Button
                                            className="w-full bg-sky-500 text-xs text-white hover:bg-sky-600"
                                            onClick={() => bookTrip(trip)}
                                        >
                                            <PlaneTakeoff className="mr-1 h-4 w-4" />
                                            Book Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* TODAY'S ITINERARY + TRIP OVERVIEW */}
                    {/* ------------------------------------------------ */}
                    <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        {/* LEFT: Today’s Itinerary Snapshot */}
                        <Card className="rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent">
                                    📅 Today&apos;s Itinerary Snapshot
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500">
                                    A quick look at what you have planned for today.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                {todayItineraryItems.length === 0 ? (
                                    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50 p-4 text-slate-700 shadow-sm">
                                        <p className="text-sm font-semibold">
                                            Nothing scheduled for today.
                                        </p>
                                        <p className="mt-1 text-[0.7rem] text-slate-500">
                                            Your day is wide open — add activities from any
                                            trip&apos;s itinerary to see them here.
                                        </p>
                                    </div>
                                ) : (
                                    todayItineraryItems.slice(0, 4).map((item, index) => {
                                        const message =
                                            itineraryMessages[
                                                index % itineraryMessages.length
                                            ];

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 text-slate-800 shadow-md"
                                            >
                                                <div className="flex-1 pr-3">
                                                    <p className="flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wide text-sky-700">
                                                        📌 {item.trip_title}
                                                        {item.destination
                                                            ? ` • ${item.destination}`
                                                            : ""}
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {item.title}
                                                    </p>
                                                    {item.location && (
                                                        <p className="mt-1 flex items-center gap-1 text-[0.75rem] text-slate-600">
                                                            📍 {item.location}
                                                        </p>
                                                    )}
                                                    {item.notes && (
                                                        <p className="mt-1 text-[0.7rem] italic text-slate-500">
                                                            “{item.notes}”
                                                        </p>
                                                    )}
                                                    <p className="mt-2 text-[0.7rem] text-slate-500">
                                                        {message}
                                                    </p>
                                                </div>

                                                {/* Time badge — ALWAYS renders, with HH:MM or --:-- */}
                                                <span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-sky-200 bg-white px-4 py-1.5 text-[0.75rem] font-bold text-sky-700 shadow-sm">
                                                    <Clock className="h-3 w-3" />
                                                    {item.time && (
                                                        <p className="mt-1 flex items-center gap-1 text-[0.75rem] text-slate-600">
                                                             {item.time.slice(11, 16)}
                                                        </p>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* RIGHT: Trip Overview with mood */}
                        <Card className="rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-lg font-extrabold text-transparent">
                                    🗺️ Trip Overview
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500">
                                    At-a-glance summary of your current trip planning.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 text-slate-800 shadow-sm">
                                    <span className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-amber-700">
                                        ✈️ Total Trips
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {totalTrips}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-3 text-slate-800 shadow-sm">
                                    <span className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-rose-700">
                                        📆 Upcoming This Month
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {upcomingThisMonthCount}
                                    </span>
                                </div>

                                <div className="rounded-lg border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-3 text-slate-800 shadow-sm">
                                    <p className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-orange-700">
                                        🌈 Overall Mood:{" "}
                                        <span className="ml-1 text-[0.7rem] font-bold">
                                            {mood.title}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-sm text-slate-800">
                                        {mood.main}
                                    </p>
                                    <p className="mt-1 text-[0.7rem] text-slate-500">
                                        {mood.tip}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
