"use client";

import { FileJson, Trash2 } from "lucide-react";

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onSample: () => void;
  onClear: () => void;
  hasError: boolean;
}

export function JsonInput({ value, onChange, onSample, onClear, hasError }: JsonInputProps) {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#111827]">JSON Input</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSample}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#64748B] transition hover:bg-slate-50 hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <FileJson className="h-3.5 w-3.5" aria-hidden /> Sample JSON
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!value}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#64748B] transition hover:bg-slate-50 hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Clear
          </button>
        </div>
      </header>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here..."
        spellCheck={false}
        aria-label="JSON input"
        aria-invalid={hasError}
        className={`min-h-0 flex-1 resize-none rounded-none bg-white p-4 font-mono text-sm leading-6 text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset ${
          hasError ? "focus:ring-red-500" : "focus:ring-[#2563EB]"
        }`}
      />
      <footer className="border-t border-[#E5E7EB] px-4 py-2 text-xs text-[#64748B]">
        {value.length.toLocaleString()} characters
      </footer>
    </section>
  );
}