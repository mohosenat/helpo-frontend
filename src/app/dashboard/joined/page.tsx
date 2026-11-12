"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, HeartHandshake, ArrowRight } from "lucide-react";

import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { EventCard, EventItem } from "@/components/event-card";

export default function Joined() {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(true);

    api<{ events: EventItem[] }>("/events/joined")
      .then((d) => setItems(d.events))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <main className="page-wrap joined-page">
      <section className="joined-hero">
        <div className="joined-hero-content">
          <span className="joined-eyebrow">
            <HeartHandshake size={15} />
            YOUR COMMUNITY JOURNEY
          </span>

          <h1>
            Events You <span>Joined</span>
          </h1>

          <p>
            Every small action creates a meaningful impact. Keep track of the
            events where you are making a difference.
          </p>

          <div className="joined-stats">
            <div className="joined-stat-icon">
              <CalendarDays size={22} />
            </div>
            <div>
              <strong>{items.length}</strong>
              <span>Events Joined</span>
            </div>
          </div>
        </div>

        <div className="joined-hero-decoration">
          <div className="joined-decoration-circle">
            <HeartHandshake size={76} strokeWidth={1.3} />
          </div>
        </div>
      </section>

      <section className="joined-events-section">
        <div className="joined-section-heading">
          <div>
            <span className="joined-section-label">YOUR ACTIVITIES</span>
            <h2>My Joined Events</h2>
            <p>All the events you are part of, in one place.</p>
          </div>

          <Link href="/events" className="joined-browse-link">
            Explore Events
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="event-grid">
            {[1, 2, 3].map((item) => (
              <div className="joined-skeleton" key={item} />
            ))}
          </div>
        ) : items.length ? (
          <div className="event-grid">
            {items.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="joined-empty">
            <div className="joined-empty-icon">
              <HeartHandshake size={38} />
            </div>

            <h3>No Events Joined Yet</h3>

            <p>
              You haven't joined any community events yet. Explore upcoming
              opportunities and start making a difference!
            </p>

            <Link href="/events" className="joined-empty-button">
              Explore Upcoming Events
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
