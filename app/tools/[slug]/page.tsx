import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

async function ToolContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "json-formatter") {
    redirect("/tool/json-formatter");
  }
  if (slug === "image-compressor") {
    redirect("/tool/image-compressor");
  }

  const tool = tools.find((item) => item.slug === slug);
  return (
    <main className="placeholder-page">
      <div className="placeholder-inner">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to Kivora
        </Link>
        <span className="placeholder-icon">
          <Sparkles size={24} />
        </span>
        <span className="section-kicker">{tool?.category ?? "Tool"}</span>
        <h1>{tool?.name ?? "Tool coming soon"}</h1>
        <p>
          {tool?.description ??
            "This useful tool is still being prepared for the workspace."}
        </p>
        <div className="placeholder-note">
          This tool page is ready for its focused workspace.
        </div>
      </div>
    </main>
  );
}

export default function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ToolPageFallback />}>
      <ToolContent params={params} />
    </Suspense>
  );
}

function ToolPageFallback() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-inner">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to Kivora
        </Link>
        <span className="placeholder-icon">
          <Sparkles size={24} />
        </span>
        <span className="section-kicker">Tool</span>
        <h1>Loading tool</h1>
      </div>
    </main>
  );
}