"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="page-wrap">
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] lg:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
