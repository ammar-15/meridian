"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import Particles from "@/components/ui/particles";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? (savedTheme as "dark" | "light")
        : prefersDark
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setFieldErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSuggestionsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSuggestions(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatusMessage({
        type: "error",
        message: "Please fix the highlighted fields.",
      });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    setStatusMessage({ type: "idle", message: "" });

    const { error } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      suggestions: suggestions.trim() || null,
    });

    setLoading(false);

    if (error) {
      if (
        error.code === "23505" ||
        error.message.toLowerCase().includes("duplicate")
      ) {
        const duplicateMessage = "You're already on the list — thanks!";
        setStatusMessage({ type: "success", message: duplicateMessage });
        toast.success(duplicateMessage);
        return;
      }

      const errorMessage = "Something went wrong. Please try again.";
      setStatusMessage({ type: "error", message: errorMessage });
      toast.error(errorMessage);
      return;
    }

    setName("");
    setEmail("");
    setSuggestions("");
    setFieldErrors({});
    const successMessage = "You're on the waitlist. We'll be in touch soon.";
    setStatusMessage({ type: "success", message: successMessage });
    toast.success(successMessage);
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-14 pt-14 sm:px-6 md:pt-20">
      <Particles
        quantityDesktop={250}
        quantityMobile={120}
        ease={70}
        color={theme === "dark" ? "#FFF6DF" : "#1D4ED8"}
        className="opacity-35"
      />
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={toggleTheme}
            className="h-10 px-4"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>

        <section className="flex flex-col items-center text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary sm:h-9 sm:w-9" />
            <h1 className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Meridian
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Meridian is coming soon. Join the waitlist to get early access and
            help shape what we ship first.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card/90 p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.65)] backdrop-blur sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Name <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Your name"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                required
              />
              {fieldErrors.name ? (
                <p id="name-error" className="text-sm text-destructive">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                required
              />
              {fieldErrors.email ? (
                <p id="email-error" className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="suggestions"
                className="block text-sm font-medium text-foreground"
              >
                Suggestions
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                value={suggestions}
                onChange={handleSuggestionsChange}
                rows={4}
                placeholder="Anything you want us to build first?"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "Joining..." : "Join"}
            </Button>

            {statusMessage.type !== "idle" ? (
              <p
                className={`text-sm ${
                  statusMessage.type === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                }`}
                role="status"
              >
                {statusMessage.message}
              </p>
            ) : null}
          </form>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-center text-xl font-semibold text-foreground">
            Snapshots of progress
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-2 shadow-sm"
              >
                <Image
                  src={`/snapshots/${num}.png`}
                  alt={`Screenshot ${num}`}
                  width={720}
                  height={1280}
                  className="h-auto w-full rounded-xl"
                />
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          This project is being built by Ammar{" "}
          <a
            href="https://ammar-15.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            ammar-15.github.io
          </a>
        </footer>
      </div>
    </main>
  );
}
