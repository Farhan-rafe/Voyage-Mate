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
            'Discover the glamour of Dubai with skyscraper views, desert safaris, and luxurious experiences.',
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
            'Immerse yourself in tropical serenity, terraced rice fields, and Balinese cultural wonders.',
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
            'White-sand beaches, turquoise waters, and romantic sunsets for the ultimate island escape.',
        priceLabel: '$2,500.00',
        budget: 2500,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 4,
        title: 'USA Explorer',
        destination: 'United States',
        description: 'From New York skylines to canyon vistas, build the ultimate American road trip.',
        priceLabel: '$2,200.00',
        budget: 2200,
        rating: 4.3,
        image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 5,
        title: 'Miami Sun & Sea Escape',
        destination: 'Miami, United States',
        description: 'Vibrant nightlife, Art Deco charm, and beach days soaked in sunshine on Miami Beach.',
        priceLabel: '$1,450.00',
        budget: 1450,
        rating: 4.4,
        image: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 6,
        title: 'Agra Heritage Journey',
        destination: 'Agra, India',
        description: 'Witness the Taj Mahal at dawn and wander through centuries of Mughal architecture.',
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

    // Always go to /trips/create.
    // If user is a guest, auth middleware will:
    //  - redirect to login
    //  - then redirect back to /trips/create after login.
    const goToCreateTrip = () => {
        router.get('/trips/create');
    };

    // Go to /trips/create with prefilled data.
    // Same behavior: guests get sent to login first, then back with params.
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

            <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
                <header className="relative z-20 border-b border-white/30 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-extrabold text-sky-700">Voyage Mate</span>
                            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                Plan. Pack. Explore.
                            </span>
                        </div>

                        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
                            <Link href="/" className="transition hover:text-sky-600">
                                Home
                            </Link>

                            {/* Book → Create Trip (auth middleware will handle login redirect if guest) */}
                            <button
                                type="button"
                                onClick={goToCreateTrip}
                                className="transition hover:text-sky-600"
                            >
                                Book
                            </button>

                            <div className="group relative">
                                <button className="inline-flex items-center gap-1 transition hover:text-sky-600">
                                    Packages
                                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                                        <path
                                            d="M3 4.5L6 7.5L9 4.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                                <div className="invisible absolute left-1/2 top-8 w-40 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal text-slate-600 shadow-lg opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                                    <ul className="space-y-1">
                                        {destinations.map((item) => (
                                            <li key={item} className="rounded-md px-2 py-1 hover:bg-slate-100">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <Link href="/" className="transition hover:text-sky-600">
                                Services
                            </Link>
                            <Link href="/" className="transition hover:text-sky-600">
                                Gallery
                            </Link>
                            <Link href="/" className="transition hover:text-sky-600">
                                About
                            </Link>
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

                <main>
                    {/* Hero section */}
                    <section className="relative overflow-hidden bg-slate-900 text-white">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.pexels.com/photos/4057660/pexels-photo-4057660.jpeg?auto=compress&cs=tinysrgb&w=1920"
                                alt="Ocean view"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
                        </div>

                        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl space-y-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.5em] text-sky-200">
                                    Greetings from
                                </p>
                                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                                    Voyage Mate
                                </h1>
                                <p className="text-base text-slate-200">
                                    Voyage Mate is a travel app designed to simplify the booking of tourism
                                    packages, offering a seamless experience from planning to reservation.
                                </p>
                                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <span>Visit:</span>
                                    <span className="text-2xl text-sky-200">Fiji</span>
                                </div>

                                {/* Hero Book Now → Create Trip (auth will force login if needed) */}
                                <Button
                                    size="lg"
                                    className="bg-sky-500 px-8 text-white hover:bg-sky-400"
                                    onClick={goToCreateTrip}
                                >
                                    Book Now
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
                                                <span className="text-sky-200">Top pick</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Handpicked packages */}
                    <section className="mx-auto max-w-6xl px-6 py-16">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-slate-900">Handpicked Packages</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Choose from curated experiences designed to deliver memories of a lifetime.
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
                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                {pkg.destination}
                                            </p>
                                            <p className="mt-2 text-sm text-slate-600">{pkg.description}</p>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between text-sm font-semibold text-slate-900">
                                            <span>{pkg.priceLabel}</span>
                                            <span className="flex items-center gap-1 text-amber-500">
                                                {'★'.repeat(Math.floor(pkg.rating))}
                                                <span className="text-slate-500">({pkg.rating.toFixed(1)})</span>
                                            </span>
                                        </div>

                                        {/* Package Book Now → /trips/create with prefilled title/destination/budget */}
                                        <Button
                                            className="mt-2 bg-sky-500 text-white hover:bg-sky-400"
                                            onClick={() => bookPackage(pkg)}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
