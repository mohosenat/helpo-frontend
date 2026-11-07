"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    async function createProxySession() {
      if (isPending) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Unable to generate token");
        }

        const response = await fetch("/api/auth/proxy-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Unable to create proxy session");
        }

        router.replace("/");
        router.refresh();
      } catch (error) {
        console.error("Proxy session error:", error);
        router.replace("/login");
      }
    }

    createProxySession();
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Please wait...
    </div>
  );
}
