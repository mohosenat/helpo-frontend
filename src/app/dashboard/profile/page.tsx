"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserRound, Camera, Mail, Save, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { data: session } = authClient.useSession();

  const [name, setName] = useState(session?.user.name || "");
  const [image, setImage] = useState(session?.user.image || "");

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const r = await authClient.updateUser({ name, image });

    if (r.error) {
      toast.error(r.error.message || "Update failed");
    } else {
      toast.success("Profile updated");
    }
  }

  return (
    <div className="page-wrap px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e7] text-[#ff6500]">
            <UserRound size={27} />
          </div>

          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage your personal information and account details.
          </p>
        </div>

        <form
          onSubmit={save}
          className="panel form-card rounded-3xl p-6 shadow-lg sm:p-9"
        >
          {/* Profile Image */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#ffe0cc] bg-[#fff0e7] text-[#ff6500]">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={48} />
              )}
            </div>

            <h2 className="mt-3 text-base font-semibold text-[var(--text)]">
              Profile Picture
            </h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Add a photo URL to personalize your profile
            </p>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff6500]"
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] py-3 pl-11 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#ff6500] focus:ring-2 focus:ring-[#ff6500]/10"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
              Profile Photo URL
            </label>

            <div className="relative">
              <Camera
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff6500]"
              />

              <input
                type="url"
                value={image || ""}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] py-3 pl-11 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#ff6500] focus:ring-2 focus:ring-[#ff6500]/10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-[#ff6500]/15 bg-[#fff0e7] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff6500]">
              <Mail size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500">Email Address</p>

              <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                {session?.user.email || "Loading..."}
              </p>
            </div>

            <ShieldCheck size={20} className="shrink-0 text-[#ff6500]" />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#ffaa00] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:from-[#e85c00] hover:to-[#ff8a36] active:scale-[0.98]"
          >
            <Save size={17} />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
