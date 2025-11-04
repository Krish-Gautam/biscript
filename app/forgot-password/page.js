"use client"
import { supabase } from "@/app/utils/supabaseClient";
import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      toast.error(resetError.message);
    } else {
      setEmailSent(true);
      toast.success("Reset link sent! Check your email.");
    }
  };

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d]">
        <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl relative">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-bold text-white mt-2">Forgot Password</h2>
            <p className="text-gray-400 text-sm mt-1">
              {emailSent 
                ? "Check your email for the reset link."
                : "Enter your email to receive a password reset link."}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 mt-2">
              <input
                type="email"
                className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm border border-red-500/30">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="h-12 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition duration-300 shadow-lg flex items-center justify-center disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm border border-green-500/30 mt-4">
              Reset link sent! Please check your email inbox.
            </div>
          )}

          <div className="mt-6 text-center text-gray-400 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
