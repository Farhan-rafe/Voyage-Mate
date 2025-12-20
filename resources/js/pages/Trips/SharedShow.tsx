import React from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";

/* -------------------------------------------------
   TYPES (matching Show.tsx style)
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
  // backend has this; we keep it optional so TS won’t break if missing
  user_id?: number | null;
}

interface SharedShowPageProps {
  trip: Trip;
  totalSpent: number;
  share: { token: string };
  viewer: { name: string; email: string };
  comments: Comment[];
  flash?: { success?: string };
  auth?: { user?: { id: number } | null };
  [key: string]: any;
}

/* -------------------------------------------------
   HELPERS (same as Show.tsx)
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
  const { trip, totalSpent, comments, viewer, flash, share, auth } = props;

  const tripStartDate = formatDateOnly(trip.start_date);
  const tripEndDate = formatDateOnly(trip.end_date);

  const budget = trip.budget ? parseFloat(trip.budget) : null;
  const spent = Number(totalSpent || 0);
  const remaining = budget !== null ? budget - spent : null;

  const isLoggedIn = !!auth?.user?.id;

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

  // ✅ Edit state for comments (owner only)
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editBody, setEditBody] = React.useState("");

  const startEdit = (cm: Comment) => {
    setEditingId(cm.id);
    setEditBody(cm.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody("");
  };

  const updateComment = (id: number) => {
    router.put(
      `/s/${share.token}/comments/${id}`,
      { body: editBody },
      { preserveScroll: true }
    );
    cancelEdit();
  };

  // ✅ Delete confirmation modal (no browser confirm)
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const confirmDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const deleteComment = () => {
    if (!deleteId) return;

    router.delete(`/s/${share.token}/comments/${deleteId}`, {
      preserveScroll: true,
    });

    setDeleteId(null);
  };

  // ✅ Guest tries to manage -> show login callout under posted comments
  const [showLoginCallout, setShowLoginCallout] = React.useState(false);
  const loginCalloutRef = React.useRef<HTMLDivElement | null>(null);

  const guestManageAttempt = () => {
    setShowLoginCallout(true);
    // scroll gently to the callout (after render)
    setTimeout(() => {
      loginCalloutRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-8">
      <Head title={`Shared Trip: ${trip.title}`} />

      {/* ✅ PROFESSIONAL DELETE MODAL POPUP */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delete comment confirmation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cancelDelete();
          }}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Delete comment?
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    This action can’t be undone. The comment will be removed permanently.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelDelete}
                  className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteComment}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
            <p className="text-sm text-blue-600">
              {trip.destination}
              {trip.start_date && trip.end_date && (
                <>
                  {" "}
                  • {tripStartDate} → {tripEndDate}
                </>
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
                        budget > 0
                          ? `${Math.min(100, (spent / budget) * 100)}%`
                          : "0%",
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

          {/* Posted comments */}
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-800">No comments yet.</p>
            ) : (
              comments.map((cm) => {
                const isOwner =
                  auth?.user?.id != null &&
                  cm.user_id != null &&
                  auth.user.id === cm.user_id;

                return (
                  <div
                    key={cm.id}
                    className="p-3 border rounded-lg bg-white border-blue-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{cm.name}</p>

                      <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-500">
                          {cm.created_at ? cm.created_at.slice(0, 19).replace("T", " ") : ""}
                        </p>

                        {/* ✅ Logged in + owner: normal edit/delete */}
                        {isOwner && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(cm)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDelete(cm.id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {/* ✅ Logged out: show Manage button that triggers callout */}
                        {!isLoggedIn && (
                          <button
                            type="button"
                            onClick={guestManageAttempt}
                            className="text-xs text-slate-600 hover:underline"
                            title="Log in to edit or delete your comments"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === cm.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          rows={3}
                          className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateComment(cm.id)}
                            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-1 text-xs rounded border text-slate-700 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-800 mt-2 whitespace-pre-line">{cm.body}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ✅ Shows ONLY after guest tries to manage */}
          {!isLoggedIn && showLoginCallout && (
            <div
              ref={loginCalloutRef}
              className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    🔒
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Log in to manage your comments
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      You can edit or delete the comments you posted once you’re logged in.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.get("/login")}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Log in
                  </button>

                  <button
                    type="button"
                    onClick={() => router.get("/register")}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Create account
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLoginCallout(false)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="text-xs text-slate-500 text-center">
          This is a shared, read-only view.
        </div>
      </div>
    </div>
  );
}
