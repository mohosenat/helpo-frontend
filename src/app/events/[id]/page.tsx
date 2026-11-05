"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, MapPin, Users } from "lucide-react";
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

  if (!event)
    return (
      <div className="page-wrap">
        <div className="skeleton" />
      </div>
    );

  return (
    <div className="page-wrap detail-grid">
      <div>
        <img className="detail-image" src={event.image} alt={event.title} />
        <h1 className="page-title">{event.title}</h1>
        <p className="section-lead">{event.description}</p>
      </div>

      <aside className="detail-copy">
        <span className="pill">{event.type}</span>

        <h2>Event details</h2>

        <p>
          <CalendarDays size={17} /> {new Date(event.date).toLocaleString()}
        </p>

        <p>
          <MapPin size={17} /> {event.location}
        </p>

        <p>
          <Users size={17} /> {event.joinedCount || 0} people joined
        </p>

        {isJoined ? (
          <button className="btn" disabled={busy} onClick={leave}>
            {busy ? "Leaving..." : "Leave Event"}
          </button>
        ) : (
          <button className="btn" disabled={busy} onClick={join}>
            {busy ? "Joining..." : "Join Event"}
          </button>
        )}
      </aside>
    </div>
  );
}
