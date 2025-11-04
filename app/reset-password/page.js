"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClient";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const setSessionFromUrl = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error("Error restoring session:", error.message);
        setResetError(error.message);
      }
      setLoading(false);
    };

    setSessionFromUrl();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setResetError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setResetError(error.message);
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      // Clear form
      setPassword("");
      setConfirmPassword("");
      setResetError("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d]">
        <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-white">Verifying reset link...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d]">
        <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl relative">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-bold text-white mt-2">Reset Password</h2>
            <p className="text-gray-400 text-sm mt-1">Enter your new password below.</p>
          </div>

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-2">
            <input
              type="password"
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <input
              type="password"
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {resetError && (
              <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm border border-red-500/30">
                {resetError}
              </div>
            )}

            <button
              type="submit"
              className="h-12 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition duration-300 shadow-lg flex items-center justify-center disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

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
