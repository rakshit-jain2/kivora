import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const href =
    tool.slug === "json-formatter"
      ? "/tool/json-formatter"
      : tool.slug === "image-compressor"
        ? "/tool/image-compressor"
      : `/tools/${tool.slug}`;

  return (
    <Link href={href} className="tool-card">
      <div className="tool-card-top">
        <span className="tool-icon">
          <Icon size={20} />
        </span>
        <ArrowUpRight size={18} className="card-arrow" />
      </div>
      <div>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
      <span className="category-label">{tool.category}</span>
    </Link>
  );
}