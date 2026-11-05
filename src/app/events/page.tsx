import { EventItem } from "@/components/event-card";
import UpcomingEvents from "@/components/upcoming-events";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default async function EventsPage() {
  let events: EventItem[] = [];

  try {
    const response = await fetch(`${API}/events`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
  }

  return <UpcomingEvents events={events} />;
}
