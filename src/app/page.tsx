"use client";

import { FormEvent, useState } from "react";
import { Montserrat } from "next/font/google";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
});

export default function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16">
        <Card className="w-full border-border/80 bg-card/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur">
          <CardHeader className="space-y-4">
            <p className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
              Early Access
            </p>
            <CardTitle className={`${montserrat.className} text-4xl leading-none sm:text-5xl`}>Meridian</CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Join the waitlist to get early access. Share your suggestions so we can build the features you actually
              want first.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">Suggestions</Label>
                <Textarea
                  id="suggestions"
                  value={suggestions}
                  onChange={(event) => setSuggestions(event.target.value)}
                  placeholder="What should we build first?"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>

              {status.type !== "idle" ? (
                <p className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {status.message}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="pb-8 text-center text-sm text-muted-foreground">
        this project is being built by ammar{" "}
        <a
          href="https://ammar-15.github.io"
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-primary underline underline-offset-4"
        >
          ammar-15.github.io
        </a>
      </footer>
    </div>
  );
}
