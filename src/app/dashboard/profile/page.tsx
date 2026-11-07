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
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#ff6500]">
            <UserRound size={28} />
          </div>

          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={save}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-orange-100/40 sm:p-9"
        >
          {/* Profile Image */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50 text-[#ff6500] shadow-sm">
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

            <h2 className="mt-3 text-base font-semibold text-gray-800">
              Profile Picture
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Add a photo URL to personalize your profile
            </p>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserRound size={16} className="text-[#ff6500]" />
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#ff6500] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Photo URL */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Camera size={16} className="text-[#ff6500]" />
              Profile Photo URL
            </label>

            <input
              type="url"
              value={image || ""}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#ff6500] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Email */}
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-4">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6500] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-[#e85c00] active:scale-[0.98]"
          >
            <Save size={17} />
            Save Profile
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Your personal information is kept secure.
        </p>
      </div>
    </div>
  );
}
