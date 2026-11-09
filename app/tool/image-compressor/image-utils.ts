export type OutputFormat = "original" | "image/jpeg" | "image/webp";
export type ImageMime = "image/jpeg" | "image/png" | "image/webp";

export const ACCEPTED_TYPES: ImageMime[] = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB per image
export const MAX_FILES = 20;

export interface CompressOptions {
  quality: number; // 0.1 – 1
  format: OutputFormat;
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  mime: ImageMime;
  filename: string;
}

export interface CompressedImage extends CompressResult {
  url: string;
}

const EXTENSIONS: Record<ImageMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const LABELS: Record<ImageMime, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export const mimeLabel = (mime: string) => LABELS[mime as ImageMime] ?? mime;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type as ImageMime)) {
    return "Unsupported format. Use JPG, PNG or WebP.";
  }
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (max ${formatBytes(MAX_FILE_SIZE)}).`;
  }
  return null;
}

interface LoadedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

async function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file);
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      // fall through to <img> decoding
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("This image couldn't be decoded."));
      el.src = url;
    });
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function readImageDimensions(file: File) {
  const img = await loadImage(file);
  const { width, height } = img;
  img.close();
  return { width, height };
}

export async function compressImage(file: File, opts: CompressOptions): Promise<CompressResult> {
  const target: ImageMime = opts.format === "original" ? (file.type as ImageMime) : opts.format;
  const img = await loadImage(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas isn't available in this browser.");

    // JPEG has no transparency: paint white so transparent areas don't turn black.
    if (target === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, img.width, img.height);
    }
    ctx.drawImage(img.source, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, target, opts.quality),
    );
    if (!blob) throw new Error("The image is too large for this browser to process.");
    // Some browsers silently fall back to PNG when they can't encode a format.
    if (blob.type !== target) {
      throw new Error(`Your browser can't export ${mimeLabel(target)}. Try JPEG instead.`);
    }

    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return {
      blob,
      width: img.width,
      height: img.height,
      mime: target,
      filename: `${base}-compressed.${EXTENSIONS[target]}`,
    };
  } finally {
    img.close();
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function uniqueNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    if (count === 0) return name;
    const dot = name.lastIndexOf(".");
    return `${name.slice(0, dot)}-${count + 1}${name.slice(dot)}`;
  });
}

/* ---- Minimal store-only ZIP writer (no dependency) ---- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export async function createZip(entries: { name: string; blob: Blob }[]): Promise<Blob> {
  const enc = new TextEncoder();
  const d = new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();

  const parts: BlobPart[] = [];
  const central: BlobPart[] = [];
  let offset = 0;

  for (const e of entries) {
    const data = new Uint8Array(await e.blob.arrayBuffer());
    const name = enc.encode(e.name);
    const crc = crc32(data);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint16(8, 0, true); // stored
    local.setUint16(10, time, true);
    local.setUint16(12, date, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(local, name, e.blob);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, 0x0800, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, time, true);
    cd.setUint16(14, date, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, data.length, true);
    cd.setUint32(24, data.length, true);
    cd.setUint16(28, name.length, true);
    cd.setUint32(42, offset, true);
    central.push(cd, name);

    offset += 30 + name.length + data.length;
  }

  const cdSize = central.reduce((n, p) => n + (p instanceof Uint8Array ? p.length : (p as DataView).byteLength), 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}