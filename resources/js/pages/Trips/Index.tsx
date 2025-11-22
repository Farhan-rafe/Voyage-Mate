import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

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

// Helper: keep only YYYY-MM-DD (remove any time part)
const formatDateOnly = (d: string | null): string => {
  if (!d) return "";
  return d.slice(0, 10); // e.g. "2025-11-21 14:30:00" -> "2025-11-21"
};

// Used for <input type="date"> on the create page (via query params)
const fixDate = (d: string | null): string => {
  if (!d) return "";
  const clean = formatDateOnly(d); // trim timestamp
  return clean.replace(/\//g, "-"); // YYYY/MM/DD -> YYYY-MM-DD if needed
};

export default function Index() {
  const { props } = usePage<TripsPageProps>();
  const trips = props.trips || [];

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    router.delete(`/trips/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-8">
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              My Trips
            </h1>
            <p className="text-sm text-slate-500">
              Manage, edit, or delete your travel plans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.get("/dashboard")}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition"
            >
              Return to Dashboard
            </button>

            <Link
              href="/trips/create"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              + New Trip
            </Link>
          </div>
        </div>

        {/* Card wrapper */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
          {trips.length === 0 && (
            <p className="text-slate-600 text-sm">
              You have no trips yet. Create one!
            </p>
          )}

          <div className="flex flex-col gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* LEFT: Trip details */}
                  <Link href={`/trips/${trip.id}`} className="flex-1">
                    <h2 className="text-lg font-semibold text-blue-700 hover:underline">
                      {trip.title || "Untitled Trip"}
                    </h2>

                    <p className="text-sm text-slate-600">
                      {trip.destination}
                      {trip.start_date && trip.end_date && (
                        <>
                          {" "}
                          •{" "}
                          <span className="font-medium text-slate-700">
                            {formatDateOnly(trip.start_date)} →{" "}
                            {formatDateOnly(trip.end_date)}
                          </span>
                        </>
                      )}
                    </p>
                  </Link>

                  {/* RIGHT: Action buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={
                        `/trips/create` +
                        `?id=${trip.id}` +
                        `&title=${encodeURIComponent(trip.title || "")}` +
                        `&destination=${encodeURIComponent(
                          trip.destination || ""
                        )}` +
                        `&start_date=${encodeURIComponent(
                          fixDate(trip.start_date)
                        )}` +
                        `&end_date=${encodeURIComponent(
                          fixDate(trip.end_date)
                        )}` +
                        `&description=${encodeURIComponent(
                          trip.description || ""
                        )}` +
                        `&budget=${encodeURIComponent(trip.budget || "")}`
                      }
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(trip.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
