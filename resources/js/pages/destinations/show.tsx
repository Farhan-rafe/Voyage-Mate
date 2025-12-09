import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Plane, Bus, AlertCircle, History, DollarSign, Camera, Star, Heart, Cloud, Droplets, Wind } from 'lucide-react';

export default function DestinationShow({ destination }) {
    const { auth } = usePage().props;
    const galleryImages = [destination.photo_gallery_1, destination.photo_gallery_2, destination.photo_gallery_3].filter(Boolean);
    const [isFavorited, setIsFavorited] = useState(false);
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);

    useEffect(() => {
        // Check if favorited
        if (auth.user) {
            fetch(`/favorites/check/${destination.id}`)
                .then(res => res.json())
                .then(data => setIsFavorited(data.is_favorited));
        }

        // Get weather
        setLoadingWeather(true);
        fetch(`/api/weather/${destination.id}`)
            .then(res => res.json())
            .then(data => {
                setWeather(data);
                setLoadingWeather(false);
            })
            .catch(() => setLoadingWeather(false));
    }, [destination.id, auth.user]);

    const toggleFavorite = async () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        try {
            const response = await fetch(`/destinations/${destination.id}/favorite`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });
            const data = await response.json();
            setIsFavorited(data.is_favorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <Head title={destination.name} />
            
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">{destination.name}</h1>
                        <div className="flex items-center gap-4 text-slate-600">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination.city}, {destination.country}</span>
                            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">{destination.type}</span>
                        </div>
                    </div>
                    {auth.user && (
                        <button
                            onClick={toggleFavorite}
                            className={`p-3 rounded-full transition-all ${
                                isFavorited
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                            }`}
                            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                    )}
                </div>

                {/* Featured Image */}
                {destination.featured_image && (
                    <img src={destination.featured_image} alt={destination.name} className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8" />
                )}

                {/* Weather Widget */}
                {loadingWeather ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ) : weather && (
                    <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl shadow-lg p-6 mb-8 text-white">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Cloud className="w-6 h-6" /> Current Weather
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sky-100 text-sm">Temperature</p>
                                <p className="text-4xl font-bold">{weather.temperature}°C</p>
                                <p className="text-sky-100 text-sm">Feels like {weather.feels_like}°C</p>
                            </div>
                            <div>
                                <p className="text-sky-100 text-sm">Condition</p>
                                <p className="text-2xl font-semibold capitalize">{weather.condition}</p>
                                <p className="text-sky-100 text-sm">{weather.description}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Droplets className="w-5 h-5" />
                                    <span className="text-sky-100">Humidity: {weather.humidity}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wind className="w-5 h-5" />
                                    <span className="text-sky-100">Wind: {weather.wind_speed} m/s</span>
                                </div>
                                {weather.is_demo && (
                                    <p className="text-sky-100 text-xs italic mt-3">Demo weather data</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Overview Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                    <p className="text-slate-700 text-lg leading-relaxed mb-4">{destination.description}</p>
                    <p className="text-slate-700 leading-relaxed">{destination.travel_tips}</p>
                </div>

                {/* Photo Gallery */}
                {galleryImages.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Camera className="w-6 h-6 text-sky-600" /> Photo Gallery
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {galleryImages.map((img, idx) => (
                                <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full h-48 object-cover rounded-lg shadow" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Best Time to Visit */}
                {destination.best_time_to_visit && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-amber-600" /> Best Time to Visit
                        </h2>
                        <p className="text-slate-700 text-lg">{destination.best_time_to_visit}</p>
                    </div>
                )}

                {/* How to Reach */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Plane className="w-6 h-6 text-blue-600" /> How to Reach
                    </h2>
                    <div className="space-y-4">
                        {destination.nearest_airport && (
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-blue-600" /> Nearest Airport
                                </h3>
                                <p className="text-slate-700 ml-7">{destination.nearest_airport}</p>
                            </div>
                        )}
                        {destination.local_transport && (
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Bus className="w-5 h-5 text-green-600" /> Local Transport
                                </h3>
                                <p className="text-slate-700 ml-7">{destination.local_transport}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Must See Attractions */}
                {destination.must_see_attractions && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-red-600" /> Must See Attractions
                        </h2>
                        <p className="text-slate-700 text-lg leading-relaxed">{destination.must_see_attractions}</p>
                    </div>
                )}

                {/* Entry Fees */}
                {destination.entry_fees && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-green-600" /> Entry Fees
                        </h2>
                        <p className="text-slate-700 text-lg">{destination.entry_fees}</p>
                    </div>
                )}

                {/* Safety & Travel Tips */}
                {destination.safety_tips && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-orange-600" /> Safety & Travel Tips
                        </h2>
                        <p className="text-slate-700 text-lg">{destination.safety_tips}</p>
                    </div>
                )}

                {/* History & Culture */}
                {destination.history_culture && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <History className="w-6 h-6 text-purple-600" /> History & Culture
                        </h2>
                        <p className="text-slate-700 text-lg leading-relaxed">{destination.history_culture}</p>
                    </div>
                )}

                {/* Reviews & Ratings Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-amber-500" /> Reviews & Ratings
                    </h2>
                    
                    <div className="mb-8">
                        {destination.reviews.length === 0 ? (
                            <p className="text-slate-600 text-center py-8">No reviews yet. Be the first to share your experience!</p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {destination.reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold text-slate-900">{review.user?.name || 'User'}</span>
                                            <span className="text-amber-500 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                            <span className="text-slate-500 text-sm">({review.rating}/5)</span>
                                        </div>
                                        <p className="text-slate-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ReviewForm destinationId={destination.id} />
                </div>
            </div>
        </div>
    );
}

function ReviewForm({ destinationId }) {
    const { data, setData, post, processing, errors } = useForm({
        comment: '',
        rating: 5,
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/destinations/${destinationId}/reviews`);
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-sky-50 border border-sky-200 rounded-lg p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Share Your Experience</h3>
            
            <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your Review</label>
                <textarea
                    className="w-full border border-sky-300 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Tell others about your experience..."
                    value={data.comment}
                    onChange={e => setData('comment', e.target.value)}
                    required
                    rows={4}
                />
                {errors.comment && <div className="text-red-600 text-sm mt-1">{errors.comment}</div>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Rating</label>
                <div className="flex gap-2 items-center">
                    <select
                        value={data.rating}
                        onChange={e => setData('rating', Number(e.target.value))}
                        className="border border-sky-300 rounded-lg px-4 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {[1,2,3,4,5].map(n => (
                            <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <span className="text-amber-500 text-lg">{'★'.repeat(data.rating)}{'☆'.repeat(5 - data.rating)}</span>
                </div>
                {errors.rating && <div className="text-red-600 text-sm mt-1">{errors.rating}</div>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
            >
                {processing ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
