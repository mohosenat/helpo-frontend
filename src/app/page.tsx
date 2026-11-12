import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Users,
  Leaf,
  BookOpen,
  HandHeart,
} from "lucide-react";
import { EventCard, EventItem } from "@/components/event-card";
import NewsletterForm from "@/components/newsletter-form";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
async function getEvents(): Promise<EventItem[]> {
  try {
    const r = await fetch(`${API}/events/recent`, { next: { revalidate: 30 } });
    if (!r.ok) return [];
    const d = await r.json();
    return d.events || [];
  } catch {
    return [];
  }
}
export default async function Home() {
  const events = await getEvents();
  return (
    <main className="home-page">
      <section className="container hero">
        <div>
          <span className="eyebrow">A COMMUNITY THAT SHOWS UP</span>
          <h1>
            Good things happen <span className="gradient-text">together.</span>
          </h1>
          <p>
            Small actions create meaningful change. Discover local volunteering
            opportunities, meet people who care, and help build a stronger
            community with Helpo.
          </p>
          <div className="actions">
            <Link className="btn" href="/events">
              Explore events <ArrowUpRight size={18} />
            </Link>
            <Link className="btn ghost" href="/dashboard/create">
              Create an Event
            </Link>
          </div>
          {/* <p>
            ♥ &nbsp; Good people. Meaningful work. Every helping hand matters.
          </p> */}
        </div>
        <div className="hero-image">
          <Image
            src="/assets/banner.jpg"
            alt="Volunteers working together"
            fill
            priority
            sizes="(max-width:800px) 100vw,50vw"
          />
        </div>
      </section>
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">WHY HELPO</span>
            <h2>Make your kindness count.</h2>
            <p>
              Everything you need to turn good intentions into real-world
              impact.
            </p>
          </div>
        </div>
        <div className="feature-grid">
          {[
            [
              HeartHandshake,
              "Find your people",
              "Connect with local volunteers and organizations.",
            ],
            [
              ShieldCheck,
              "Make an impact",
              "Join meaningful initiatives in your own community.",
            ],
            [
              Users,
              "Grow together",
              "Build friendships while making a difference.",
            ],
          ].map(([Icon, title, desc]: any) => (
            <article className="feature" key={title}>
              <div className="feature-icon">
                <Icon size={23} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">UPCOMING OPPORTUNITIES</span>
            <h2>Small actions. Big change.</h2>
            <p>Find an event and show up for your community.</p>
          </div>
          <Link className="text-link" href="/events">
            All events <ArrowUpRight />
          </Link>
        </div>
        {events.length ? (
          <div className="event-grid">
            {events.slice(0, 6).map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        ) : (
          <div className="empty">
            No upcoming events yet. Be the first to create one!
            <br />
            <br />
            <Link className="btn" href="/dashboard/create">
              Create an event
            </Link>
          </div>
        )}
      </section>
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">MOMENTS THAT MATTER</span>
            <h2>Our community in action.</h2>
            <p>
              Every smile tells a story. Every helping hand makes a difference.
            </p>
          </div>

          <Link className="text-link" href="/events">
            Be part of it <ArrowUpRight />
          </Link>
        </div>

        <div className="gallery-grid">
          {[
            {
              id: "photo-1469571486292-0ba58a3f068b",
              title: "Together We Care",
              category: "Community Support",
            },
            {
              id: "photo-1532629345422-7515f3d16bb6",
              title: "Sharing Kindness",
              category: "Helping Hands",
            },
            {
              id: "photo-1488521787991-ed7bbaae773c",
              title: "Stronger Together",
              category: "Teamwork",
            },
            {
              id: "photo-1593113598332-cd288d649433",
              title: "Making A Difference",
              category: "Volunteering",
            },
            {
              id: "photo-1559027615-cd4628902d4a",
              title: "A Brighter Future",
              category: "Education",
            },
            {
              id: "photo-1531206715517-5c0ba140b2b8",
              title: "Small Acts, Big Impact",
              category: "Community",
            },
          ].map((item) => (
            <article className="gallery-card" key={item.id}>
              <img
                src={`https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=900&q=85`}
                alt={item.title}
                loading="lazy"
              />

              <div className="gallery-caption">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="newsletter">
          <div>
            <span className="eyebrow" style={{ color: "white" }}>
              STAY IN THE LOOP
            </span>
            <h2>Good news. Good people.</h2>
            <p>
              Get community stories and upcoming opportunities in your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
