// resources/js/pages/Trips/Journal.tsx
import React from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import NotebookEditor from "@/components/NotebookEditor";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// ✅ Read-only TipTap viewer to render saved entries EXACTLY like editor
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

/* ---------------- TYPES ---------------- */
type JournalImage = {
  id: number;
  path: string;
};

type JournalEntry = {
  id: number;
  entry_date: string | null;
  title: string | null;
  body: string; // HTML (TipTap)
  images: JournalImage[];
  created_at: string;
};

type Trip = {
  id: number;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
};

type PageProps = {
  trip: Trip;
  entries: JournalEntry[];
  flash?: { success?: string };
  [key: string]: any;
};

/* ------------- helpers ------------- */
const formatDateOnly = (value?: string | null) => (value ? value.slice(0, 10) : "");

/* ================= NOTEBOOK PAPER STYLE =================
   This is the single source of truth for how the paper looks.
   We use it for:
   - the editor component (NotebookEditor uses its own internal styles)
   - the read-only display (NotebookViewer below)
*/
const paperClass =
  [
    // paper block
    "min-h-[420px] outline-none rounded-2xl",
    "px-4 py-4",
    // handwriting + spacing
    'font-["Caveat"] text-[20px] leading-[38px] text-slate-900',
    // cursor/text should sit ABOVE the line -> extra top padding already in py-4,
    // but we add a little more top padding to keep it off the line visually.
    "pt-[14px]",
    // page color
    "bg-[#f7eed0]",
    // thin notebook lines (1px line)
    "bg-[linear-gradient(to_bottom,transparent_0,transparent_36px,rgba(99,102,241,0.16)_37px,transparent_38px)]",
    "bg-[size:100%_38px]",

    // ✅ normalize TipTap HTML spacing so lines look clean
    "[&_p]:m-0 [&_p]:min-h-[38px]",
    "[&_br]:leading-[38px]",
    "[&_strong]:font-extrabold",
    "[&_em]:italic",
    "[&_u]:underline",

    // ✅ lists should align nicely on lines
    "[&_ul]:list-disc [&_ul]:pl-7 [&_ul]:my-0",
    "[&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:my-0",
    "[&_li]:my-0 [&_li>p]:m-0",

    // ✅ alignment classes (if you add align buttons in editor later)
    "[&_.text-left]:text-left",
    "[&_.text-center]:text-center",
    "[&_.text-right]:text-right",
    "[&_.text-justify]:text-justify",

    // ✅ images inside body
    "[&_img]:inline-block [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow [&_img]:my-3",

    // ✅ links
    "[&_a]:text-indigo-700 [&_a]:underline",
  ].join(" ");

/* ================= NOTEBOOK VIEWER (read-only) ================= */
function NotebookViewer({ html }: { html: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder: "" }),
    ],
    content: html || "",
    editable: false,
    editorProps: {
      attributes: {
        class: paperClass,
      },
    },
  });

  // keep viewer in sync if html changes
  React.useEffect(() => {
    if (!editor) return;
    const next = html || "";
    const current = editor.getHTML();
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [html, editor]);

  return (
    <div className="rounded-2xl border border-indigo-200 bg-white shadow-sm overflow-hidden">
      <EditorContent editor={editor} />
    </div>
  );
}

/* ================= UI helpers ================= */
type NewFileItem = {
  id: string;
  file: File;
  url: string;
};

function makeNewFileId(file: File) {
  return `nw-${file.name}-${file.size}-${file.lastModified}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function filesFromDrop(e: React.DragEvent) {
  const files = Array.from(e.dataTransfer.files || []);
  return files.filter((f) => f.type.startsWith("image/"));
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative w-[96vw] max-w-6xl h-[92vh] rounded-2xl border border-indigo-100 bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {/* ✅ scrollable */}
        <div className="px-5 py-4 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}

function Lightbox({
  open,
  src,
  onClose,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-w-4xl w-full">
        <img
          src={src}
          className="w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl bg-black"
          alt="Preview"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/** Sortable card with dedicated drag handle */
function SortableCard({
  id,
  imageSrc,
  caption,
  onPreview,
  onRemove,
  removeLabel = "Remove",
}: {
  id: string;
  imageSrc: string;
  caption: string;
  onPreview?: () => void;
  onRemove: () => void;
  removeLabel?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-indigo-100 bg-white overflow-hidden"
    >
      <button type="button" onClick={onPreview} className="block w-full">
        <img src={imageSrc} alt={caption} className="h-28 w-full object-cover" />
      </button>

      <div className="p-2">
        <div className="text-xs font-semibold text-slate-800 truncate" title={caption}>
          {caption}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            {...attributes}
            {...listeners}
          >
            ↕ Drag
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            {removeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function Journal() {
  const { props } = usePage<PageProps>();
  const { trip, entries, flash } = props;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const inputClass =
    "w-full rounded-md border border-indigo-400 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500";
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";

  // Create form
  const createForm = useForm<{
    entry_date: string;
    title: string;
    body: string;
    images: File[];
  }>({
    entry_date: "",
    title: "",
    body: "",
    images: [],
  });

  // New images (create) - reorder BEFORE saving
  const [createItems, setCreateItems] = React.useState<NewFileItem[]>([]);

  // Edit state + form
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<JournalEntry | null>(null);

  const editForm = useForm<{
    entry_date: string;
    title: string;
    body: string;
    images: File[];
  }>({
    entry_date: "",
    title: "",
    body: "",
    images: [],
  });

  // New images (edit) - reorder BEFORE saving
  const [editNewItems, setEditNewItems] = React.useState<NewFileItem[]>([]);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxSrc, setLightboxSrc] = React.useState("");

  // cleanup object urls on unmount
  React.useEffect(() => {
    return () => {
      createItems.forEach((it) => URL.revokeObjectURL(it.url));
      editNewItems.forEach((it) => URL.revokeObjectURL(it.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (e: JournalEntry) => {
    setEditing(e);
    setEditNewItems([]);
    editForm.setData({
      entry_date: formatDateOnly(e.entry_date),
      title: e.title ?? "",
      body: e.body ?? "",
      images: [],
    });
    setEditOpen(true);
  };

  /* ================= Upload helpers ================= */
  const addCreateFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;

    setCreateItems((prev) => [
      ...prev,
      ...imgs.map((file) => ({
        id: makeNewFileId(file),
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const addEditFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;

    setEditNewItems((prev) => [
      ...prev,
      ...imgs.map((file) => ({
        id: makeNewFileId(file),
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeCreateItem = (id: string) => {
    setCreateItems((prev) => {
      const t = prev.find((x) => x.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const removeEditNewItem = (id: string) => {
    setEditNewItems((prev) => {
      const t = prev.find((x) => x.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const openCreatePicker = () => {
    const el = document.getElementById("journal-images-create") as HTMLInputElement | null;
    el?.click();
  };

  const openEditPicker = () => {
    const el = document.getElementById("journal-images-edit") as HTMLInputElement | null;
    el?.click();
  };

  /* ================= DnD handlers ================= */
  const onDragEndCreate = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setCreateItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === String(active.id));
      const newIndex = prev.findIndex((x) => x.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onDragEndEditNew = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setEditNewItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === String(active.id));
      const newIndex = prev.findIndex((x) => x.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onDragEndExisting = (e: DragEndEvent) => {
    if (!editing) return;

    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const ids = editing.images.map((im) => `ex-${im.id}`);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(editing.images, oldIndex, newIndex);
    setEditing({ ...editing, images: reordered });

    router.post(
      `/trips/${trip.id}/journal/${editing.id}/images/reorder`,
      { ordered_ids: reordered.map((im) => im.id) },
      { preserveScroll: true }
    );
  };

  /* ================= Actions ================= */
  const submitCreate = (ev: React.FormEvent) => {
    ev.preventDefault();

    const payload = {
      ...createForm.data,
      images: createItems.map((x) => x.file),
    };

    router.post(`/trips/${trip.id}/journal`, payload, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        createItems.forEach((it) => URL.revokeObjectURL(it.url));
        setCreateItems([]);
        createForm.reset();
        router.reload({ only: ["entries", "flash"] });
      },
    });
  };


  const submitEdit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;

    const payload = {
      ...editForm.data,
      images: editNewItems.map((x) => x.file),
      _method: "put",
    };

    router.post(`/trips/${trip.id}/journal/${editing.id}`, payload, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // cleanup previews
        editNewItems.forEach((it) => URL.revokeObjectURL(it.url));
        setEditNewItems([]);

        // close + reset
        setEditOpen(false);
        setEditing(null);
        editForm.reset();

        // refresh list
        router.reload({ only: ["entries", "flash"] });
      },
    });
  };



  const deleteEntry = (entryId: number) => {
    if (!confirm("Delete this journal entry?")) return;
    router.delete(`/trips/${trip.id}/journal/${entryId}`, { preserveScroll: true });
  };

  const deleteExistingImage = (imageId: number) => {
    if (!editing) return;
    if (!confirm("Delete this photo?")) return;

    router.delete(`/trips/${trip.id}/journal/${editing.id}/images/${imageId}`, {
      preserveScroll: true,
      onSuccess: () => {
        setEditing((prev) =>
          prev ? { ...prev, images: prev.images.filter((im) => im.id !== imageId) } : prev
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-8">
      <Head title={`Journal • ${trip.title}`} />

      <Lightbox open={lightboxOpen} src={lightboxSrc} onClose={() => setLightboxOpen(false)} />

      {/* ================= EDIT MODAL ================= */}
      <Modal
        open={editOpen}
        title="Edit Journal Entry"
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
          editNewItems.forEach((it) => URL.revokeObjectURL(it.url));
          setEditNewItems([]);
        }}
      >
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Entry Date (optional)</label>
              <input
                type="date"
                value={editForm.data.entry_date}
                onChange={(e) => editForm.setData("entry_date", e.target.value)}
                className={inputClass}
              />
              {editForm.errors.entry_date && (
                <p className="mt-1 text-xs text-red-600">{editForm.errors.entry_date}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Title (optional)</label>
              <input
                type="text"
                placeholder="e.g., Day 1 in Cox’s Bazar"
                value={editForm.data.title}
                onChange={(e) => editForm.setData("title", e.target.value)}
                className={inputClass}
              />
              {editForm.errors.title && (
                <p className="mt-1 text-xs text-red-600">{editForm.errors.title}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Journal Text <span className="text-red-500">*</span>
            </label>

            <NotebookEditor
              value={editForm.data.body}
              allowInsertImage={true}
              onChange={(html) => editForm.setData("body", html ?? "")}
              placeholder="Write your experience..."
              onUploadImages={async (files) => {
                if (!editing) return [];

                // ✅ IMPORTANT: route is POST /trips/{trip}/journal/{entry}/images
               const fd = new FormData();
               const token =
                 (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";

               fd.append("_token", token);
               files.forEach((f) => fd.append("images[]", f));


                const res = await fetch(`/trips/${trip.id}/journal/${editing.id}/images`, {
                  method: "POST",
                  credentials: "same-origin",
                  headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN":
                      (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ||
                      "",
                  },
                  body: fd,
                });
                if (!res.ok) {
                  console.error("Upload failed:", res.status, await res.text());
                  return [];
                }

                const json = await res.json();
                return (json.images || []).map((img: any) => `/storage/${img.path}`);
              }}
            />

            {editForm.errors.body && <p className="mt-1 text-xs text-red-600">{editForm.errors.body}</p>}
          </div>

          {/* Existing uploaded photos (drag reorder + delete) */}
          {editing && editing.images?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Uploaded Photos</label>
                <span className="text-xs text-slate-500">Drag to reorder • Order saves instantly</span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndExisting}>
                <SortableContext items={editing.images.map((im) => `ex-${im.id}`)} strategy={rectSortingStrategy}>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {editing.images.map((img) => (
                      <SortableCard
                        key={img.id}
                        id={`ex-${img.id}`}
                        imageSrc={`/storage/${img.path}`}
                        caption={`Image #${img.id}`}
                        onPreview={() => {
                          setLightboxSrc(`/storage/${img.path}`);
                          setLightboxOpen(true);
                        }}
                        onRemove={() => deleteExistingImage(img.id)}
                        removeLabel="Delete"
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Drag-drop upload zone (EDIT) + reorder before saving */}
          <div>
            <label className={labelClass}>Add more images (optional)</label>

            <input
              id="journal-images-edit"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                addEditFiles(Array.from(e.target.files || []));
                e.currentTarget.value = "";
              }}
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addEditFiles(filesFromDrop(e));
              }}
              className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Drop your photos</p>
                  <p className="text-xs text-slate-600">Reorder before saving</p>
                </div>

                <button
                  type="button"
                  onClick={openEditPicker}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  📷 Upload Images
                </button>
              </div>

              {editNewItems.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                    Selected Images
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndEditNew}>
                    <SortableContext items={editNewItems.map((x) => x.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {editNewItems.map((it) => (
                          <SortableCard
                            key={it.id}
                            id={it.id}
                            imageSrc={it.url}
                            caption={it.file.name}
                            onRemove={() => removeEditNewItem(it.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>

            {editForm.errors.images && <p className="mt-1 text-xs text-red-600">{editForm.errors.images}</p>}
          </div>

          <button
            type="submit"
            disabled={editForm.processing}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* ================= PAGE ================= */}
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Trip Journal</h1>
            <p className="mt-1 text-sm text-indigo-700">
              {trip.title}
              {trip.destination ? ` • ${trip.destination}` : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500">Write your experiences and keep memories with photos.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => router.visit(`/trips/${trip.id}`)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
            >
              Trip Details
            </button>
          </div>
        </div>

        {flash?.success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
            {flash.success}
          </div>
        )}

        {/* CREATE CARD */}
        <div className="rounded-2xl border border-indigo-100 bg-white/80 shadow-sm backdrop-blur">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-indigo-800">New Entry</h2>
            <p className="text-xs text-slate-500">Add a short title, write your experience, and attach photos.</p>
          </div>

          <form onSubmit={submitCreate} className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Entry Date (optional)</label>
                <input
                  type="date"
                  value={createForm.data.entry_date}
                  onChange={(e) => createForm.setData("entry_date", e.target.value)}
                  className={inputClass}
                />
                {createForm.errors.entry_date && (
                  <p className="mt-1 text-xs text-red-600">{createForm.errors.entry_date}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., The best sunset ever"
                  value={createForm.data.title}
                  onChange={(e) => createForm.setData("title", e.target.value)}
                  className={inputClass}
                />
                {createForm.errors.title && <p className="mt-1 text-xs text-red-600">{createForm.errors.title}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Journal Text <span className="text-red-500">*</span>
              </label>
              <NotebookEditor
                value={createForm.data.body}
                onChange={(html) => createForm.setData("body", html ?? "")}
                placeholder="Write your experience..."
                allowInsertImage={true}
              />


              {createForm.errors.body && <p className="mt-1 text-xs text-red-600">{createForm.errors.body}</p>}
            </div>

            {/* Drag-drop upload zone (CREATE) + reorder before saving */}
            <div>
              <label className={labelClass}>Images (optional)</label>

              <input
                id="journal-images-create"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  addCreateFiles(Array.from(e.target.files || []));
                  e.currentTarget.value = "";
                }}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addCreateFiles(filesFromDrop(e));
                }}
                className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Drop your photos</p>
                    <p className="text-xs text-slate-600">Reorder before saving</p>
                  </div>

                  <button
                    type="button"
                    onClick={openCreatePicker}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                  >
                    📷 Upload Images
                  </button>
                </div>

                {createItems.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                      Selected Images
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndCreate}>
                      <SortableContext items={createItems.map((x) => x.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {createItems.map((it) => (
                            <SortableCard
                              key={it.id}
                              id={it.id}
                              imageSrc={it.url}
                              caption={it.file.name}
                              onRemove={() => removeCreateItem(it.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>

              {createForm.errors.images && <p className="mt-1 text-xs text-red-600">{createForm.errors.images}</p>}
            </div>

            <button
              type="submit"
              disabled={createForm.processing}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              Add Entry
            </button>
          </form>
        </div>

        {/* ENTRIES */}
        <div className="grid grid-cols-1 gap-5">
          {!entries || entries.length === 0 ? (
            <div className="rounded-2xl border border-indigo-100 bg-white/80 p-6 text-sm text-slate-700 shadow-sm">
              No journal entries yet. Add your first memory above ✨
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="rounded-2xl border border-indigo-100 bg-white/80 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {e.title?.trim() ? e.title : "Journal Entry"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {e.entry_date ? formatDateOnly(e.entry_date) : "No date"} • Created:{" "}
                      {e.created_at ? e.created_at.slice(0, 10) : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteEntry(e.id)}
                      className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="px-5 py-4">
                  {/* ✅ Display body using read-only TipTap so it matches the editor */}
                  <NotebookViewer html={e.body} />

                  {e.images && e.images.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">Photos</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {e.images.map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => {
                              setLightboxSrc(`/storage/${img.path}`);
                              setLightboxOpen(true);
                            }}
                            className="group relative overflow-hidden rounded-xl border border-indigo-100 bg-white"
                          >
                            <img
                              src={`/storage/${img.path}`}
                              alt="Journal"
                              className="h-36 w-full object-cover transition group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
