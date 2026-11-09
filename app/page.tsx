"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  CategorySection,
  FeaturesSection,
  FinalCta,
  HeroSection,
  ToolsSection,
} from "@/components/HomeSections";
import { tools } from "@/data/tools";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const visibleTools = useMemo(() => {
    const search = query.trim().toLowerCase();

    return search
      ? tools.filter((tool) =>
          `${tool.name} ${tool.description} ${tool.category}`
            .toLowerCase()
            .includes(search),
        )
      : tools.slice(0, 6);
  }, [query]);

  const focusSearch = () => {
    searchRef.current?.focus();
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <Navbar onSearch={focusSearch} />
      <main>
        <HeroSection
          query={query}
          searchRef={searchRef}
          onChange={setQuery}
        />
        <CategorySection />
        <ToolsSection
          query={query}
          visibleTools={visibleTools}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
        <FeaturesSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
