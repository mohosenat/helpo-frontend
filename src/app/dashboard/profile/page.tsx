"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { UserRound, Camera, Mail, Save, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { data: session } = authClient.useSession();

  const [name, setName] = useState(session?.user.name || "");
  const [image, setImage] = useState(session?.user.image || "");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const r = await authClient.updateUser({ name, image });

    if (r.error) {
      toast.error(r.error.message || "Update failed");
    } else {
      toast.success("Profile updated");
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-[#171717] outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-[#FF6500] focus:ring-4 focus:ring-[#FF6500]/10 dark:border-white/10 dark:bg-[#111315] dark:text-white dark:placeholder:text-gray-500";

  const labelClass =
    "mb-2 block text-sm font-bold text-[#252525] dark:text-gray-200";

  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#FF6500]";

  return (
    <div className="min-h-screen bg-[#EDF1F4] px-4 py-12 dark:bg-[#111315] sm:px-6 lg:py-16">
      <div className="mx-auto max-w-2xl lg:-translate-x-[130px]">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-300/10 px-4 py-2 text-xs font-extrabold tracking-[0.15em] text-[#F15A24] dark:bg-orange-500/10 dark:text-orange-400">
            <UserRound size={15} />
            YOUR ACCOUNT
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#171717] dark:text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Manage your personal information and keep your account details up to
            date.
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="rounded-3xl border border-white bg-white shadow-[0_20px_60px_rgba(23,32,51,0.08)] dark:border-white/5 dark:bg-[#1B1E21]">
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Card Heading */}
            <div className="mb-8 border-b border-gray-100 pb-6 text-center dark:border-white/10">
              <h2 className="text-xl font-extrabold text-[#171717] dark:text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your profile details below.
              </p>
            </div>

            <form onSubmit={save} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50/80 py-7 dark:border-white/10 dark:bg-[#111315]">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50 text-[#FF6500] dark:border-orange-500/20 dark:bg-orange-500/10">
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

                <h3 className="mt-4 text-base font-bold text-[#171717] dark:text-white">
                  Profile Picture
                </h3>

                <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                  Add a photo URL to personalize your profile.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>

                <div className="relative">
                  <UserRound className={iconClass} />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Profile Photo URL */}
              <div>
                <label className={labelClass}>Profile Photo URL</label>

                <div className="relative">
                  <Camera className={iconClass} />

                  <input
                    type="url"
                    value={image || ""}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className={labelClass}>Email Address</label>

                <div className="relative">
                  <Mail className={iconClass} />

                  <input
                    type="email"
                    value={session?.user.email || ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-75`}
                  />

                  <ShieldCheck className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#FF6500]" />
                </div>

                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              {/* Save Button */}
              <div className="border-t border-gray-100 pt-7 dark:border-white/10">
                <button
                  type="submit"
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-full border-0 bg-gradient-to-r from-[#FF4D00] to-[#FFAA00] text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(255,106,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,106,0,0.35)] active:scale-[0.98]"
                >
                  <Save size={18} />
                  Save Profile
                </button>

                <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  Keep your Helpo profile information up to date.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
