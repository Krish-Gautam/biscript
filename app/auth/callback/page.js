"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      let authError = null;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        authError = error;
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });
        authError = error;
      }

      if (authError) {
        console.error("Auth error:", authError);
        router.replace("/signin");
        return;
      }

      // ✅ Get user AFTER session is established
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/signin");
        return;
      }

      // ✅ CHECK if profile already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id);

      // ✅ Create profile ONLY if not exists
      if (!existingProfile || existingProfile.length === 0) {
        const username = user.user_metadata?.username;

        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username,
            email: user.email,
          },
        ]);

        if (insertError) {
          console.error("Profile insert error:", insertError);
          router.replace("/signin");
          return;
        }
      }

      // ✅ Finally redirect
      router.replace("/profile");
    };

    handleAuth();
  }, [router]);

  return <p>Verifying your email, please wait...</p>;
}