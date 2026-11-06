"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  HeartHandshake,
  LogOut,
  Plus,
  LayoutDashboard,
  CalendarDays,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  async function logout() {
    try {
      await authClient.signOut();

      await fetch("/api/auth/proxy-session", {
        method: "DELETE",
      });

      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#111315]/90">
      <div className="relative mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-2xl font-extrabold tracking-tight text-[#171717] dark:text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] text-white shadow-md">
            <HeartHandshake size={23} />
          </span>
          helpo<span className="-ml-2 text-[#FF4D00]">.</span>
        </Link>

        {/* Upcoming Events - Center */}
        <nav className="flex items-center justify-center">
          <Link
            href="/events"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-[#FFAA00] sm:px-5"
          >
            <CalendarDays size={18} />
            <span className="hidden sm:inline">Upcoming Events</span>
            <span className="sm:hidden">Events</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!mounted}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] disabled:opacity-60 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-[#FFAA00]"
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Logged In */}
          {user ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Open profile menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-full border border-gray-200 p-1 transition hover:border-[#FF4D00] dark:border-white/10 dark:hover:border-[#FFAA00]"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D00] to-[#FFAA00] font-bold text-white">
                      {(user.name || "U").slice(0, 1).toUpperCase()}
                    </span>
                  )}

                  <ChevronDown size={15} className="mr-1 text-gray-500" />
                </button>

                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#1B1E21]">
                      <div className="border-b border-gray-100 px-3 py-3 dark:border-white/10">
                        <p className="truncate font-semibold text-gray-900 dark:text-white">
                          {user.name || "User"}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>

                      <div className="space-y-1 py-2">
                        <Link
                          href="/dashboard/create"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] dark:text-gray-200 dark:hover:bg-white/10"
                        >
                          <Plus size={17} />
                          Create Event
                        </Link>

                        <Link
                          href="/dashboard/manage"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] dark:text-gray-200 dark:hover:bg-white/10"
                        >
                          <LayoutDashboard size={17} />
                          Manage Events
                        </Link>

                        <Link
                          href="/dashboard/joined"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] dark:text-gray-200 dark:hover:bg-white/10"
                        >
                          <HeartHandshake size={17} />
                          Joined Events
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#FF4D00] dark:text-gray-200 dark:hover:bg-white/10"
                        >
                          <UserRound size={17} />
                          Profile
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            /* Logged Out */
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
