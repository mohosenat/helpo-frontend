"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HandHeart,
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  Users,
  UserRound,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  {
    label: "Create Event",
    href: "/dashboard/create",
    icon: PlusCircle,
  },
  {
    label: "Manage Events",
    href: "/dashboard/manage",
    icon: CalendarDays,
  },
  {
    label: "Joined Events",
    href: "/dashboard/joined",
    icon: Users,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  function isActive(href: string) {
    if (href === "/dashboard/create") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    if (href === "/dashboard/manage") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href;
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--card)] px-5 py-4 lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold text-[var(--text)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] text-white">
            <HandHeart size={21} />
          </span>
          Helpo
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--text)]"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 top-[73px] z-30 bg-black/30 lg:hidden">
          <aside className="w-[280px] border-r border-[var(--line)] bg-[var(--card)] p-5 shadow-xl">
            <SidebarContent
              pathname={pathname}
              isActive={isActive}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--card)] p-5 lg:flex">
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  isActive,
  onLogout,
}: {
  pathname: string;
  isActive: (href: string) => boolean;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] text-white shadow-lg shadow-orange-500/20">
          <HandHeart size={25} />
        </span>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
            Helpo
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Helping Hands, Stronger Communities
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <div className="mb-4 px-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          Workspace
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-to-r from-[#FF4D00] to-[#FF8A36] text-white shadow-md shadow-orange-500/20"
                  : "text-[var(--muted)] hover:bg-orange-500/10 hover:text-[#FF6A00]"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[var(--line)] pt-5">
        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-orange-500/10 hover:text-[#FF6A00]"
        >
          <LayoutDashboard size={19} />
          Back to Home
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </div>
  );
}
