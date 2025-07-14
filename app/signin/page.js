"use client";
import { supabase } from "../utils/supabaseClient";
import React, { use } from "react";
import Link from "next/link";
import { useState } from "react";
import { registerUser } from "../services/registeruser";4
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Signin = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: {session} } = await supabase.auth.getSession();
      if (session) {
        router.push("/profile");
      }
    };
    checkUser();
  }, [router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
  const { data , error} = await registerUser(form);
   if (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again.");
    }
    else {
      console.log("User signed up successfully:", data);
      alert("Account created successfully! Please check your email for verification.");
     
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-[#2f3133] w-full max-w-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Sign up
        </h2>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            autoComplete="username"
            onChange={handleChange}
            className="bg-[#3d4042] rounded-lg h-12 px-4 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            autoComplete="email"
            className="bg-[#3d4042] rounded-lg h-12 px-4 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            autoComplete="new-password"
            className="bg-[#3d4042] rounded-lg h-12 px-4 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-300 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
