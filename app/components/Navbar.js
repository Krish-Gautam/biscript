"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex justify-center h-20 sticky top-0 z-20 backdrop-blur-2xl bg-transparent">
      <div className="flex justify-between gap-14 font-bold font-sans navbar-fade-border">
        <div className="flex items-center gap-5">
          <Link href="/">
            <span className="text-lg">Biscript</span>
          </Link>
          <ul className="flex items-center">
            <li className="px-2">Product</li>
            <li className="px-2">Docs</li>
            <li className="px-2">Customers</li>
            <li className="px-2">Pricing</li>
            <li className="px-2">Resources</li>
            <li className="px-2">Partners</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button className="cursor-pointer" onClick={()=> router.push("/login")} >Login</button>
          <button className="cursor-pointer" onClick={()=> router.push("/signin")}>Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
