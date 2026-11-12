"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubscribe}>
      <input
        type="email"
        placeholder="Your email address"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn ghost" type="submit">
        Subscribe
      </button>
    </form>
  );
}
