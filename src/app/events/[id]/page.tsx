"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { EventItem } from "@/components/event-card";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/events/${id}`,
    )
      .then((r) => r.json())
      .then((d) => setEvent(d.event))
      .catch(() => toast.error("Could not load event"));
  }, [id]);

  useEffect(() => {
    async function checkJoinedStatus() {
      if (!session?.user) {
        setIsJoined(false);
        return;
      }

      try {
        const data = (await api("/events/joined")) as {
          events: { _id: string }[];
        };

        const alreadyJoined = data.events?.some(
          (item) => String(item._id) === String(id),
        );

        setIsJoined(Boolean(alreadyJoined));
      } catch {
        setIsJoined(false);
      }
    }

    checkJoinedStatus();
  }, [id, session?.user]);

  async function join() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setBusy(true);

    try {
      await api(`/events/${id}/join`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      setIsJoined(true);

      setEvent((prev) =>
        prev ? { ...prev, joinedCount: (prev.joinedCount || 0) + 1 } : prev,
      );

      toast.success("You joined this event!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not join event");
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setBusy(true);

    try {
      await api(`/events/${id}/leave`, {
        method: "DELETE",
      });

      setIsJoined(false);

      setEvent((prev) =>
        prev
          ? {
              ...prev,
              joinedCount: Math.max(0, (prev.joinedCount || 0) - 1),
            }
          : prev,
      );

      toast.success("You left this event successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not leave event");
    } finally {
      setBusy(false);
    }
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="event-details-container">
          <div className="event-details-skeleton" />
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <main className="event-details-page">
      <div className="event-details-container">
        <Link href="/events" className="event-back-link">
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        <div className="event-details-layout">
          {/* Main Content */}
          <section className="event-details-main">
            <div className="event-cover-wrapper">
              <img
                src={event.image}
                alt={event.title}
                className="event-cover-image"
              />

              <div className="event-cover-overlay" />

              <span className="event-category-badge">{event.type}</span>

              <div className="event-cover-content">
                <span className="event-cover-label">
                  <HeartHandshake size={15} />
                  Make a Difference
                </span>

                <h1>{event.title}</h1>
              </div>
            </div>

            <div className="event-description-card">
              <div className="event-section-heading">
                <span className="event-heading-icon">
                  <HeartHandshake size={20} />
                </span>

                <div>
                  <h2>About This Event</h2>
                </div>
              </div>

              <p className="event-description-text">{event.description}</p>
            </div>

            <div className="event-community-note">
              <div className="event-community-icon">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h3>Be Part of Something Meaningful</h3>
                <p>
                  Your participation can bring positive change to someone's
                  life. Join hands with the community and make a difference
                  together.
                </p>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="event-details-sidebar">
            <div className="event-info-card">
              <div className="event-info-header">
                <div>
                  <span className="event-info-eyebrow">EVENT INFORMATION</span>
                  <h2>Event Details</h2>
                </div>

                <span className="event-info-icon">
                  <CalendarDays size={22} />
                </span>
              </div>

              <div className="event-info-list">
                <div className="event-info-item">
                  <span className="event-info-item-icon">
                    <CalendarDays size={19} />
                  </span>

                  <div>
                    <span className="event-info-label">Event Date</span>
                    <p>
                      {eventDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="event-info-item">
                  <span className="event-info-item-icon">
                    <Clock3 size={19} />
                  </span>

                  <div>
                    <span className="event-info-label">Event Time</span>
                    <p>
                      {eventDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="event-info-item">
                  <span className="event-info-item-icon">
                    <MapPin size={19} />
                  </span>

                  <div>
                    <span className="event-info-label">Location</span>
                    <p>{event.location}</p>
                  </div>
                </div>

                <div className="event-info-item">
                  <span className="event-info-item-icon">
                    <Users size={19} />
                  </span>

                  <div>
                    <span className="event-info-label">Participants</span>
                    <p>{event.joinedCount || 0} people joined</p>
                  </div>
                </div>
              </div>

              <div className="event-participant-summary">
                <div className="event-participant-heading">
                  <span>Community Participants</span>
                  <strong>{event.joinedCount || 0}</strong>
                </div>

                <div className="event-participant-bar">
                  <span />
                </div>

                <p>Every helping hand makes a difference.</p>
              </div>

              <button
                className={`event-join-button ${isJoined ? "event-leave-button" : ""}`}
                disabled={busy}
                onClick={isJoined ? leave : join}
              >
                <HeartHandshake size={19} />

                {busy
                  ? isJoined
                    ? "Leaving..."
                    : "Joining..."
                  : isJoined
                    ? "Leave Event"
                    : "Join This Event"}
              </button>

              <p className="event-action-note">
                {isJoined
                  ? "You are participating in this event."
                  : "Join the community and be part of the change."}
              </p>
            </div>

            <div className="event-sidebar-note">
              <HeartHandshake size={20} />
              <p>Small acts of kindness can create a big impact.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
