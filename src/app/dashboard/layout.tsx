"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);
  if (isPending || !session)
    return (
      <div className="page-wrap">
        <div className="skeleton" />
      </div>
    );
  return <>{children}</>;
}
