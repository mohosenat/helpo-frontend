"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
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
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  function change(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (form.date <= new Date().toISOString().slice(0, 10)) {
      toast.error("Choose a future date");
      return;
    }
    setBusy(true);
    try {
      await api("/events", { method: "POST", body: JSON.stringify(form) });
      toast.success("Event created successfully");
      router.push("/events");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create event");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-wrap">
      <form className="panel form-card" onSubmit={submit}>
        <span className="eyebrow">START SOMETHING GOOD</span>
        <h1>Create an event</h1>
        {[
          ["title", "Event title", "text"],
          ["description", "Description", "textarea"],
          ["image", "Thumbnail image URL", "url"],
          ["location", "Location", "text"],
        ].map(([k, l, t]) => (
          <div className="field" key={k}>
            <label>{l}</label>
            {t === "textarea" ? (
              <textarea
                required
                rows={4}
                value={(form as any)[k]}
                onChange={(e) => change(k, e.target.value)}
              />
            ) : (
              <input
                required
                type={t}
                value={(form as any)[k]}
                onChange={(e) => change(k, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="field">
          <label>Event type</label>
          <select
            value={form.type}
            onChange={(e) => change("type", e.target.value)}
          >
            {[
              "Cleanup",
              "Plantation",
              "Donation",
              "Education",
              "Community",
              "Food Distribution",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Event date</label>
          <input
            required
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) => change("date", e.target.value)}
          />
        </div>
        <button className="btn" disabled={busy}>
          {busy ? "Creating..." : "Publish event"}
        </button>
      </form>
    </div>
  );
}
