"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      password.length < 6
    ) {
      toast.error(
        "Password needs uppercase, lowercase and at least 6 characters",
      );
      return;
    }
    setBusy(true);
    const r = await authClient.signUp.email({
      name,
      email,
      password,
      image: image || undefined,
    });
    setBusy(false);
    if (r.error) {
      toast.error(r.error.message || "Registration failed");
      return;
    }
    toast.success("Account created successfully!");
    router.push("/");
    router.refresh();
  }
  return (
    <div className="page-wrap">
      <form className="panel form-card auth-card" onSubmit={submit}>
        <span className="eyebrow">JOIN THE MOVEMENT</span>
        <h1>Create your account</h1>
        <div className="field">
          <label>Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
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
          <label>Photo URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>
        <button className="btn" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
        <p>
          Already a member?{" "}
          <Link className="text-link" href="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
