import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-inner">
        <Link href="/" className="back-link">
          Back to Kivora
        </Link>
        <span className="section-kicker">Privacy</span>
        <h1>Privacy, kept clear.</h1>
        <p>
          Kivora is designed to keep everyday workflows simple. Details about
          data handling will be published here as each tool is released.
        </p>
      </div>
    </main>
  );
}