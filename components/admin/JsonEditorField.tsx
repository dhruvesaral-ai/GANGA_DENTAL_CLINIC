"use client";

import { useEffect, useRef } from "react";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

type JsonEditorFieldProps = {
  value: unknown;
  onChange?: (value: unknown) => void;
  height?: string;
};

export default function JsonEditorField({
  value,
  onChange,
  height = "280px",
}: JsonEditorFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JSONEditor | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    editorRef.current = new JSONEditor(containerRef.current, {
      mode: "code",
      modes: ["code", "tree", "form"],
      onChange: () => {
        if (!editorRef.current) return;
        try {
          onChangeRef.current?.(editorRef.current.get());
        } catch {
          // Ignore invalid JSON while typing
        }
      },
    });

    editorRef.current.set(value ?? null);

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    try {
      const current = editorRef.current.get();
      if (JSON.stringify(current) !== JSON.stringify(value)) {
        editorRef.current.update(value ?? null);
      }
    } catch {
      editorRef.current.set(value ?? null);
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden [&_.jsoneditor]:border-0 [&_.jsoneditor-menu]:bg-slate-50">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
