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
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/events/${id}`,
    )
      .then((r) => r.json())
      .then((d) => setEvent(d.event))
      .catch(() => toast.error("Could not load event"));
  }, [id]);
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
      toast.success("You joined this event!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not join event");
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
        <button className="btn" disabled={busy} onClick={join}>
          {busy ? "Joining..." : "Join Event"}
        </button>
      </aside>
    </div>
  );
}
