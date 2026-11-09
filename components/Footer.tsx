import Link from "next/link";
import { Brand } from "@/components/Brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Brand />
          <p className="footer-copy">Make every task simpler.</p>
        </div>
        <div>
          <h3>Product</h3>
          <Link href="#tools">Explore Tools</Link>
          <Link href="#categories">Categories</Link>
        </div>
        <div>
          <h3>Information</h3>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Kivora. All rights reserved.</span>
        <span>Make every task simpler.</span>
      </div>
    </footer>
  );
}