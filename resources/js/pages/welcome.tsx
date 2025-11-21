import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';

const destinations = ['India', 'United States', 'France', 'Germany'];

const featuredPackages = [
    {
        id: 1,
        title: 'Dubai Dreamscape',
        destination: 'Dubai, United Arab Emirates',
        description:
            'Skyscraper views, golden deserts, luxury malls — step into a futuristic paradise.',
        priceLabel: '$1,800.00',
        budget: 1800,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 2,
        title: 'Bali Bliss Retreat',
        destination: 'Bali, Indonesia',
        description:
            'Soothing temples, rice terraces, beaches — the island where peace meets paradise.',
        priceLabel: '$3,000.00',
        budget: 3000,
        rating: 5,
        image: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 3,
        title: 'Mauritius Marvel',
        destination: 'Mauritius',
        description:
            'Turquoise lagoons, coral reefs, and romantic sunsets — a picture-perfect escape.',
        priceLabel: '$2,500.00',
        budget: 2500,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 4,
        title: 'USA Explorer',
        destination: 'United States',
        description: 'Skylines, road trips, canyon trails — design your American adventure.',
        priceLabel: '$2,200.00',
        budget: 2200,
        rating: 4.3,
        image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 5,
        title: 'Miami Sun & Sea Escape',
        destination: 'Miami, United States',
        description: 'Art Deco, beaches, nightlife — Miami always brings the heat.',
        priceLabel: '$1,450.00',
        budget: 1450,
        rating: 4.4,
        image: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 6,
        title: 'Agra Heritage Journey',
        destination: 'Agra, India',
        description: 'Witness the Taj Mahal glow at sunrise — history and beauty in one place.',
        priceLabel: '$1,100.00',
        budget: 1100,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const goToCreateTrip = () => {
        router.get('/trips/create');
    };

    const bookPackage = (pkg: (typeof featuredPackages)[number]) => {
        router.get('/trips/create', {
            title: pkg.title,
            destination: pkg.destination,
            budget: pkg.budget,
        });
    };

    return (
        <>
            <Head title="Voyage Mate">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="scroll-smooth min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-900">
                {/* ------------------------------------------------ */}
                {/* NAVBAR */}
                {/* ------------------------------------------------ */}
                <header className="relative z-20 border-b border-white/30 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-extrabold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                                Voyage Mate
                            </span>
                            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                Travel. Explore. Smile.
                            </span>
                        </div>

                        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
                            <a href="#home" className="transition hover:text-sky-600">Home</a>
                            <button
                                onClick={goToCreateTrip}
                                className="transition hover:text-sky-600"
                            >
                                Book
                            </button>
                            <a href="#packages" className="transition hover:text-sky-600">Packages</a>
                            <a href="#services" className="transition hover:text-sky-600">Services</a>
                            <a href="#gallery" className="transition hover:text-sky-600">Gallery</a>
                            <a href="#about" className="transition hover:text-sky-600">About</a>
                            <a href="#contact" className="transition hover:text-sky-600">Contact</a>
                        </nav>

                        <div className="flex items-center gap-3 text-sm">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-full border border-sky-200 px-4 py-1.5 font-semibold text-sky-700 transition hover:bg-sky-50"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full px-4 py-1.5 font-semibold text-slate-600 transition hover:text-sky-600"
                                    >
                                        Sign In
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full bg-sky-600 px-5 py-1.5 font-semibold text-white shadow-sm transition hover:bg-sky-500"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ------------------------------------------------ */}
                {/* HERO SECTION */}
                {/* ------------------------------------------------ */}
                <main id="home">
                    <section className="relative overflow-hidden bg-slate-900 text-white">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.pexels.com/photos/4057660/pexels-photo-4057660.jpeg?auto=compress&cs=tinysrgb&w=1920"
                                alt="Ocean"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-sky-900/40" />
                        </div>

                        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl space-y-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.5em] text-sky-200">
                                    ✨ Your Journey Starts Here
                                </p>

                                <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-sky-300 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                                    Explore the world with ease & joy
                                </h1>

                                <p className="text-base text-slate-200 leading-relaxed">
                                    Plan colorful trips, manage itineraries, track budgets, and discover curated destinations —
                                    all in one magical travel companion.
                                </p>

                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-sky-500 to-blue-500 px-8 text-white shadow-lg hover:opacity-90"
                                    onClick={goToCreateTrip}
                                >
                                    🌍 Start a New Trip
                                </Button>
                            </div>

                            <div className="hidden w-80 md:block">
                                <div className="space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
                                    <div className="text-xs uppercase tracking-[0.3em] text-slate-200">
                                        Popular Destinations
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        {['Maldives', 'Mauritius', 'Bora Bora', 'Santorini'].map((place) => (
                                            <li
                                                key={place}
                                                className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-2 text-white"
                                            >
                                                {place}
                                                <span className="text-sky-200">⭐ Hot Pick</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* FEATURED PACKAGES */}
                    {/* ------------------------------------------------ */}
                    <section id="packages" className="mx-auto max-w-6xl px-6 py-16">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                                🌟 Handpicked Packages
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Beautifully curated destinations chosen to create unforgettable moments.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    </div>

                                    <div className="flex flex-1 flex-col gap-3 p-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900">{pkg.title}</h3>
                                            <p className="mt-1 text-xs font-medium text-slate-500">{pkg.destination}</p>
                                            <p className="mt-2 text-sm text-slate-600">{pkg.description}</p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between text-sm font-semibold text-slate-900">
                                            <span>{pkg.priceLabel}</span>
                                            <span className="flex items-center gap-1 text-amber-500">
                                                {'★'.repeat(Math.floor(pkg.rating))}
                                                <span className="text-slate-500">({pkg.rating.toFixed(1)})</span>
                                            </span>
                                        </div>

                                        <Button
                                            className="mt-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:opacity-90"
                                            onClick={() => bookPackage(pkg)}
                                        >
                                            ✈️ Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* SERVICES SECTION */}
                    {/* ------------------------------------------------ */}
                    <section id="services" className="py-16 bg-gradient-to-b from-indigo-50 to-purple-50">
                        <div className="mx-auto max-w-5xl text-center space-y-3">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-sky-600 bg-clip-text text-transparent">
                                🛠️ Our Services
                            </h2>
                            <p className="text-sm text-slate-600">
                                Everything you need for a smooth, joyful, and well-planned journey.
                            </p>
                        </div>

                        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-6 shadow hover:shadow-md">
                                <h3 className="font-semibold text-slate-800">📅 Smart Trip Planning</h3>
                                <p className="text-sm mt-2 text-slate-600">
                                    Create organized trips with dates, budgets, and destination details.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow hover:shadow-md">
                                <h3 className="font-semibold text-slate-800">🧭 Guided Itinerary Tools</h3>
                                <p className="text-sm mt-2 text-slate-600">
                                    Build day-by-day plans with timings, places, and personal notes.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow hover:shadow-md">
                                <h3 className="font-semibold text-slate-800">💸 Budget Tracking</h3>
                                <p className="text-sm mt-2 text-slate-600">
                                    Keep an eye on expenses and stay on track with your trip budget.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* GALLERY SECTION */}
                    {/* ------------------------------------------------ */}
                    <section id="gallery" className="py-16">
                        <div className="mx-auto max-w-5xl text-center space-y-3">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                                📸 Travel Moments
                            </h2>
                            <p className="text-sm text-slate-600">
                                A small taste of the beautiful experiences waiting for you.
                            </p>
                        </div>

                        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
                            {[
                                'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
                                'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg',
                                'https://images.pexels.com/photos/21014/pexels-photo.jpg',
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={`${src}?auto=compress&cs=tinysrgb&w=800`}
                                    className="h-56 w-full rounded-xl object-cover shadow"
                                />
                            ))}
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* ABOUT SECTION */}
                    {/* ------------------------------------------------ */}
                    <section id="about" className="py-16 bg-gradient-to-b from-purple-50 to-pink-50">
                        <div className="mx-auto max-w-4xl text-center space-y-4">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                💖 About Voyage Mate
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Voyage Mate was created to make travel simple, joyful, and beautifully organized.
                                We believe every journey tells a story — and our goal is to help you write yours with ease.
                            </p>
                            <p className="text-sm text-slate-600">
                                Whether you're dreaming of beaches, cities, mountains, or romantic escapes —
                                Voyage Mate keeps all your travel details in one colorful, friendly, intuitive space.
                            </p>
                        </div>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* CONTACT SECTION */}
                    {/* ------------------------------------------------ */}
                    <section id="contact" className="py-16">
                        <div className="mx-auto max-w-4xl text-center space-y-4">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                                📞 Get in Touch
                            </h2>
                            <p className="text-sm text-slate-600">
                                Have questions? Ideas? Feedback?  
                                We're always here to make your travel experience better.
                            </p>

                            <div className="mt-4">
                                <a
                                    href="mailto:hello@voyagemate.app"
                                    className="text-sky-600 underline font-medium"
                                >
                                    hello@voyagemate.app
                                </a>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </>
    );
}
