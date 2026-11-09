"use client";

import { Loader2, Minimize2 } from "lucide-react";
import type { OutputFormat } from "./image-utils";

interface Props {
  quality: number;
  format: OutputFormat;
  onQuality: (q: number) => void;
  onFormat: (f: OutputFormat) => void;
  onCompress: () => void;
  busy: boolean;
  progress: { done: number; total: number } | null;
  disabled: boolean;
}

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
];

export function CompressionSettings({ quality, format, onQuality, onFormat, onCompress, busy, progress, disabled }: Props) {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[#111827]">Compression settings</h2>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="quality" className="text-sm text-[#64748B]">Quality</label>
          <span className="text-sm font-semibold text-[#111827]">{quality}%</span>
        </div>
        <input
          id="quality"
          type="range"
          min={10}
          max={100}
          step={1}
          value={quality}
          onChange={(e) => onQuality(Number(e.target.value))}
          disabled={busy}
          className="mt-2 w-full accent-[#2563EB]"
        />
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      <fieldset className="mt-5" disabled={busy}>
        <legend className="text-sm text-[#64748B]">Output format</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={format === f.value}
              onClick={() => onFormat(f.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                format === f.value
                  ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                  : "border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-[#64748B]">
        PNG is lossless, so the quality slider has no effect on PNG output and the file may even get larger.
        For smaller files, choose JPEG or WebP. Transparent areas become white in JPEG.
      </p>

      <button
        type="button"
        onClick={onCompress}
        disabled={disabled || busy}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Minimize2 className="h-4 w-4" aria-hidden />}
        {busy && progress ? `Compressing ${progress.done}/${progress.total}…` : "Compress images"}
      </button>

      {busy && progress && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
          <div className="h-full bg-[#2563EB] transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}
    </section>
  );
}