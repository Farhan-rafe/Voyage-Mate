import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function DestinationShow({ destination }) {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <Head title={destination.name} />
            <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
            <div className="text-gray-500 mb-2">{destination.country} &middot; {destination.type}</div>
            {destination.featured_image && (
                <img src={destination.featured_image} alt={destination.name} className="w-full h-64 object-cover rounded mb-4" />
            )}
            <div className="mb-4">{destination.description}</div>
            <div className="mb-4 text-blue-700 font-semibold">Travel Tips:</div>
            <div className="mb-6">{destination.travel_tips}</div>
            <h2 className="text-xl font-bold mb-2">Reviews & Ratings</h2>
            <div className="mb-4">
                {destination.reviews.length === 0 && <div>No reviews yet.</div>}
                {destination.reviews.map((review) => (
                    <div key={review.id} className="mb-3 border-b pb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.user?.name || 'User'}</span>
                            <span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                        </div>
                        <div className="text-gray-700">{review.comment}</div>
                    </div>
                ))}
            </div>
            <ReviewForm destinationId={destination.id} />
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
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Add a Review</h3>
            <textarea
                className="w-full border rounded p-2 mb-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Your review..."
                value={data.comment}
                onChange={e => setData('comment', e.target.value)}
                required
                rows={4}
            />
            <div className="mb-2">
                <label className="mr-2">Rating:</label>
                <select
                    value={data.rating}
                    onChange={e => setData('rating', Number(e.target.value))}
                    className="border rounded px-2 py-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            {errors.comment && <div className="text-red-500 text-sm mb-1">{errors.comment}</div>}
            {errors.rating && <div className="text-red-500 text-sm mb-1">{errors.rating}</div>}
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-semibold mt-2 w-full transition-colors duration-200" disabled={processing}>
                {processing ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
