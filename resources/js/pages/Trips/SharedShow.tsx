import React from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";

/* -------------------------------------------------
   TYPES (matching your Show.tsx style)
--------------------------------------------------*/
interface ItineraryItem {
  id: number;
  date: string | null;
  time: string | null;
  title: string;
  location: string | null;
  notes: string | null;
}

interface Expense {
  id: number;
  category: string | null;
  amount: string;
  spent_on: string | null;
  notes: string | null;
}

interface ChecklistItem {
  id: number;
  type: "packing" | "task";
  title: string;
  is_done: boolean;
  due_date: string | null;
}

interface Trip {
  id: number;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  budget: string | null;
  itinerary_items: ItineraryItem[];
  expenses: Expense[];
  checklist_items: ChecklistItem[];
}

interface Comment {
  id: number;
  name: string;
  email: string | null;
  body: string;
  created_at: string;
}

interface SharedShowPageProps {
  trip: Trip;
  totalSpent: number;
  share: { token: string };
  viewer: { name: string; email: string };
  comments: Comment[];
  flash?: { success?: string };
  [key: string]: any;
}

/* -------------------------------------------------
   HELPERS (same as your Show.tsx)
--------------------------------------------------*/
const formatDateOnly = (value: string | null | undefined) => {
  if (!value) return "";
  return value.slice(0, 10);
};

/* -------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------*/
export default function SharedShow() {
  const { props } = usePage<SharedShowPageProps>();
  const { trip, totalSpent, comments, viewer, flash, share } = props;

  const tripStartDate = formatDateOnly(trip.start_date);
  const tripEndDate = formatDateOnly(trip.end_date);

  const budget = trip.budget ? parseFloat(trip.budget) : null;
  const spent = Number(totalSpent || 0);
  const remaining = budget !== null ? budget - spent : null;

  // Comment form (public)
  const commentForm = useForm({
    name: viewer?.name ?? "",
    email: viewer?.email ?? "",
    body: "",
  });

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();

    commentForm.post(`/s/${share.token}/comments`, {
      preserveScroll: true,
      onSuccess: () => commentForm.reset("body"),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-8">
      <Head title={`Shared Trip: ${trip.title}`} />

      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
            <p className="text-sm text-blue-600">
              {trip.destination}
              {trip.start_date && trip.end_date && (
                <> • {tripStartDate} → {tripEndDate}</>
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Shared view (read-only). You can leave comments below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Back
            </button>
          </div>
        </div>

        {flash?.success && (
          <div className="px-4 py-2 rounded-md bg-green-100 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        {/* DESCRIPTION */}
        {trip.description && (
          <div className="bg-slate-100 border border-blue-100 rounded-lg p-4">
            <h2 className="font-semibold mb-1 text-lg text-blue-700">Overview</h2>
            <p className="text-sm text-slate-900 whitespace-pre-line">
              {trip.description}
            </p>
          </div>
        )}

        {/* ----------------------------- */}
        {/*  BUDGET & EXPENSES SECTION   */}
        {/* ----------------------------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BUDGET CARD */}
          <div className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Budget & Expenses
            </h2>

            {budget === null ? (
              <p className="text-sm text-slate-800">
                No budget set. Expenses are still visible.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Budget:</span>{" "}
                  {budget.toFixed(2)} $
                </p>
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Total Spent:</span>{" "}
                  {spent.toFixed(2)} $
                </p>
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Remaining:</span>{" "}
                  {remaining !== null ? remaining.toFixed(2) : "-"} $
                </p>

                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500"
                    style={{
                      width:
                        budget > 0 ? `${Math.min(100, (spent / budget) * 100)}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-slate-700">
              You can’t add/edit expenses in shared view.
            </div>
          </div>

          {/* EXPENSE LIST */}
          <div className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Expense List
            </h2>

            {trip.expenses.length === 0 ? (
              <p className="text-sm text-slate-800">No expenses yet.</p>
            ) : (
              <ul className="space-y-3">
                {trip.expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="p-3 border rounded-lg bg-blue-50 border-blue-200 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-blue-800">
                        {exp.category} – {exp.amount} $
                      </p>
                      <p className="text-xs text-slate-800">
                        {formatDateOnly(exp.spent_on)}
                        {exp.notes && <> • {exp.notes}</>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ----------------------------- */}
        {/*        ITINERARY SECTION      */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Itinerary</h2>

          {trip.itinerary_items.length === 0 ? (
            <p className="text-sm text-slate-800">No itinerary items yet.</p>
          ) : (
            <ul className="space-y-3">
              {trip.itinerary_items.map((item) => (
                <li
                  key={item.id}
                  className="p-3 border rounded-lg bg-blue-50 border-blue-200"
                >
                  <p className="font-semibold text-blue-800">{item.title}</p>
                  <p className="text-xs text-slate-800">
                    {formatDateOnly(item.date)}
                    {item.time && <> • {item.time}</>}
                    {item.location && <> • {item.location}</>}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-slate-900 mt-2 whitespace-pre-line">
                      {item.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ----------------------------- */}
        {/*        CHECKLIST SECTION      */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Checklist</h2>

          {trip.checklist_items.length === 0 ? (
            <p className="text-sm text-slate-800">No checklist items yet.</p>
          ) : (
            <ul className="space-y-2">
              {trip.checklist_items.map((c) => (
                <li
                  key={c.id}
                  className="p-3 border rounded-lg bg-blue-50 border-blue-200 flex items-start gap-2"
                >
                  <input type="checkbox" checked={c.is_done} readOnly className="mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-800">{c.title}</p>
                    <p className="text-xs text-slate-800">
                      {c.type.toUpperCase()}
                      {c.due_date && <> • Due: {formatDateOnly(c.due_date)}</>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ----------------------------- */}
        {/*           COMMENTS            */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Comments</h2>

          <form
            onSubmit={submitComment}
            className="space-y-3 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={commentForm.data.name}
                  onChange={(e) => commentForm.setData("name", e.target.value)}
                />
                {commentForm.errors.name && (
                  <p className="text-xs text-red-600 mt-1">{commentForm.errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Email (optional)
                </label>
                <input
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={commentForm.data.email}
                  onChange={(e) => commentForm.setData("email", e.target.value)}
                />
                {commentForm.errors.email && (
                  <p className="text-xs text-red-600 mt-1">{commentForm.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Write your comment..."
                value={commentForm.data.body}
                onChange={(e) => commentForm.setData("body", e.target.value)}
              />
              {commentForm.errors.body && (
                <p className="text-xs text-red-600 mt-1">{commentForm.errors.body}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={commentForm.processing}
              className="px-4 py-2 w-full bg-blue-600 rounded-md text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              Post Comment
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-800">No comments yet.</p>
            ) : (
              comments.map((cm) => (
                <div
                  key={cm.id}
                  className="p-3 border rounded-lg bg-white border-blue-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{cm.name}</p>
                    <p className="text-xs text-slate-500">
                      {cm.created_at ? cm.created_at.slice(0, 19).replace("T", " ") : ""}
                    </p>
                  </div>
                  <p className="text-sm text-slate-800 mt-2 whitespace-pre-line">{cm.body}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="text-xs text-slate-500 text-center">
          This is a shared, read-only view.
        </div>
      </div>
    </div>
  );
}
