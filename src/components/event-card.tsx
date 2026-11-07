import Link from "next/link";
import { MapPin, CalendarDays, ArrowUpRight, Users } from "lucide-react";

export type EventItem = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
  creatorEmail: string;
  creatorName?: string;
  joinedCount?: number;
};

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="event-card">
      <div className="event-photo">
        <img src={event.image} alt={event.title} />
      </div>

      <div className="event-info">
        <div className="event-meta">
          <span className="pill">{event.type}</span>

          <span className="event-date">
            <CalendarDays size={14} />
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>

        <h3>{event.title}</h3>

        <div className="event-location">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>

        <p>{event.description}</p>

        <div className="event-bottom">
          <span className="joined-count">
            <Users size={15} />
            {event.joinedCount || 0} joined
          </span>

          <Link className="text-link" href={`/events/${event._id}`}>
            View Event
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
