"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  const addUserToDB = async (user: { id: string; email: string | null }) => {
    if (!user.email) return;
    try {
      await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
        }),
      });
    } catch (error) {
      console.error("Failed to add user to DB", error);
    }
  };

  useEffect(() => {
    const processOAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Dodaj użytkownika do DB
        await addUserToDB({ id: session.user.id, email: session.user.email });

        router.push("/dashboard");
      } else {
        router.push("/auth?error=oauth_failed");
      }
    };

    processOAuth();
  }, [router]);

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold">Signing you in…</h2>
    </div>
  );
}
