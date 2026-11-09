import { ArrowRight, Check, Command, LockKeyhole, MousePointer2, Zap } from "lucide-react";
import Link from "next/link";
import { categories, tools } from "@/data/tools";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";

const features = [
  {
    title: "Fast & Simple",
    description: "Get things done quickly with tools designed to be easy to use.",
    icon: Zap,
  },
  {
    title: "Privacy Conscious",
    description:
      "Where possible, files are processed directly in your browser instead of being uploaded to a server.",
    icon: LockKeyhole,
  },
  {
    title: "Free to Use",
    description: "Access useful everyday tools without mandatory registration.",
    icon: Check,
  },
];

export function HeroSection({
  query,
  searchRef,
  onChange,
}: {
  query: string;
  searchRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
}) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Your everyday toolkit
          </span>
          <h1>
            Everything you need.
            <br />
            <span>Nothing you don&apos;t.</span>
          </h1>
          <p>
            Discover simple, fast and free online tools for your everyday
            tasks. From developer utilities to image and PDF tools, get things
            done without the clutter.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#tools">
              Explore all tools <ArrowRight size={17} />
            </Link>
            <Link className="button button-quiet" href="/about">
              Learn more
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-panel">
            <div className="panel-top">
              <span className="panel-dots">
                <i />
                <i />
                <i />
              </span>
              <span>kivora / workspace</span>
            </div>
            <div className="panel-content">
              <div className="panel-line panel-line-long" />
              <div className="panel-line panel-line-medium" />
              <div className="panel-line panel-line-short" />
              <div className="panel-status">
                <span>
                  <span className="status-dot" />
                  Ready when you are
                </span>
                <Command size={15} />
              </div>
            </div>
          </div>
          <div className="float-chip chip-top">
            <MousePointer2 size={15} /> Quick tools
          </div>
          <div className="float-chip chip-bottom">
            <span className="mini-check">
              <Check size={12} />
            </span>{" "}
            No sign-up needed
          </div>
        </div>
      </div>
      <div className="hero-search-wrap">
        <SearchBar value={query} onChange={onChange} inputRef={searchRef} />
      </div>
    </section>
  );
}

export function CategorySection() {
  return (
    <section className="section" id="categories">
      <SectionHeading
        kicker="Browse your way"
        title="Explore by category"
        description="Find the right tool for whatever you&apos;re working on."
      />
      <div className="category-grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              href={`/categories/${category.slug}`}
              className="category-card"
              key={category.slug}
            >
              <span className="category-icon">
                <Icon size={21} />
              </span>
              <div className="category-card-body">
                <div className="category-card-title">
                  <h3>{category.name}</h3>
                  <ArrowRight size={18} />
                </div>
                <p>{category.description}</p>
                <span className="category-count">{category.count}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ToolsSection({
  query,
  visibleTools,
  onChange,
  onClear,
}: {
  query: string;
  visibleTools: typeof tools;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="section tools-section" id="tools">
      <SectionHeading
        kicker="The essentials"
        title="Popular tools"
        description="Everything you need, just a click away."
      />
      <div className="tool-search-row">
        <SearchBar value={query} onChange={onChange} compact />
        <span className="result-count">
          {query
            ? `${visibleTools.length} ${
                visibleTools.length === 1 ? "tool" : "tools"
              } found`
            : "Showing 6 tools"}
        </span>
      </div>
      <div className="tools-grid">
        {visibleTools.map((tool) => (
          <ToolCard tool={tool} key={tool.slug} />
        ))}
      </div>
      {visibleTools.length === 0 && (
        <div className="empty-state">
          <h3>No tools found</h3>
          <p>Try a different search term or browse by category.</p>
          <button className="text-button" onClick={onClear}>
            Clear search <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="section why-section">
      <SectionHeading
        kicker="A better baseline"
        title="Simple tools. Better workflows."
        description="Designed to stay out of the way, so your work can stay in focus."
      />
      <div className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div className="feature" key={feature.title}>
              <span className="feature-icon">
                <Icon size={19} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <div>
        <span className="section-kicker">Less friction, more done</span>
        <h2>Ready to simplify your workflow?</h2>
        <p>Explore the tools and get more done with less effort.</p>
      </div>
      <Link className="button button-light" href="#tools">
        Explore all tools <ArrowRight size={17} />
      </Link>
    </section>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}
