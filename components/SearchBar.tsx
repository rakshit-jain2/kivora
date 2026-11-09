"use client";

import { Search } from "lucide-react";
import type { RefObject } from "react";

export function SearchBar({
  value,
  onChange,
  compact = false,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <label className={`search-bar ${compact ? "search-bar-compact" : ""}`}>
      <Search size={compact ? 17 : 20} aria-hidden="true" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What do you need to get done?"
        aria-label="Search tools"
      />
      {!compact && (
        <kbd>
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      )}
    </label>
  );
}