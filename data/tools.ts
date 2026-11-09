import type { LucideIcon } from "lucide-react";
import {
  Braces,
  FileImage,
  FileText,
  GitCompareArrows,
  ImageDown,
  ImageUp,
  Link,
  Merge,
  QrCode,
  ScanText,
  Split,
  Table2,
  Type,
} from "lucide-react";

export type ToolCategory = "Developer" | "Image" | "PDF" | "Text";
export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
};
export type ToolCategoryInfo = {
  slug: string;
  name: string;
  description: string;
  count: string;
  icon: LucideIcon;
  tools: string[];
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate and beautify your JSON data.",
    category: "Developer",
    icon: Braces,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create downloadable QR codes in seconds.",
    category: "Developer",
    icon: QrCode,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file sizes without unnecessary quality loss.",
    category: "Image",
    icon: ImageDown,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters and sentences instantly.",
    category: "Text",
    icon: Type,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder & Decoder",
    description: "Encode and decode text with ease.",
    category: "Developer",
    icon: ScanText,
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into one document.",
    category: "PDF",
    icon: Merge,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Safely encode and decode URLs for the web.",
    category: "Developer",
    icon: Link,
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV",
    description: "Turn structured JSON into a clean CSV file.",
    category: "Developer",
    icon: Table2,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to the exact dimensions you need.",
    category: "Image",
    icon: ImageUp,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert images between popular file formats.",
    category: "Image",
    icon: FileImage,
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description: "Extract pages from a PDF in a few clicks.",
    category: "PDF",
    icon: Split,
  },
  {
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    description: "Compare two pieces of text and spot every change.",
    category: "Text",
    icon: GitCompareArrows,
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview clean Markdown documents.",
    category: "Text",
    icon: FileText,
  },
];

export const categories: ToolCategoryInfo[] = [
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Clean up, convert and inspect your code and data.",
    count: "5 tools",
    icon: Braces,
    tools: ["JSON Formatter", "Base64 Encoder", "URL Encoder", "JSON to CSV"],
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Make everyday image tasks quick and effortless.",
    count: "3 tools",
    icon: ImageUp,
    tools: ["Image Compressor", "Image Resizer", "Image Converter"],
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Handle your documents without the usual friction.",
    count: "2 tools",
    icon: FileText,
    tools: ["PDF Merger", "PDF Splitter"],
  },
  {
    slug: "text",
    name: "Text & Productivity",
    description: "Write, compare and refine your words with focus.",
    count: "3 tools",
    icon: Type,
    tools: ["Word Counter", "Text Diff Checker", "Markdown Editor"],
  },
];