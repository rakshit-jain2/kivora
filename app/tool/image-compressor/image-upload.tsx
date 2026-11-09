"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ onFiles, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const open = () => !disabled && inputRef.current?.click();

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    onFiles(Array.from(e.dataTransfer.files));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images"
      aria-disabled={disabled}
      onClick={open}
      onKeyDown={onKeyDown}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
        dragging ? "border-[#2563EB] bg-blue-50" : "border-[#E5E7EB] bg-white hover:border-slate-300 hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
        <ImagePlus className="h-6 w-6" aria-hidden />
      </div>
      <p className="mt-4 font-medium text-[#111827]">Drag and drop images here</p>
      <p className="mt-1 text-sm text-[#64748B]">JPG, PNG or WebP · up to 25 MB each · up to 20 images</p>
      <span className="mt-4 inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm">
        Browse files
      </span>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = ""; // allow re-selecting the same file
        }}
      />
    </div>
  );
}