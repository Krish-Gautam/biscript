"use client";
import React, { useState } from 'react';
import { loginUser } from '../services/loginUser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const [userExitsError, setUserExitsError] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUserExitsError(undefined);

    const { data, error } = await loginUser(form);
    setLoading(false);

    if (error) {
      setUserExitsError(error);
      console.error("Error logging in:", error);
      toast.error("Login failed! Please try again.");
    } else {
      toast.success("Logged in successfully!");
      router.push("/profile");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1d] to-[#2a2a2d]">
      <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl relative">
        {/* Logo/avatar */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-bold text-white mt-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <input
            className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            required
          />

          <input
            className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={handleChange}
            required
          />

          <div className="flex justify-between items-center text-xs mt-1">
            <div></div>
            <Link href="#" className="text-blue-400 hover:underline">Forgot password?</Link>
          </div>

          {userExitsError && (
            <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm border border-red-500/30">
              {userExitsError}
            </div>
          )}

          <button
            type="submit"
            className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition duration-300 shadow-lg flex items-center justify-center disabled:opacity-60"
            disabled={loading}
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link href="/signin" className="text-blue-400 hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

