"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Profile() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user.name || "");
  const [image, setImage] = useState(session?.user.image || "");
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await authClient.updateUser({ name, image });
    if (r.error) toast.error(r.error.message || "Update failed");
    else toast.success("Profile updated");
  }
  return (
    <div className="page-wrap">
      <form className="panel form-card" onSubmit={save}>
        <h1>My profile</h1>
        <div className="field">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Photo URL</label>
          <input
            type="url"
            value={image || ""}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <p>{session?.user.email}</p>
        <button className="btn">Save profile</button>
      </form>
    </div>
  );
}
