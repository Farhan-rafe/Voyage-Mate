import React from "react";
import { Link, usePage } from "@inertiajs/react";

interface Trip {
  id: number;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  description?: string | null;
  budget?: string | null;
}

interface TripsPageProps {
  trips: Trip[];
  [key: string]: any;
}

export default function Index() {
  const { props } = usePage<TripsPageProps>();
  const trips = props.trips || [];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link
          href="/trips/create"
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm shadow hover:bg-blue-700"
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 && (
        <p className="text-gray-600">You have no trips yet. Create one!</p>
      )}

      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between gap-3">
              {/* LEFT: trip info (clickable → show page) */}
              <Link href={`/trips/${trip.id}`} className="flex-1">
                <h2 className="font-semibold text-lg text-blue-700 hover:underline">
                  {trip.title || "Untitled Trip"}
                </h2>
                <p className="text-sm text-gray-600">
                  {trip.destination}
                  {trip.start_date && trip.end_date && (
                    <> • {trip.start_date} → {trip.end_date}</>
                  )}
                </p>
              </Link>

              {/* RIGHT: Edit button → /trips/create with prefilled query params */}
              <Link
                href={
                  `/trips/create` +
                  `?title=${encodeURIComponent(trip.title || "")}` +
                  `&destination=${encodeURIComponent(trip.destination || "")}` +
                  `&start_date=${encodeURIComponent(trip.start_date || "")}` +
                  `&end_date=${encodeURIComponent(trip.end_date || "")}` +
                  `&description=${encodeURIComponent(trip.description || "")}` +
                  `&budget=${encodeURIComponent(trip.budget || "")}`
                }
                className="ml-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md shadow hover:bg-blue-700"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
