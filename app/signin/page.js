"use client";
import { supabase } from "../utils/supabaseClient";
import React, { use } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { registerUser } from "../services/registerUser";
import { useRouter } from "next/navigation";
import ProgressBar from "../components/ProgressBar";
import toast from "react-hot-toast";

const Signin = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [session, setSession] = useState(null);
  const [userError, setUserError] = useState();
  const router = useRouter();
  const [PasswordError, setPasswordError] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else {
        setPasswordError("");
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/profile');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUserError(undefined);
    const { data, error } = await registerUser(form);
    setLoading(false);
    if (error) {
      setUserError(error.message);
      console.log("Error signing up:", error);
      toast.error(error.message || "Sign up failed. Please try again.");
    } else {
      // Optionally redirect or show success
      router.push('/profile');
    }
  };

  return (
    <>
    <ProgressBar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d] px-4">
      <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl relative">
        {/* Optional: Logo/avatar for branding, comment out if not needed */}
        {/* <div className=\"flex flex-col items-center mb-6\">
          <div className=\"w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-2\">
            <span className=\"text-white text-3xl font-bold\">⚡</span>
          </div>
        </div> */}
        <h2 className="text-3xl font-bold text-white text-center mt-2 mb-2">Sign Up</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Create your account to get started.</p>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4 mt-2">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            autoComplete="username"
            onChange={handleChange}
            className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            autoComplete="email"
            className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            autoComplete="new-password"
            className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />

          {PasswordError && (
            <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm border border-red-500/30">
              {PasswordError}
            </div>
          )}
          {userError && (
            <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm border border-red-500/30">
              {userError}
            </div>
          )}

          <button
            type="submit"
            className="h-12 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition duration-300 shadow-lg flex items-center justify-center disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">Login</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signin;
