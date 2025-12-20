// resources/js/components/NotebookEditor.tsx
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImageNodeView } from "@/components/ResizableImage";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import { NodeSelection } from "prosemirror-state";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  allowInsertImage?: boolean;
  onUploadImages?: (files: File[]) => Promise<string[]>;
};

export default function NotebookEditor({
  allowInsertImage = true,
  value,
  onChange,
  placeholder = "Write your experience...",
  onUploadImages,
}: Props) {
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),

      Image.extend({
        draggable: true, 
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: null },
            height: { default: null },
          };
        },
        addNodeView() {
          return ResizableImageNodeView;
        },
      }).configure({
        inline: false,
        allowBase64: allowInsertImage,
      }),

      Dropcursor.configure({ width: 2 }),
      Gapcursor,

      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],

    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),

    editorProps: {
      attributes: {
        class: [
          "min-h-[380px]",
          "outline-none font-[Caveat] text-[20px] leading-[38px]",
          "text-slate-900 text-justify",
          "pt-[8px] pb-[6px] px-3",
          "bg-[#fdf3d6]",
          "bg-[linear-gradient(to_bottom,transparent_0,transparent_34px,rgba(99,102,241,0.14)_35px,transparent_36px)]",
          "bg-[size:100%_38px]",
          "[&_ul]:list-disc [&_ul]:pl-7 [&_ul]:my-0",
          "[&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:my-0",
          "[&_li]:my-0",
          "[&_p]:m-0",
          "[&_img]:block [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow [&_img]:my-3",
          "[&_a]:text-indigo-700 [&_a]:underline",
        ].join(" "),
      },

      handleDOMEvents: {
        mousedown: () => false,

        dblclick: (view, event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target || target.tagName !== "IMG") return false;

                const pos = view.posAtDOM(target, 0);
                const tr = view.state.tr.setSelection(
                    NodeSelection.create(view.state.doc, pos)
            );
            view.dispatch(tr);
            return true;
        },
        },

    },
  });

  // keep editor synced if value changes from outside (edit modal etc.)
  React.useEffect(() => {
    if (!editor) return;
    const next = value || "";
    const current = editor.getHTML();
    if (next !== current) editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  const insertImageUrls = (urls: string[]) => {
    if (!editor) return;

    urls.forEach((url) => {
        editor.chain().focus().setImage({ src: url }).run();
        editor.commands.enter();

        requestAnimationFrame(() => {
            if (!editor) return;
            const pos = editor.state.selection.to;
            editor.commands.setTextSelection(pos);
        });
    });
  };


  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleInsertImages = async (files: File[]) => {
    if (!editor || files.length === 0) return;

    if (onUploadImages) {
      const urls = await onUploadImages(files);
      insertImageUrls(urls);
      return;
    }

    const urls = await Promise.all(files.map(fileToDataUrl));
    insertImageUrls(urls);
  };

  const btnBase =
    "select-none rounded-md px-2.5 py-1 text-sm font-semibold " +
    "text-slate-900 opacity-100 " +
    "bg-white/70 hover:bg-white shadow-sm border border-slate-200";

  const btnActive = "bg-indigo-100 border-indigo-200 text-indigo-900";

  return (
    <div className="rounded-2xl border border-indigo-200 bg-[#fdf3d6] shadow-sm overflow-hidden">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-indigo-200 bg-[#f6e8be] px-3 py-2">
        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().toggleBold().run()} className={`${btnBase} ${editor?.isActive("bold") ? btnActive : ""}`}>
          B
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${btnBase} italic ${editor?.isActive("italic") ? btnActive : ""}`}>
          I
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`${btnBase} underline ${editor?.isActive("underline") ? btnActive : ""}`}>
          U
        </button>

        <div className="mx-1 h-6 w-px bg-indigo-300" />

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${btnBase} ${editor?.isActive("bulletList") ? btnActive : ""}`}>
          • List
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${btnBase} ${editor?.isActive("orderedList") ? btnActive : ""}`}>
          1. List
        </button>

        <div className="mx-1 h-6 w-px bg-indigo-300" />

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().setTextAlign("left").run()} className={`${btnBase} ${editor?.isActive({ textAlign: "left" }) ? btnActive : ""}`}>
          ⫷
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().setTextAlign("justify").run()} className={`${btnBase} ${editor?.isActive({ textAlign: "justify" }) ? btnActive : ""}`}>
          ≡
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().setTextAlign("center").run()} className={`${btnBase} ${editor?.isActive({ textAlign: "center" }) ? btnActive : ""}`}>
          ⇔
        </button>

        <button type="button" onMouseDown={keepFocus} onClick={() => editor?.chain().focus().setTextAlign("right").run()} className={`${btnBase} ${editor?.isActive({ textAlign: "right" }) ? btnActive : ""}`}>
          ⫸
        </button>

        {allowInsertImage && (
          <label onMouseDown={keepFocus} className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow">
            Insert Image
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                e.currentTarget.value = "";
                handleInsertImages(files);
              }}
            />
          </label>
        )}
      </div>

      <div className="prose border rounded p-3 min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
