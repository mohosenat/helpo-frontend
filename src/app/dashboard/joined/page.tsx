"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { EventCard, EventItem } from "@/components/event-card";
export default function Joined() {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<EventItem[]>([]);
  useEffect(() => {
    if (session)
      api<{ events: EventItem[] }>("/events/joined")
        .then((d) => setItems(d.events))
        .catch((e) => toast.error(e.message));
  }, [session]);
  return (
    <div className="page-wrap">
      <h1 className="page-title">Events you joined</h1>
      {items.length ? (
        <div className="event-grid">
          {items.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      ) : (
        <div className="empty">You have not joined an event yet.</div>
      )}
    </div>
  );
}
