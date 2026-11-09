"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, AlignLeft, CheckCircle2, Info, Minimize2, ShieldCheck, Trash2 } from "lucide-react";
import { JsonInput } from "./json-input";
import { JsonOutput } from "./json-output";
import { SAMPLE_JSON, formatJson, minifyJson, validateJson, type JsonResult } from "./json-utils";

type Status =
  | { kind: "idle" }
  | { kind: "success" | "info"; message: string }
  | { kind: "error"; message: string; hint?: string; line?: number; column?: number };

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"formatted" | "minified">("formatted");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const fail = (r: Extract<JsonResult, { ok: false }>) => {
    setStatus({ kind: "error", ...r.error });
    if (!input.trim()) setStatus({ kind: "info", message: r.error.message });
  };

  const handleFormat = () => {
    const r = formatJson(input);
    if (!r.ok) return fail(r);
    setOutput(r.value);
    setMode("formatted");
    setStatus({ kind: "success", message: "JSON formatted successfully." });
  };

  const handleMinify = () => {
    const r = minifyJson(input);
    if (!r.ok) return fail(r);
    setOutput(r.value);
    setMode("minified");
    setStatus({ kind: "success", message: "JSON minified successfully." });
  };

  const handleValidate = () => {
    const r = validateJson(input);
    if (!r.ok) return fail(r);
    setStatus({ kind: "success", message: "Valid JSON. No syntax errors found." });
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
    setStatus({ kind: "idle" });
  };

  const handleSample = () => {
    setInput(SAMPLE_JSON);
    setStatus({ kind: "info", message: "Sample loaded. Click Format JSON to try it." });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setStatus({ kind: "success", message: "Output copied to clipboard." });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus({ kind: "error", message: "Couldn't copy automatically.", hint: "Select the output text and copy it manually." });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mode}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const primary = `${base} bg-[#2563EB] text-white shadow-sm hover:bg-blue-700`;
  const secondary = `${base} border border-[#E5E7EB] bg-white text-[#111827] shadow-sm hover:bg-slate-50`;
  const ghost = `${base} text-[#64748B] hover:bg-slate-100 hover:text-[#111827]`;
  const empty = !input.trim();

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <button type="button" onClick={handleFormat} disabled={empty} className={primary}>
          <AlignLeft className="h-4 w-4" aria-hidden /> Format JSON
        </button>
        <button type="button" onClick={handleMinify} disabled={empty} className={secondary}>
          <Minimize2 className="h-4 w-4" aria-hidden /> Minify
        </button>
        <button type="button" onClick={handleValidate} disabled={empty} className={secondary}>
          <ShieldCheck className="h-4 w-4" aria-hidden /> Validate
        </button>
        <button type="button" onClick={handleClear} disabled={!input && !output} className={ghost}>
          <Trash2 className="h-4 w-4" aria-hidden /> Clear
        </button>
      </div>

      <div role="status" aria-live="polite" className="mb-4 min-h-11">
        {status.kind === "success" && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden /> {status.message}
          </p>
        )}
        {status.kind === "info" && (
          <p className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
            <Info className="h-4 w-4 shrink-0" aria-hidden /> {status.message}
          </p>
        )}
        {status.kind === "error" && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">
                {status.message}
                {status.line !== undefined && status.column !== undefined && ` (line ${status.line}, column ${status.column})`}
              </p>
              {status.hint && <p className="mt-0.5 text-red-700">{status.hint}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="grid h-160 grid-rows-2 gap-4 lg:h-130 lg:grid-cols-2 lg:grid-rows-1">
        <JsonInput
          value={input}
          onChange={setInput}
          onSample={handleSample}
          onClear={handleClear}
          hasError={status.kind === "error"}
        />
        <JsonOutput output={output} copied={copied} onCopy={handleCopy} onDownload={handleDownload} />
      </div>
    </div>
  );
}