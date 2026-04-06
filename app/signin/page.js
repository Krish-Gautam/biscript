"use client";

import { supabase } from "../utils/supabaseClient";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { registerUser } from "../services/registerUser";
import { useRouter } from "next/navigation";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";

const Signin = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [userError, setUserError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  // ✅ Listen for login AFTER email verification
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/profile");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResend = async () => {
    // show immediate feedback
    toast.loading("Sending email...");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: userEmail,
    });

    toast.dismiss();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email sent!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else {
        setPasswordError(undefined);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setUserError(undefined);

    const { error, message } = await registerUser(form);

    setLoading(false);

    if (error) {
      setUserError(error.message);
      toast.error(error.message || "Sign up failed.");
    } else {
      // ✅ STORE EMAIL HERE (IMPORTANT)
    setUserEmail(form.email);
      // ✅ Show verification screen
      setIsVerifying(true);

      if (message) {
        toast.success(message);
      }
    }
  };

  // ✅ Verification waiting screen
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1d] text-white">
        <div className="flex flex-col items-center gap-6">

          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Title */}
          <h2 className="text-2xl font-semibold">
            Waiting for email verification...
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm text-center max-w-md">
            We've sent you a verification link. Please check your inbox and click the link to continue.
          </p>

          {/* Optional resend */}
          <button
            onClick={handleResend}
            className="text-blue-400 text-sm underline"
          >
            Didn’t receive email?
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a1a1d] to-[#2a2a2d] px-4">
        <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl">

          <h2 className="text-3xl font-bold text-white text-center mt-2 mb-2">
            Sign Up
          </h2>

          <p className="text-gray-400 text-sm text-center mb-6">
            Create your account to get started.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4 mt-2">

            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            {passwordError && (
              <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
                {passwordError}
              </div>
            )}

            {userError && (
              <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
                {userError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(passwordError)}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Signin;