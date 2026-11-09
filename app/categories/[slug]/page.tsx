import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { categories, tools } from "@/data/tools";

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  const categoryTools = tools.filter((tool) => tool.category.toLowerCase() === slug);

  return (
    <>
      <Navbar />
      <main className="category-page">
        <div className="category-page-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to Kivora
          </Link>
          <span className="section-kicker">Category</span>
          <h1>{category?.name ?? "Category"}</h1>
          <p>
            {category?.description ??
              "Explore useful tools for your everyday work."}
          </p>
        </div>
        <section className="category-tools">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Built for your workflow</span>
              <h2>{category?.name ?? "Available tools"}</h2>
            </div>
            <p>
              {categoryTools.length}{" "}
              {categoryTools.length === 1 ? "tool" : "tools"} available
            </p>
          </div>
          {categoryTools.length > 0 ? (
            <div className="tools-grid">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Tools coming soon</h3>
              <p>We&apos;re preparing useful tools for this category.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CategoryPageFallback />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

function CategoryPageFallback() {
  return (
    <>
      <Navbar />
      <main className="category-page">
        <div className="category-page-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to Kivora
          </Link>
          <span className="section-kicker">Category</span>
          <h1>Loading category</h1>
        </div>
      </main>
    </>
  );
}