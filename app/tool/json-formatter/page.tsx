import type { Metadata } from "next";
import Link from "next/link";
import { Braces, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { JsonFormatter } from "./jsonformatter";

export const metadata: Metadata = {
  title: "JSON Formatter | Kivora",
  description: "Format, validate and beautify your JSON data instantly.",
};

const STEPS = [
  "Paste your JSON into the input editor.",
  "Click Format JSON.",
  "Review the formatted result.",
  "Copy or download your formatted JSON.",
];

const FAQ = [
  {
    q: "What is JSON?",
    a: "JSON (JavaScript Object Notation) is a lightweight text format for storing and exchanging data. It's used by most web APIs and configuration files.",
  },
  {
    q: "Why should I format JSON?",
    a: "Formatted JSON uses indentation and line breaks, which makes it much easier to read, debug and review. Minified JSON is better for sending over a network.",
  },
  {
    q: "Does this tool validate JSON?",
    a: "Yes. If your JSON has a syntax error, the tool tells you what's wrong and, where possible, the line and column.",
  },
  {
    q: "Is my JSON data uploaded to a server?",
    a: "No. Formatting, minifying and validation all run in your browser, and your JSON is never sent anywhere.",
  },
];

export default function JsonFormatterPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[#64748B]"
        >
          <Link href="/" className="hover:text-[#2563EB]">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <Link
            href="/categories/developer"
            className="hover:text-[#2563EB]"
          >
            Developer Tools
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span aria-current="page" className="font-medium text-[#111827]">
            JSON Formatter
          </span>
        </nav>

        <header className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Braces className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#2563EB]">
              DEVELOPER TOOL
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#111827]">
              JSON Formatter
            </h1>
            <p className="mt-2 max-w-2xl text-[#64748B]">
              Format, validate and beautify your JSON data instantly. Make messy
              JSON readable and easier to work with.
            </p>
          </div>
        </header>

        <JsonFormatter />

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">How to use the JSON Formatter</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-[#64748B]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-[#2563EB]">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">Frequently asked questions</h2>
            <dl className="mt-4 divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB]">
              {FAQ.map((item) => (
                <div key={item.q} className="px-4 py-3">
                  <dt className="font-medium text-[#111827]">{item.q}</dt>
                  <dd className="mt-1 text-sm text-[#64748B]">{item.a}</dd>
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