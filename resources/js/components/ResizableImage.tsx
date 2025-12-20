import React, { useEffect, useMemo, useRef, useState } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ResizableImageView(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const width = node.attrs.width as number | null;
  const height = node.attrs.height as number | null;

  const style = useMemo<React.CSSProperties>(() => {
    // If user resized, use px. Otherwise keep natural size but limit to container.
    return {
      width: width ? `${width}px` : "auto",
      height: height ? `${height}px` : "auto",
      maxWidth: "100%",
      display: "block",
    };
  }, [width, height]);

  const [dragging, setDragging] = useState(false);

  const startRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    aspect: number;
    corner: "se" | "sw" | "ne" | "nw";
  } | null>(null);

  const onMouseDownHandle = (corner: "se" | "sw" | "ne" | "nw") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const imgEl = wrapperRef.current?.querySelector("img");
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const aspect = startW / Math.max(1, startH);

    startRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW,
      startH,
      aspect,
      corner,
    };

    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const st = startRef.current;
      if (!st) return;

      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;

      // Compute delta based on which corner is dragged
      let nextW = st.startW;
      let nextH = st.startH;

      if (st.corner === "se") {
        nextW = st.startW + dx;
        nextH = st.startH + dy;
      } else if (st.corner === "sw") {
        nextW = st.startW - dx;
        nextH = st.startH + dy;
      } else if (st.corner === "ne") {
        nextW = st.startW + dx;
        nextH = st.startH - dy;
      } else if (st.corner === "nw") {
        nextW = st.startW - dx;
        nextH = st.startH - dy;
      }

      // Keep reasonable limits
      nextW = clamp(nextW, 80, 1400);
      nextH = clamp(nextH, 80, 1400);

      updateAttributes({
        width: Math.round(nextW),
        height: Math.round(nextH),
      });
    };

    const onUp = () => {
      setDragging(false);
      startRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updateAttributes]);


  return (
    <NodeViewWrapper 
      className="tiptap-resizable-image"
      draggable
      data-drag-handle
      contentEditable={false}
      onDragStart={(e: DragEvent) => {
        e.dataTransfer?.setData("text/plain", ""); 
        e.dataTransfer!.effectAllowed = "move";
      }}
    >
      <div className="relative inline-block" ref={wrapperRef} contentEditable={false}>
        <img src={node.attrs.src} alt={node.attrs.alt || ""} title={node.attrs.title || ""} style={style} draggable={false} />

        {/* Show handles only when selected */}
        {selected && (
          <>
            <span className="resize-handle tl" onMouseDown={onMouseDownHandle("nw")} />
            <span className="resize-handle tr" onMouseDown={onMouseDownHandle("ne")} />
            <span className="resize-handle bl" onMouseDown={onMouseDownHandle("sw")} />
            <span className="resize-handle br" onMouseDown={onMouseDownHandle("se")} />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImageNodeView = ReactNodeViewRenderer(ResizableImageView);
