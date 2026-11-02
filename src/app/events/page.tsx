import { EventCard, EventItem } from "@/components/event-card";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export default async function EventsPage() {
  let events: EventItem[] = [];
  try {
    const r = await fetch(`${API}/events`, { cache: "no-store" });
    if (r.ok) events = (await r.json()).events || [];
  } catch {}
  return (
    <div className="page-wrap">
      <div className="page-head">
        <span className="eyebrow">FIND YOUR NEXT GOOD THING</span>
        <h1 className="page-title">Upcoming events</h1>
        <p className="section-lead">
          Discover opportunities to help, connect and make a difference.
        </p>
      </div>
      {events.length ? (
        <div className="event-grid">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      ) : (
        <div className="empty">No upcoming events available right now.</div>
      )}
    </div>
  );
}
