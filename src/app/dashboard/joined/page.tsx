"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, HeartHandshake, ArrowRight } from "lucide-react";

import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { EventCard, EventItem } from "@/components/event-card";

export default function Joined() {
  const { data: session } = authClient.useSession();

  const [items, setItems] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    async function loadJoinedEvents() {
      try {
        const d = await api<{ events: EventItem[] }>("/events/joined");
        setItems(d.events || []);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Failed to load joined events",
        );
      } finally {
        setLoaded(true);
      }
    }

    loadJoinedEvents();
  }, [session]);

  return (
    <main className="min-h-screen bg-[var(--bg)] py-10 sm:py-14">
      <div className="mx-auto w-[92%] max-w-7xl">
        {/* Joined Events Header */}
        <div className="mb-10 rounded-3xl border border-[var(--line)] bg-[var(--card)] px-5 py-10 text-center shadow-[var(--shadow)] sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
            <HeartHandshake size={15} />
            Your Community Journey
          </span>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
            Events You{" "}
            <span className="bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] bg-clip-text text-transparent">
              Joined
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Keep track of the community events you are part of. Every small
            contribution brings us closer to a better community.
          </p>

          {/* Event Count */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--muted)]">
            <CalendarDays size={17} className="text-[#FF6A00]" />
            {items.length} {items.length === 1 ? "Event" : "Events"} Joined
          </div>
        </div>

        {/* Event Cards */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : !loaded ? (
          /* Loading Skeleton */
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
              No Events Joined Yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[var(--muted)]">
              You haven't joined any community events yet. Explore upcoming
              events and become part of something meaningful.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
