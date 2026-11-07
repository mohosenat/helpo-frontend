"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { EventItem } from "@/components/event-card";
export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [f, setF] = useState({
    title: "",
    description: "",
    type: "Donation",
    image: "",
    location: "",
    date: "",
  });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/events/${id}`,
    )
      .then((r) => r.json())
      .then((d) => {
        const e: EventItem = d.event;
        if (e)
          setF({
            title: e.title,
            description: e.description,
            type: e.type,
            image: e.image,
            location: e.location,
            date: e.date.slice(0, 10),
          });
      })
      .catch(() => toast.error("Could not load event"));
  }, [id]);
  function change(k: string, v: string) {
    setF((p) => ({ ...p, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/events/${id}`, { method: "PATCH", body: JSON.stringify(f) });
      toast.success("Event updated");
      router.push("/dashboard/manage");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-wrap">
      <form className="panel form-card" onSubmit={submit}>
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-[var(--text)]">
          Update Event
        </h1>{" "}
        {Object.entries(f).map(([k, v]) => (
          <div className="field" key={k}>
            <label>{k[0].toUpperCase() + k.slice(1)}</label>
            {k === "description" ? (
              <textarea
                rows={4}
                required
                value={v}
                onChange={(e) => change(k, e.target.value)}
              />
            ) : k === "type" ? (
              <select value={v} onChange={(e) => change(k, e.target.value)}>
                {[
                  "Cleanup",
                  "Plantation",
                  "Donation",
                  "Education",
                  "Community",
                  "Other",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ) : (
              <input
                required
                type={k === "date" ? "date" : k === "image" ? "url" : "text"}
                value={v}
                onChange={(e) => change(k, e.target.value)}
              />
            )}
          </div>
        ))}
        <button className="btn mx-auto block" disabled={busy}>
          {busy ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
