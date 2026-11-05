"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Search, Plus, SlidersHorizontal } from "lucide-react";

import { EventCard, EventItem } from "@/components/event-card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All Events",
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Community",
  "Health Camp",
  "Winter Relief",
  "Food Distribution",
  "Other",
];

type UpcomingEventsContentProps = {
  events: EventItem[];
};

function getDhakaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const dateParts = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export default function UpcomingEventsContent({
  events,
}: UpcomingEventsContentProps) {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Soonest");

  // Show today's and future events
  const upcomingEvents = useMemo(() => {
    const today = getDhakaDate();

    return events.filter((event) => {
      const eventDate = event.date.slice(0, 10);
      return eventDate >= today;
    });
  }, [events]);

  // Search, category filter and sorting
  const filteredEvents = useMemo(() => {
    let result = upcomingEvents.filter((event) => {
      const matchesCategory =
        activeCategory === "All Events" || event.type === activeCategory;

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search) ||
        event.type.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "Newest") {
        return b.date.localeCompare(a.date);
      }

      return a.date.localeCompare(b.date);
    });

    return result;
  }, [upcomingEvents, activeCategory, searchTerm, sortBy]);

  const clearFilters = () => {
    setActiveCategory("All Events");
    setSearchTerm("");
    setSortBy("Soonest");
  };

  return (
    <main className="upcoming-page">
      {/* Compact Hero Section */}
      <section className="upcoming-hero">
        <div className="upcoming-hero-content">
          <span className="upcoming-hero-label">
            <CalendarDays size={15} />
            MAKE A DIFFERENCE TOGETHER
          </span>

          <h1>Upcoming Events</h1>

          <p>
            Discover meaningful events, connect with your community, and be a
            part of positive change.
          </p>

          <Link href="/dashboard/create" className="upcoming-hero-btn">
            <Plus size={18} />
            Create Event
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="upcoming-events-section" id="explore-events">
        {/* Single-line Toolbar */}
        <div className="upcoming-toolbar">
          <Select
            value={activeCategory}
            onValueChange={(value) => {
              if (value !== null) setActiveCategory(value);
            }}
          >
            <SelectTrigger className="upcoming-select upcoming-category-select">
              <CalendarDays size={15} className="upcoming-select-icon" />
              <SelectValue placeholder="All Events" />
            </SelectTrigger>

            <SelectContent
              align="start"
              alignOffset={0}
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={5}
              className="upcoming-dropdown-content"
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value !== null) setSortBy(value);
            }}
          >
            <SelectTrigger className="upcoming-select upcoming-sort-select">
              <SlidersHorizontal size={15} className="upcoming-select-icon" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent
              align="start"
              alignOffset={0}
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={5}
              className="upcoming-dropdown-content"
            >
              <SelectItem value="Soonest">Date: Soonest</SelectItem>
              <SelectItem value="Newest">Date: Latest</SelectItem>
            </SelectContent>
          </Select>

          <div className="upcoming-search">
            <Search size={18} />

            <Input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
            />
          </div>
        </div>

        {/* Results Count */}
        {/* <div className="upcoming-results-info">
          <p>
            <span>{filteredEvents.length}</span>{" "}
            {filteredEvents.length === 1 ? "event" : "events"} found
          </p>
        </div> */}

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="upcoming-event-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="upcoming-empty">
            <div className="upcoming-empty-icon">
              <CalendarDays size={32} />
            </div>

            <h3>No events found</h3>

            <p>
              {searchTerm || activeCategory !== "All Events"
                ? "We couldn't find any events matching your filters. Try another search."
                : "There are no upcoming events right now. Be the first to create one!"}
            </p>

            {searchTerm || activeCategory !== "All Events" ? (
              <button
                type="button"
                onClick={clearFilters}
                className="upcoming-reset-btn"
              >
                Clear Filters
              </button>
            ) : (
              <Link href="/dashboard/create" className="upcoming-hero-btn">
                <Plus size={17} />
                Create Event
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
