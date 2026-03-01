 "use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus({ type: "error", message: "Name and email are required." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const { error } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      suggestions: suggestions.trim() || null,
    });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setStatus({ type: "error", message: "That email is already on the waitlist." });
        return;
      }

      setStatus({
        type: "error",
        message: "Could not join right now. Please try again in a moment.",
      });
      return;
    }

    setStatus({ type: "success", message: "You are on the waitlist. Thanks for joining." });
    setName("");
    setEmail("");
    setSuggestions("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <section className="w-full max-w-2xl rounded-2xl border border-border bg-card/95 p-8 shadow-[0_12px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur sm:p-10">
          <p className="mb-3 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
            Early Access
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join the waitlist and help shape what we are building.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            We are building this project in public and inviting a small group of early users first. Add your name
            and email to reserve your spot, and share suggestions so we can prioritize the features that matter most.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name <span className="text-accent">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email <span className="text-accent">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="suggestions">
                Suggestions
              </label>
              <textarea
                id="suggestions"
                value={suggestions}
                onChange={(event) => setSuggestions(event.target.value)}
                rows={4}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                placeholder="What should we build first?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-foreground dark:text-background"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>

            {status.type !== "idle" && (
              <p className={`text-sm ${status.type === "success" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                {status.message}
              </p>
            )}
          </form>
        </section>

        <footer className="mt-10 text-center text-sm text-muted">
          this project is being built by ammar{" "}
          <a
            href="https://ammar-15.github.io"
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-accent underline underline-offset-4"
          >
            ammar-15.github.io
          </a>
        </footer>
      </main>
    </div>
  );
}
