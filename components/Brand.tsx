import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/"
      className="brand"
      aria-label="Kivora home"
    >
      <span className="brand-mark">
        <Sparkles size={16} strokeWidth={2.4} />
      </span>
      <span>Kivora</span>
    </Link>
  );
}