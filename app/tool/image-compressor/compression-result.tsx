"use client";

import { Download } from "lucide-react";
import { formatBytes, mimeLabel, type CompressedImage } from "./image-utils";

interface Props {
  originalSize: number;
  result: CompressedImage;
  onDownload: () => void;
}

export function CompressionResult({ originalSize, result, onDownload }: Props) {
  const diff = originalSize - result.blob.size;
  const percent = Math.abs(Math.round((diff / originalSize) * 100));
  const larger = diff < 0;
  const same = diff === 0;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] bg-slate-50/60 p-4">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-[#64748B]">Original</dt>
          <dd className="font-medium text-[#111827]">{formatBytes(originalSize)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#64748B]">Compressed</dt>
          <dd className="font-medium text-[#111827]">{formatBytes(result.blob.size)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#64748B]">{larger ? "Size change" : "Saved"}</dt>
          <dd className={`font-medium ${larger ? "text-amber-600" : "text-emerald-600"}`}>
            {same ? "No change" : larger ? `+${percent}% larger` : `${percent}% smaller`}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#64748B]">Output</dt>
          <dd className="font-medium text-[#111827]">
            {result.width}×{result.height} · {mimeLabel(result.mime)}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onDownload}
        className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <Download className="h-4 w-4" aria-hidden /> Download
      </button>
      {larger && (
        <p className="w-full text-xs text-amber-700">
          The compressed file is larger than the original. Try a lower quality or switch the output to JPEG or WebP.
        </p>
      )}
    </div>
  );
}