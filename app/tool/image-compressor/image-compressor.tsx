"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { CompressionSettings } from "./compression-settings";
import { ImagePreview } from "./image-preview";
import { CompressionResult } from "./compression-result";
import {
  MAX_FILES,
  compressImage,
  createZip,
  downloadBlob,
  formatBytes,
  mimeLabel,
  readImageDimensions,
  uniqueNames,
  validateFile,
  type CompressedImage,
  type OutputFormat,
} from "./image-utils";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  status: "ready" | "processing" | "done" | "error";
  result?: CompressedImage;
  error?: string;
}

const tick = () => new Promise<void>((r) => setTimeout(r, 0));
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function ImageCompressor() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [zipping, setZipping] = useState(false);
  const itemsRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Revoke every object URL on unmount.
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => {
        URL.revokeObjectURL(i.previewUrl);
        if (i.result) URL.revokeObjectURL(i.result.url);
      });
    };
  }, []);

  const patch = (id: string, changes: Partial<ImageItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));

  const addFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    const errs: string[] = [];
    const accepted: File[] = [];
    const room = MAX_FILES - itemsRef.current.length;

    for (const f of files) {
      const err = validateFile(f);
      if (err) errs.push(`${f.name}: ${err}`);
      else if (accepted.length >= room) errs.push(`${f.name}: limit of ${MAX_FILES} images reached.`);
      else accepted.push(f);
    }

    const added: ImageItem[] = [];
    for (const file of accepted) {
      try {
        const { width, height } = await readImageDimensions(file);
        added.push({ id: makeId(), file, previewUrl: URL.createObjectURL(file), width, height, status: "ready" });
      } catch {
        errs.push(`${file.name}: couldn't be read. The file may be corrupted.`);
      }
    }
    setItems((prev) => [...prev, ...added]);
    setErrors(errs);
  }, []);

  const removeItem = (id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.previewUrl);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    itemsRef.current.forEach((i) => {
      URL.revokeObjectURL(i.previewUrl);
      if (i.result) URL.revokeObjectURL(i.result.url);
    });
    setItems([]);
    setErrors([]);
  };

  const handleCompress = async () => {
    const targets = [...itemsRef.current];
    if (!targets.length) return;
    setBusy(true);
    setErrors([]);
    setProgress({ done: 0, total: targets.length });

    for (let i = 0; i < targets.length; i++) {
      const item = targets[i];
      const old = itemsRef.current.find((x) => x.id === item.id)?.result;
      if (old) URL.revokeObjectURL(old.url);
      patch(item.id, { status: "processing", result: undefined, error: undefined });
      await tick(); // let the UI paint between images

      try {
        const r = await compressImage(item.file, { quality: quality / 100, format });
        patch(item.id, { status: "done", result: { ...r, url: URL.createObjectURL(r.blob) } });
      } catch (err) {
        patch(item.id, { status: "error", error: err instanceof Error ? err.message : "Compression failed." });
      }
      setProgress({ done: i + 1, total: targets.length });
    }
    setBusy(false);
    setProgress(null);
  };

  const done = items.filter((i) => i.status === "done" && i.result);

  const downloadAll = async () => {
    if (!done.length) return;
    if (done.length === 1) {
      const r = done[0].result!;
      return downloadBlob(r.blob, r.filename);
    }
    setZipping(true);
    try {
      const names = uniqueNames(done.map((i) => i.result!.filename));
      const zip = await createZip(done.map((i, idx) => ({ name: names[idx], blob: i.result!.blob })));
      downloadBlob(zip, "compressed-images.zip");
    } catch {
      setErrors(["Couldn't create the ZIP file. Try downloading images individually."]);
    } finally {
      setZipping(false);
    }
  };

  const totalOriginal = done.reduce((n, i) => n + i.file.size, 0);
  const totalCompressed = done.reduce((n, i) => n + i.result!.blob.size, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <ImageUpload onFiles={addFiles} disabled={busy} />

        {errors.length > 0 && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" aria-hidden /> Some files couldn&apos;t be used
            </p>
            <ul className="mt-1 list-disc pl-6 text-red-700">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {items.length === 0 ? (
          <p className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-6 text-center text-sm text-[#64748B]">
            No images yet. Add some above to get started.
          </p>
        ) : (
          <>
            {done.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  {done.length} image{done.length > 1 ? "s" : ""} compressed: {formatBytes(totalOriginal)} → {formatBytes(totalCompressed)}
                </p>
                <button
                  type="button"
                  onClick={downloadAll}
                  disabled={zipping}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  {zipping ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
                  {done.length > 1 ? "Download all (ZIP)" : "Download"}
                </button>
              </div>
            )}

            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt="" className="h-14 w-14 shrink-0 rounded-md border border-[#E5E7EB] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#111827]">{item.file.name}</p>
                      <p className="text-xs text-[#64748B]">
                        {mimeLabel(item.file.type)} · {item.width}×{item.height} · {formatBytes(item.file.size)}
                      </p>
                    </div>
                    {item.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" aria-label="Compressing" />}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={busy}
                      aria-label={`Remove ${item.file.name}`}
                      className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-40"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  {item.status === "error" && (
                    <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> {item.error}
                    </p>
                  )}

                  {item.status === "done" && item.result && (
                    <div className="mt-4">
                      <ImagePreview beforeUrl={item.previewUrl} afterUrl={item.result.url} width={item.width} height={item.height} />
                      <CompressionResult
                        originalSize={item.file.size}
                        result={item.result}
                        onDownload={() => downloadBlob(item.result!.blob, item.result!.filename)}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={clearAll}
              disabled={busy}
              className="text-sm text-[#64748B] underline-offset-2 hover:text-[#111827] hover:underline disabled:opacity-40"
            >
              Remove all images
            </button>
          </>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CompressionSettings
          quality={quality}
          format={format}
          onQuality={setQuality}
          onFormat={setFormat}
          onCompress={handleCompress}
          busy={busy}
          progress={progress}
          disabled={items.length === 0}
        />
        {done.length > 0 && !busy && (
          <p className="mt-3 text-xs text-[#64748B]">Changed a setting? Click Compress images again to apply it.</p>
        )}
      </aside>
    </div>
  );
}