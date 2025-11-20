import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

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
    <div className="max-w-3xl mx-auto py-8">
      <Head title="Create Trip" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Trip</h1>
        <Link href="/trips" className="text-sm text-blue-600">
          ← Back to Trips
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={data.destination}
            onChange={(e) => setData("destination", e.target.value)}
          />
          {errors.destination && (
            <p className="text-xs text-red-600 mt-1">{errors.destination}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={data.start_date}
              onChange={(e) => setData("start_date", e.target.value)}
            />
            {errors.start_date && (
              <p className="text-xs text-red-600 mt-1">
                {errors.start_date}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={data.end_date}
              onChange={(e) => setData("end_date", e.target.value)}
            />
            {errors.end_date && (
              <p className="text-xs text-red-600 mt-1">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Budget (optional)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={data.budget}
            onChange={(e) => setData("budget", e.target.value)}
          />
          {errors.budget && (
            <p className="text-xs text-red-600 mt-1">{errors.budget}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={4}
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-50"
        >
          {processing ? "Saving" : "Save Trip"}
        </button>
      </form>
    </div>
  );
}
