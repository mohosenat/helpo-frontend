import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-wrap empty">
      <span className="eyebrow">404 — LOST YOUR WAY?</span>
      <h1 className="page-title">This page wandered off.</h1>
      <p>Let's get you back to doing good.</p>
      <Link className="btn" href="/">
        Back home
      </Link>
    </div>
  );
}
