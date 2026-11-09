"use client";

import { useMemo } from "react";
import { Check, Copy, Download } from "lucide-react";
import { tokenizeJson, type TokenType } from "./json-utils";

const TOKEN_CLASS: Record<TokenType, string> = {
  key: "text-[#2563EB]",
  string: "text-emerald-600",
  number: "text-amber-600",
  boolean: "text-violet-600",
  null: "text-violet-600",
  plain: "text-[#111827]",
};

// Skip highlighting for very large outputs to keep the UI responsive.
const HIGHLIGHT_LIMIT = 200_000;

interface JsonOutputProps {
  output: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function JsonOutput({ output, copied, onCopy, onDownload }: JsonOutputProps) {
  const tokens = useMemo(
    () => (output && output.length <= HIGHLIGHT_LIMIT ? tokenizeJson(output) : null),
    [output],
  );
  const btn =
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#64748B] transition hover:bg-slate-50 hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#111827]">Formatted Output</h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onCopy} disabled={!output} className={btn}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={onDownload} disabled={!output} className={btn}>
            <Download className="h-3.5 w-3.5" aria-hidden /> Download JSON
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50/50" tabIndex={0} aria-label="Formatted JSON output">
        {output ? (
          <pre className="whitespace-pre-wrap wrap-break-words p-4 font-mono text-sm leading-6">
            {tokens
              ? tokens.map((t, i) => (
                  <span key={i} className={TOKEN_CLASS[t.type]}>
                    {t.text}
                  </span>
                ))
              : output}
          </pre>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[#64748B]">
            Your formatted JSON will appear here.
            <br />
            Paste JSON and click Format JSON.
          </div>
        )}
      </div>
      <footer className="border-t border-[#E5E7EB] px-4 py-2 text-xs text-[#64748B]">
        {output ? `${output.length.toLocaleString()} characters` : "No output yet"}
      </footer>
    </section>
  );
}