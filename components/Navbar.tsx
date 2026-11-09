"use client";

import { Menu, Moon, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/Brand";

export function Navbar({ onSearch }: { onSearch?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Brand />
        <nav className={`nav-links ${open ? "nav-open" : ""}`}>
          <Link href="#tools" onClick={() => setOpen(false)}>
            Explore Tools
          </Link>
          <Link href="#categories" onClick={() => setOpen(false)}>
            Categories
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={onSearch}
            aria-label="Search tools"
          >
            <Search size={18} />
          </button>
          <button className="icon-button" aria-label="Theme settings">
            <Moon size={18} />
          </button>
          <Link className="button button-small" href="#tools">
            Explore Tools
          </Link>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}