import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { MapPin, Clock, Plane, Bus, AlertCircle, History, DollarSign, Camera, Star } from 'lucide-react';

export default function DestinationShow({ destination }) {
    const galleryImages = [destination.photo_gallery_1, destination.photo_gallery_2, destination.photo_gallery_3].filter(Boolean);

    return (
        <div className="bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <Head title={destination.name} />
            
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{destination.name}</h1>
                    <div className="flex items-center gap-4 text-slate-600">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination.city}, {destination.country}</span>
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">{destination.type}</span>
                    </div>
                </div>

                {/* Featured Image */}
                {destination.featured_image && (
                    <img src={destination.featured_image} alt={destination.name} className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8" />
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
