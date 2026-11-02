"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { EventCard, EventItem } from "@/components/event-card";
import Link from "next/link";
export default function Manage() {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<EventItem[]>([]);
  async function load() {
    try {
      const d = await api<{ events: EventItem[] }>("/events/mine");
      setItems(d.events);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    }
  }
  useEffect(() => {
    if (session) load();
  }, [session]);
  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    try {
      await api(`/events/${id}`, { method: "DELETE" });
      toast.success("Event deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }
  return (
    <div className="page-wrap">
      <div className="page-head">
        <span className="eyebrow">YOUR INITIATIVES</span>
        <h1 className="page-title">Manage events</h1>
      </div>
      {items.length ? (
        <div className="event-grid">
          {items.map((e) => (
            <div key={e._id}>
              <EventCard event={e} />
              <div className="toolbar">
                <Link
                  className="btn small ghost"
                  href={`/dashboard/manage/${e._id}`}
                >
                  Edit
                </Link>
                <button className="btn small" onClick={() => remove(e._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">You have not created any events yet.</div>
      )}
    </div>
  );
}
