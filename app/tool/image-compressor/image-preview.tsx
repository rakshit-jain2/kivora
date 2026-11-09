"use client";

import { useState } from "react";

interface Props {
  beforeUrl: string;
  afterUrl: string;
  width: number;
  height: number;
}

export function ImagePreview({ beforeUrl, afterUrl, width, height }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div>
      <div
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-[#E5E7EB] bg-slate-50"
        style={{ aspectRatio: `${width} / ${height}`, maxHeight: 420 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt="Compressed" className="absolute inset-0 h-full w-full object-contain" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt="Original"
          className="absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Original</span>
        <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Compressed</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Before and after comparison"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="mt-2 text-center text-xs text-[#64748B]">Drag across the image to compare</p>
    </div>
  );
}