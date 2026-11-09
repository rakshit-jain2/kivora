import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ImageDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ImageCompressor } from "./image-compressor";

export const metadata: Metadata = {
  title: "Image Compressor | Kivora",
  description: "Compress images online without unnecessarily sacrificing quality.",
};

const STEPS = [
  "Drop your JPG, PNG or WebP images into the upload area.",
  "Choose a quality level and an output format.",
  "Click Compress images and compare the before and after.",
  "Download each image, or download them all as a ZIP.",
];

const FAQ = [
  { q: "Are my images uploaded to a server?", a: "No. Compression runs entirely in your browser, and your images never leave your device." },
  { q: "Which quality should I choose?", a: "70–80% usually gives a big size reduction with little visible difference. Lower it for smaller files, raise it for photos where detail matters." },
  { q: "Why didn't my PNG get smaller?", a: "PNG is a lossless format, so the quality slider doesn't change it. For smaller files, switch the output format to WebP or JPEG." },
  { q: "Can the compressed image be larger than the original?", a: "Sometimes, especially for files that were already well optimized. The tool tells you when this happens so you can keep the original instead." },
  { q: "Why does JPEG turn transparency white?", a: "JPEG doesn't support transparency, so transparent areas are filled with white. Use WebP or keep the original format to preserve transparency." },
];

export default function ImageCompressorPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#2563EB]">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <Link href="/categories/image" className="hover:text-[#2563EB]">Image Tools</Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span aria-current="page" className="font-medium text-[#111827]">Image Compressor</span>
        </nav>

        <header className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <ImageDown className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">Image Compressor</h1>
            <p className="mt-2 max-w-2xl text-[#64748B]">
              Compress images online without unnecessarily sacrificing quality.
            </p>
          </div>
        </header>

        <ImageCompressor />

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">How to use the Image Compressor</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-[#64748B]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-[#2563EB]">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">Frequently asked questions</h2>
            <dl className="mt-4 divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
              {FAQ.map((f) => (
                <div key={f.q} className="px-4 py-3">
                  <dt className="font-medium text-[#111827]">{f.q}</dt>
                  <dd className="mt-1 text-sm text-[#64748B]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}