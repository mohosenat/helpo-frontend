"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HeartHandshake, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
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

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to connect to the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleBusy(true);

    try {
      const frontendURL = window.location.origin;

      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${frontendURL}/auth/callback`,
        newUserCallbackURL: `${frontendURL}/auth/callback`,
        errorCallbackURL: `${frontendURL}/register`,
      });
    } catch (error) {
      console.error("Google registration failed:", error);
      toast.error("Google sign-up failed. Please try again.");
      setGoogleBusy(false);
    }
  }

  return (
    <div className="page-wrap">
      <Card className="panel form-card auth-card">
        <CardContent className="p-0">
          <div className="mb-4 flex justify-center">
            <Link
              href="/"
              aria-label="Helpo home"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] text-white shadow-md"
            >
              <HeartHandshake size={26} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="mb-6 text-center">
            {/* <span className="eyebrow">JOIN THE MOVEMENT</span> */}

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Create account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Join our community and start making a difference.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-1">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="image">Photo URL</label>
              <Input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <Button
              type="submit"
              disabled={busy || googleBusy}
              className="btn mt-2 w-full"
            >
              {busy ? "Creating..." : "Create account"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={busy || googleBusy}
            onClick={handleGoogleRegister}
            className="h-11 w-full"
          >
            {googleBusy ? "Connecting..." : "Continue with Google"}
          </Button>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
            Already a member?
            <Link
              href="/login"
              className="ml-1 inline-block font-bold"
              style={{
                backgroundImage: "linear-gradient(110deg, #ff4d00, #ffaa00)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
