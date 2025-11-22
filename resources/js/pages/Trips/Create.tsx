import React from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";

interface TripFormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string;
  budget: string;
}

interface PrefillProps {
  prefill?: {
    title?: string;
    destination?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    budget?: number | string;
  };
  [key: string]: any;
}

export default function Create() {
  const { props } = usePage<PrefillProps>();
  const { prefill } = props;

  const { data, setData, post, processing, errors } = useForm<TripFormData>({
    title: prefill?.title ?? "",
    destination: prefill?.destination ?? "",
    start_date: prefill?.start_date ?? "",
    end_date: prefill?.end_date ?? "",
    description: prefill?.description ?? "",
    budget:
      prefill?.budget !== undefined && prefill?.budget !== null
        ? String(prefill.budget)
        : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/trips");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-8">
      <Head title="Create Trip" />

      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Top header with title + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create a New Trip
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add your destination, dates, budget, and notes to start planning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.get("/dashboard")}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Return to Dashboard
            </button>

            <button
              type="button"
              onClick={() => router.get("/trips")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Back to Trips
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
          {/* Small pill header */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Trip Details
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Destination */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Trip Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                  placeholder="Ex: Winter Escape in Bali"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Give your trip a short, memorable name.
                </p>
                {errors.title && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                  placeholder="City, Country"
                  value={data.destination}
                  onChange={(e) => setData("destination", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Where are you heading? Ex: Tokyo, Japan.
                </p>
                {errors.destination && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="rounded-xl bg-slate-50/80 p-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Trip Dates
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-[11px] font-medium text-red-600">
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-[11px] font-medium text-red-600">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Make sure your end date is on or after your start date.
              </p>
            </div>

            {/* Budget & Description */}
            <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
              {/* Budget */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Budget (optional)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-200 bg-white px-7 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                    placeholder="Ex: 1500"
                    value={data.budget}
                    onChange={(e) => setData("budget", e.target.value)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional total budget for this trip.
                </p>
                {errors.budget && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {errors.budget}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Description (optional)
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
                  rows={4}
                  placeholder="Add notes, ideas, or key plans you don't want to forget."
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                />
                {errors.description && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.get("/trips")}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {processing ? "Saving…" : "Save Trip"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
