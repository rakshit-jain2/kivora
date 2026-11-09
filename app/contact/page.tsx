import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-inner">
        <Link href="/" className="back-link">
          Back to Kivora
        </Link>
        <span className="section-kicker">Contact</span>
        <h1>Let&apos;s talk tools.</h1>
        <p>
          Contact details will be available here soon. In the meantime, head
          back to the workspace and explore what&apos;s ready.
        </p>
      </div>
    </main>
  );
}