"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  HeartHandshake,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        toast.error(result.error.message || "Login failed");
        return;
      }

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Unable to generate authentication token");
      }

      const proxyResponse = await fetch("/api/auth/proxy-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!proxyResponse.ok) {
        throw new Error("Unable to create proxy session");
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to connect to the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleBusy(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`,
        newUserCallbackURL: `${window.location.origin}/auth/callback`,
        errorCallbackURL: `${window.location.origin}/login`,
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
      setGoogleBusy(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-[#EDF1F4] px-4 py-8 dark:bg-[#111315]">
      <Card className="w-full max-w-[400px] gap-0 rounded-2xl border-0 bg-white p-0 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:bg-[#1B1E21] dark:shadow-[0_12px_40px_rgba(0,0,0,0.20)]">
        <CardHeader className="flex flex-col items-center px-6 pb-5 pt-7 text-center sm:px-8">
          <Link
            href="/"
            aria-label="Helpo home"
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] text-white shadow-md"
          >
            <HeartHandshake size={26} strokeWidth={2.2} />
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 max-w-[280px] text-sm leading-5 text-muted-foreground">
            Sign in to continue making a difference.
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-7 sm:px-8">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 rounded-lg border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:border-[#FF6500] focus-visible:ring-[#FF6500]/20 dark:border-white/10 dark:bg-[#111315]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 rounded-lg border-gray-200 bg-gray-50 pl-10 pr-11 text-sm focus-visible:border-[#FF6500] focus-visible:ring-[#FF6500]/20 dark:border-white/10 dark:bg-[#111315]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy || googleBusy}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] font-semibold text-white hover:brightness-105"
            >
              {busy ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} className="ml-2" />
                </>
              )}
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
            onClick={handleGoogleLogin}
            className="h-11 w-full rounded-lg font-medium"
          >
            {googleBusy ? (
              "Connecting..."
            ) : (
              <>
                <svg
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="mr-2 h-5 w-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.9 3l5.7-5.7A20 20 0 0 0 4 12.5l2.3 2.2Z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2A12 12 0 0 1 12.9 28l-6.6 5.1A20 20 0 0 0 24 44Z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="ml-2 inline-block bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] bg-clip-text font-bold text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #FF4D00, #FFAA00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
