"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (r.error) {
      toast.error(r.error.message || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }
  return (
    <div className="page-wrap">
      <form className="panel form-card auth-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Log in to Helpo</h1>
        <p className="section-lead">Your community is waiting.</p>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <button className="btn" disabled={busy}>
          {busy ? "Signing in..." : "Login"}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/" })
          }
        >
          Continue with Google
        </button>
        <p>
          New to Helpo?{" "}
          <Link className="text-link" href="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
