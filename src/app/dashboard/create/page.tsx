"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

import {
  CalendarDays,
  FileText,
  Image,
  MapPin,
  Send,
  Tags,
  Type,
  Mail,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function CreateEvent() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Donation",
    image: "",
    location: "",
    date: "",
  });

  const [busy, setBusy] = useState(false);

  const minDate = (() => {
    const [year, month, day] = getDhakaDate().split("-").map(Number);

    const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));

    return tomorrow.toISOString().slice(0, 10);
  })();

  function change(k: string, v: string) {
    setForm((previous) => ({ ...previous, [k]: v }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (form.date <= getDhakaDate()) {
      toast.error("Choose a future date");
      return;
    }

    setBusy(true);

    try {
      await api("/events", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("Event created successfully!");
      router.push("/events");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create event",
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "h-12 rounded-xl border-gray-200 bg-gray-50 pl-11 text-sm font-medium text-[#171717] placeholder:font-normal placeholder:text-gray-400 focus-visible:border-[#FF6500] focus-visible:ring-[#FF6500]/20 dark:border-white/10 dark:bg-[#111315] dark:text-white dark:placeholder:text-gray-500";

  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#FF6500]";

  const labelClass =
    "mb-2 block text-sm font-bold text-[#252525] dark:text-gray-200";

  return (
    <div className="min-h-screen bg-[#EDF1F4] px-4 py-12 dark:bg-[#111315] sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-300/10 px-4 py-2 text-xs font-extrabold tracking-[0.15em] text-[#F15A24] dark:bg-orange-500/10 dark:text-orange-400">
            START SOMETHING GOOD
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#171717] dark:text-white sm:text-4xl">
            Create a New Event
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Bring people together and make a positive difference in your
            community.
          </p>
        </div>

        {/* Form Card */}
        <Card className="rounded-3xl border border-white bg-white py-0 shadow-[0_20px_60px_rgba(23,32,51,0.08)] dark:border-white/5 dark:bg-[#1B1E21]">
          <CardContent className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8 border-b border-gray-100 pb-6 dark:border-white/10">
              <h2 className="text-xl text-center font-extrabold text-[#171717] dark:text-white">
                Event Information
              </h2>

              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                Fill in the details below to publish your event.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className={labelClass}>
                  Event Title
                </label>

                <div className="relative">
                  <Type className={iconClass} />

                  <Input
                    id="title"
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => change("title", e.target.value)}
                    placeholder="Enter your event title"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Event Type and Date */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Event Type</label>

                  <div className="relative">
                    <Tags className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#FF6500]" />

                    <Select
                      value={form.type}
                      onValueChange={(value) => {
                        if (value !== null) {
                          change("type", value);
                        }
                      }}
                    >
                      <SelectTrigger className="!h-12 !w-full !rounded-xl !border !border-gray-200 !bg-gray-50 !pl-11 !pr-4 !text-sm !font-medium !text-[#171717] !shadow-none focus:!border-[#FF6500] focus:!ring-4 focus:!ring-[#FF6500]/10 dark:!border-white/10 dark:!bg-[#111315] dark:!text-white">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>

                      <SelectContent
                        sideOffset={8}
                        className="min-w-[var(--radix-select-trigger-width)] rounded-xl border border-gray-200 bg-white p-2 shadow-[0_12px_35px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#1B1E21]"
                      >
                        {[
                          "Cleanup",
                          "Plantation",
                          "Donation",
                          "Education",
                          "Community",
                          "Health Camp",
                          "Winter Relief",
                          "Food Distribution",
                          "Other",
                        ].map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="mb-1 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-[#252525] outline-none transition-colors focus:bg-orange-50 focus:text-[#FF6500] data-[state=checked]:bg-orange-50 data-[state=checked]:text-[#FF6500] dark:text-gray-200 dark:focus:bg-orange-500/10 dark:focus:text-orange-400 dark:data-[state=checked]:bg-orange-500/10 dark:data-[state=checked]:text-orange-400"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Event Date
                  </label>

                  <div className="relative">
                    <CalendarDays className={iconClass} />

                    <Input
                      id="date"
                      required
                      type="date"
                      min={minDate}
                      value={form.date}
                      onChange={(e) => change("date", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location / Venue
                </label>

                <div className="relative">
                  <MapPin className={iconClass} />

                  <Input
                    id="location"
                    required
                    type="text"
                    value={form.location}
                    onChange={(e) => change("location", e.target.value)}
                    placeholder="Enter event location or venue"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label htmlFor="image" className={labelClass}>
                  Thumbnail Image URL
                </label>

                <div className="relative">
                  <Image className={iconClass} />

                  <Input
                    id="image"
                    required
                    type="url"
                    value={form.image}
                    onChange={(e) => change("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelClass}>
                  Event Description
                </label>

                <div className="relative">
                  <FileText className="pointer-events-none absolute left-4 top-4 h-[18px] w-[18px] text-[#FF6500]" />

                  <Textarea
                    id="description"
                    required
                    rows={5}
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                    placeholder="Describe your event, its purpose and how people can participate..."
                    className="min-h-36 resize-y rounded-xl border-gray-200 bg-gray-50 py-3 pl-11 text-sm font-medium leading-6 text-[#171717] placeholder:font-normal placeholder:text-gray-400 focus-visible:border-[#FF6500] focus-visible:ring-[#FF6500]/20 dark:border-white/10 dark:bg-[#111315] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Organizer Email */}
              <div>
                <label htmlFor="organizerEmail" className={labelClass}>
                  Organizer Email
                </label>

                <div className="relative">
                  <Mail className={iconClass} />

                  <Input
                    id="organizerEmail"
                    type="email"
                    value={session?.user?.email || ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-75`}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Your logged-in email will be used as the event organizer.
                </p>
              </div>

              {/* Publish Button */}
              <div className="border-t border-gray-100 pt-7 dark:border-white/10">
                <Button
                  type="submit"
                  disabled={busy}
                  className="h-13 w-full rounded-full border-0 bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(255,106,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#FF4D00] hover:to-[#FFAA00] hover:shadow-[0_12px_28px_rgba(255,106,0,0.35)] disabled:opacity-60"
                >
                  <Send size={18} />

                  {busy ? "Publishing Event..." : "Publish Event"}
                </Button>

                <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  Your event will be visible to the Helpo community.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
