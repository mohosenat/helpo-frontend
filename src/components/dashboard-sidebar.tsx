"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  PlusCircle,
  CalendarDays,
  Users,
  UserRound,
  LogOut,
} from "lucide-react";

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

  function isActive(href: string) {
    if (href === "/dashboard/create" || href === "/dashboard/manage") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href;
  }

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="flex items-center justify-center gap-5 border-b border-[var(--line)] bg-[var(--card)] px-4 py-3 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                active
                  ? "bg-[linear-gradient(110deg,#ff4d00,#ffaa00)] text-white shadow-lg shadow-orange-500/25"
                  : "bg-[var(--bg)] text-[var(--muted)] hover:bg-orange-500/10 hover:text-[#ff6a00]"
              }`}
            >
              <Icon size={19} />
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--card)] px-5 py-8 lg:flex">
        <div className="mb-8 px-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Dashboard Menu
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[linear-gradient(110deg,#ff4d00,#ffaa00)] text-white shadow-lg shadow-orange-500/20"
                    : "text-[var(--muted)] hover:bg-orange-500/10 hover:text-[#ff6a00]"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--line)] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
