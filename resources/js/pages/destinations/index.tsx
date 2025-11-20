import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function DestinationIndex({ destinations, filters }) {
    const [search, setSearch] = React.useState(filters.search || '');
    const [type, setType] = React.useState(filters.type || '');
    const [country, setCountry] = React.useState(filters.country || '');

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `/destinations?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}&country=${encodeURIComponent(country)}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Head title="Search Destinations" />
            <h1 className="text-2xl font-bold mb-4">Search Destinations</h1>
            <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Search by name, country, or type"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 w-full md:w-1/3"
                />
                <input
                    type="text"
                    placeholder="Type (e.g. beach, mountain)"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="border rounded px-3 py-2 w-full md:w-1/4"
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="border rounded px-3 py-2 w-full md:w-1/4"
                />
                <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">Search</button>
            </form>
            <div className="grid gap-4 md:grid-cols-2">
                {destinations.data.length === 0 && <div>No destinations found.</div>}
                {destinations.data.map(dest => (
                    <div key={dest.id} className="border rounded-lg p-4 bg-white shadow">
                        <h2 className="text-lg font-semibold mb-1">
                            <Link href={`/destinations/${dest.id}`} className="text-sky-600 hover:underline">{dest.name}</Link>
                        </h2>
                        <div className="text-sm text-gray-500 mb-2">{dest.country} &middot; {dest.type}</div>
                        <div className="mb-2 line-clamp-2">{dest.description}</div>
                        {dest.featured_image && <img src={dest.featured_image} alt={dest.name} className="w-full h-32 object-cover rounded" />}
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                {destinations.links && destinations.links.map((link, i) => {
                    let label = link.label;
                    if (label.toLowerCase().includes('previous')) label = 'Previous';
                    else if (label.toLowerCase().includes('next')) label = 'Next';
                    else if (/<.*?>/.test(label)) label = label.replace(/<.*?>/g, '');
                    return (
                        <Link key={i} href={link.url || '#'} className={`px-2 py-1 mx-1 rounded ${link.active ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}>{label}</Link>
                    );
                })}
            </div>
        </div>
    );
}
