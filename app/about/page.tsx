import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-inner">
        <Link href="/" className="back-link">
          Back to Kivora
        </Link>
        <span className="section-kicker">About Kivora</span>
        <h1>Make every task simpler.</h1>
        <p>
          Kivora is a focused collection of free utilities for students,
          developers, freelancers and everyday users.
        </p>
      </div>
    </main>
  );
}