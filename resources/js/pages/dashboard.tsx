import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const demoTrips = [
    {
        id: 1,
        title: 'Dubai Dreamscape',
        location: 'Dubai, United Arab Emirates',
        price: '$1,800.00',
        rating: 4.5,
        image: 'https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 2,
        title: 'Bali Bliss Retreat',
        location: 'Bali, Indonesia',
        price: '$3,000.00',
        rating: 5,
        image: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 3,
        title: 'Mauritius Marvel',
        location: 'Mauritius',
        price: '$2,500.00',
        rating: 4.5,
        image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 pb-8">
                {/* Hero section */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 p-6 text-white shadow-lg">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.7),_transparent_55%)] opacity-80" />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-xl space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-100/90">
                                Greetings from
                            </p>
                            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                                Voyage Mate Dashboard
                            </h1>
                            <p className="max-w-lg text-sm text-sky-50/90 md:text-base">
                                Plan vibrant journeys with colorful itineraries, smart budgets, and
                                unforgettable destinations – all in one place.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Button size="lg" className="bg-white px-6 text-sky-700 hover:bg-sky-50">
                                    Create New Trip
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-sky-100/70 bg-white/10 text-sky-50 hover:bg-white/15"
                                >
                                    View All Trips
                                </Button>
                            </div>
                        </div>

                        <div className="grid w-full max-w-xs grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-xs backdrop-blur md:max-w-sm">
                            <div className="rounded-xl bg-sky-500/90 p-3 shadow-sm">
                                <p className="text-[0.65rem] uppercase tracking-wide text-sky-100/90">
                                    Active Trips
                                </p>
                                <p className="mt-1 text-2xl font-bold">4</p>
                                <p className="mt-1 text-[0.7rem] text-sky-100/90">Currently planned</p>
                            </div>
                            <div className="rounded-xl bg-indigo-500/90 p-3 shadow-sm">
                                <p className="text-[0.65rem] uppercase tracking-wide text-indigo-100/90">
                                    Upcoming Destination
                                </p>
                                <p className="mt-1 text-sm font-semibold">Mauritius</p>
                                <p className="mt-1 text-[0.7rem] text-indigo-100/90">5 days to departure</p>
                            </div>
                            <div className="rounded-xl bg-purple-500/90 p-3 shadow-sm">
                                <p className="text-[0.65rem] uppercase tracking-wide text-purple-100/90">
                                    Budget Used
                                </p>
                                <p className="mt-1 text-2xl font-bold">62%</p>
                                <p className="mt-1 text-[0.7rem] text-purple-100/90">Across all trips</p>
                            </div>
                            <div className="rounded-xl bg-emerald-500/90 p-3 shadow-sm">
                                <p className="text-[0.65rem] uppercase tracking-wide text-emerald-100/90">
                                    Favorites
                                </p>
                                <p className="mt-1 text-2xl font-bold">9</p>
                                <p className="mt-1 text-[0.7rem] text-emerald-100/90">Saved destinations</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured trips section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Popular Trip Ideas</h2>
                            <p className="text-xs text-muted-foreground">
                                Get inspired by these colorful getaways – turn them into your next plan.
                            </p>
                        </div>
                        <Button variant="ghost" size="sm">
                            Explore more
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {demoTrips.map((trip) => (
                            <Card
                                key={trip.id}
                                className="overflow-hidden border-0 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50 shadow-md"
                            >
                                <div className="relative h-40 w-full overflow-hidden">
                                    <img
                                        src={trip.image}
                                        alt={trip.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-base font-semibold">{trip.title}</CardTitle>
                                    <CardDescription className="text-xs text-slate-300">
                                        {trip.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-xs text-slate-200">
                                    <p>
                                        Discover vibrant cityscapes, unique culture, and unforgettable views
                                        tailored for explorers like you.
                                    </p>
                                    <div className="flex items-center justify-between text-[0.7rem]">
                                        <span className="font-semibold text-sky-300">{trip.price}</span>
                                        <span className="inline-flex items-center gap-1">
                                            <span className="text-amber-400">★★★★☆</span>
                                            <span className="text-slate-300">{trip.rating}</span>
                                        </span>
                                    </div>
                                </CardContent>
                                <CardContent className="pb-4">
                                    <Link href="/destinations" className="inline-block">
                                        <Button className="w-full bg-sky-500 text-xs text-white hover:bg-sky-400">
                                            Book Now
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Itinerary summary section */}
                <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                    <Card className="border-0 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
                        <CardHeader>
                            <CardTitle className="text-sm">Today&apos;s Itinerary Snapshot</CardTitle>
                            <CardDescription className="text-xs">
                                A quick look at your planned activities for the day.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/50 dark:text-slate-50">
                                <div>
                                    <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
                                        Morning
                                    </p>
                                    <p className="text-sm font-medium">City tour &amp; local breakfast</p>
                                </div>
                                <span className="rounded-full bg-sky-100 px-3 py-1 text-[0.7rem] font-medium text-sky-700 dark:bg-sky-900/60 dark:text-sky-100">
                                    09:00 AM
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/50 dark:text-slate-50">
                                <div>
                                    <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                                        Afternoon
                                    </p>
                                    <p className="text-sm font-medium">Beach time &amp; water sports</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.7rem] font-medium text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-100">
                                    01:30 PM
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/50 dark:text-slate-50">
                                <div>
                                    <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                                        Evening
                                    </p>
                                    <p className="text-sm font-medium">Sunset cruise &amp; dinner</p>
                                </div>
                                <span className="rounded-full bg-purple-100 px-3 py-1 text-[0.7rem] font-medium text-purple-700 dark:bg-purple-900/60 dark:text-purple-100">
                                    06:45 PM
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
                        <CardHeader>
                            <CardTitle className="text-sm">Trip Overview</CardTitle>
                            <CardDescription className="text-xs">
                                At-a-glance summary of your current trip planning.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-slate-50">
                                <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                                    Total Trips
                                </span>
                                <span className="text-sm font-bold">12</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-slate-50">
                                <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                                    Upcoming This Month
                                </span>
                                <span className="text-sm font-bold">3</span>
                            </div>
                            <div className="rounded-lg bg-white/60 p-3 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-slate-50">
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
                                    Overall Mood
                                </p>
                                <p className="mt-1 text-sm">
                                    You&apos;re all set for a vibrant travel season. Keep building your
                                    itineraries to make every journey unforgettable.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
