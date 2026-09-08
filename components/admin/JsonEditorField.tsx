"use client";

import { useEffect, useRef, useState } from "react";
import "jsoneditor/dist/jsoneditor.css";

type JsonEditorFieldProps = {
  value: unknown;
  onChange?: (value: unknown) => void;
  height?: string;
};

type EditorInstance = {
  get: () => unknown;
  set: (value: unknown) => void;
  update: (value: unknown) => void;
  destroy: () => void;
};

export default function JsonEditorField({
  value,
  onChange,
  height = "280px",
}: JsonEditorFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    void import("jsoneditor").then(({ default: JSONEditor }) => {
      if (destroyed || !containerRef.current || editorRef.current) return;

      const editor = new JSONEditor(containerRef.current, {
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

      editor.set(value ?? null);
      editorRef.current = editor;
      setReady(true);
    });

    return () => {
      destroyed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready || !editorRef.current) return;

    try {
      const current = editorRef.current.get();
      if (JSON.stringify(current) !== JSON.stringify(value)) {
        editorRef.current.update(value ?? null);
      }
    } catch {
      editorRef.current.set(value ?? null);
    }
  }, [value, ready]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden [&_.jsoneditor]:border-0 [&_.jsoneditor-menu]:bg-slate-50">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
