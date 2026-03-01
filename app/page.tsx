"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import CTA from "@/components/cta";
import Form from "@/components/form";
import Logos from "@/components/logos";
import Particles from "@/components/ui/particles";
import Header from "@/components/header";
import { supabase } from "@/lib/supabaseClient";

const DRAFT_KEY = "waitlist_form_draft";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        name?: string;
        email?: string;
        suggestions?: string;
      };
      setName(draft.name ?? "");
      setEmail(draft.email ?? "");
      setSuggestions(draft.suggestions ?? "");
    } catch {
      // Ignore malformed local draft values.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        name,
        email,
        suggestions,
      }),
    );
  }, [name, email, suggestions]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
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

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error("Please fill in all fields 😠");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address 😠");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      const { error } = await supabase.from("waitlist").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        suggestions: suggestions.trim() || null,
      });

      if (error) {
        if (
          error.code === "23505" ||
          error.message.toLowerCase().includes("duplicate")
        ) {
          reject("Duplicate email");
          return;
        }
        reject("Supabase insertion failed");
        return;
      }

      resolve({ name });
    });

    toast.promise(promise, {
      loading: "Getting you on the waitlist... 🚀",
      success: (data) => {
        setName("");
        setEmail("");
        setSuggestions("");
        localStorage.removeItem(DRAFT_KEY);
        return "Thank you for joining the waitlist 🎉";
      },
      error: (error) => {
        if (error === "Duplicate email") {
          return "You're already on the list — thanks!";
        } else if (error === "Supabase insertion failed") {
          return "Failed to save your details. Please try again 😢.";
        }
        return "An error occurred. Please try again 😢.";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <Header />

        <CTA />

        <Form
          name={name}
          email={email}
          suggestions={suggestions}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleSuggestionsChange={handleSuggestionsChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <Logos />
      </section>

      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#FFF6DF"}
        refresh
      />
    </main>
  );
}
