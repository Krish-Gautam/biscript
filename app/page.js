"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex w-100vw flex-col items-center justify-center gap-12  px-6 py-16">
      <h1 className="text-5xl font-bold text-white text-center">Start Learning Code the Fun Way</h1>
      <p className="text-xl text-gray-300 text-center max-w-2xl">
        Solve engaging challenges, earn achievements, and level up your programming skills one game at a time.
      </p>

      <div className="rounded-3xl bg-white/10 p-1 border border-white/10 shadow-xl relative w-[1100px] max-w-full">
        <div className="rounded-3xl bg-black overflow-hidden relative h-[550px]">
          {/* Top bar */}
          <div className="bg-[#16171A] text-[#555657] font-sans font-bold h-10 px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-5">
              <Image width={18} height={18} src="/apple.svg" alt="" />
              <span>Finder</span>
              <span>Edit</span>
              <span>View</span>
              <span>Go</span>
              <span>Window</span>
              <span>Help</span>
            </div>
            <div className="flex items-center gap-3">
              <Image width={18} height={18} src="/wifi.svg" alt="" />
              <Image width={18} height={18} src="/battery.svg" alt="" />
              <Image width={18} height={18} src="/control.svg" alt="" />
              <span>{date}</span>
              <span>{time}</span>
            </div>
          </div>

          {/* Main content window */}
          <div className="absolute top-20 left-20 bg-[#131416] h-[470px] w-[600px] border border-white/10 border-b-0 rounded-t-2xl">
            <div className="bg-[#17181A] w-full h-8 rounded-t-2xl flex items-center px-3 relative">
              <div className="flex gap-1">
                <img width={12} height={12} src="/red.svg" alt="" />
                <img width={12} height={12} src="/yellow.svg" alt="" />
                <img width={12} height={12} src="/green.svg" alt="" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-[#555657] text-sm font-semibold">
                Get Started
              </div>
            </div>
          </div>

          {/* Feature box */}
          <div className="absolute top-12 right-28 w-[220px] bg-[#1D1F22] rounded-xl shadow-md p-4">
            <h2 className="text-white text-base font-semibold mb-3">Explore Features</h2>
            <ul className="flex flex-col gap-2">
              <Link href="/languages">
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition hover:cursor-pointer">
                Languages
              </li>
              </Link>
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition hover:cursor-pointer">
                Challenges
              </li>
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition hover:cursor-pointer">
                Leaderboard
              </li>
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition hover:cursor-pointer">
                Profile
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
