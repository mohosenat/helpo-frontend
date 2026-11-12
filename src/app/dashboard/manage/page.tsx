"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { EventCard, EventItem } from "@/components/event-card";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  CalendarDays,
  Plus,
  HeartHandshake,
} from "lucide-react";

export default function Manage() {
  const { data: session } = authClient.useSession();

  const [items, setItems] = useState<EventItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    try {
      const d = await api<{ events: EventItem[] }>("/events/mine");

      setItems(d.events || []);

      localStorage.setItem(
        "helpo-manage-events",
        JSON.stringify(d.events || []),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load events");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    if (!session?.user?.email) return;

    const cacheKey = `helpo-manage-events-${session.user.email}`;

    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        setItems(JSON.parse(cached));
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    async function refreshEvents() {
      try {
        const d = await api<{ events: EventItem[] }>("/events/mine");
        const events = d.events || [];

        setItems(events);
        localStorage.setItem(cacheKey, JSON.stringify(events));
      } catch (e) {
        if (!cached) {
          toast.error(e instanceof Error ? e.message : "Failed to load events");
        }
      } finally {
        setLoaded(true);
      }
    }

    refreshEvents();
  }, [session?.user?.email]);

  async function remove(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await api(`/events/${id}`, {
        method: "DELETE",
      });

      setItems((prev) => prev.filter((event) => event._id !== id));

      toast.success("Event deleted successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] -translate-x-0 px-4 sm:px-6 lg:px-8 lg:-translate-x-[130px]">
        {/* Manage Events Header */}
        <div className="mb-10 rounded-3xl border border-[var(--line)] bg-[var(--card)] px-5 py-10 text-center shadow-[var(--shadow)] sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
            <HeartHandshake size={15} />
            Your Initiatives
          </span>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
            Manage Your{" "}
            <span className="bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Manage your community initiatives, update event information, and
            keep your activities organized. Together, we can make a positive
            difference.
          </p>

          {/* Event Count */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--muted)]">
            <CalendarDays size={17} className="text-[#FF6A00]" />
            {items.length} {items.length === 1 ? "Event" : "Events"} Created
          </div>
        </div>

        {/* Event Cards */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((event) => (
              <div key={event._id} className="relative min-w-0">
                {/* Action Icons */}
                <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
                  <Link
                    href={`/dashboard/manage/${event._id}`}
                    title="Edit event"
                    aria-label={`Edit ${event.title}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/95 text-[#FF6A00] shadow-lg backdrop-blur-md transition hover:-translate-y-0.2 hover:bg-[#FF6A00] hover:text-white dark:border-white/10 dark:bg-[#1B1E21]/95 dark:text-[#FFAA00] dark:hover:bg-[#FF6A00] dark:hover:text-white"
                  >
                    <Pencil size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => remove(event._id)}
                    disabled={deletingId === event._id}
                    title="Delete event"
                    aria-label={`Delete ${event.title}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/95 text-red-500 shadow-lg backdrop-blur-md transition hover:-translate-y-0.2 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#1B1E21]/95 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                  >
                    {deletingId === event._id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>

                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : !loaded ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--card)]"
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--card)] px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-[#FF6A00]">
              <HeartHandshake size={30} />
            </div>

            <h2 className="text-xl font-extrabold text-[var(--text)]">
              No Events Created Yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[var(--muted)]">
              Start your first community initiative and inspire others to make a
              positive difference.
            </p>

            <Link
              href="/dashboard/create"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
