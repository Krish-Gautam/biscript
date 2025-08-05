"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "./utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [session, setSession] = useState()
  const router = useRouter()
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

  const [typewriterText, setTypewriterText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const fullText = `$> ./init --soul-upload --mode=unstable
# compiling ████... [OK]
* injecting logic into chaos...
>> SYSTEM://reality.patch() complete.`;

  //fetch session
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }

    fetchSession();
  })

  const handleProfileClick = (() => {
    if (session) {
      router.push('/profile')
    } else {
      router.push('/signin')
    }
  })
  
  //set the date
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //animation of typing text 
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypewriterText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="min-h-screen flex w-100vw flex-col items-center justify-center gap-12 px-6 py-16 relative overflow-hidden">
      {/* Enhanced Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-900"></div>
      
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      
      {/* Subtle dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-white text-center mb-6 select-none transition-transform hover:scale-[1.05]">
          Start Learning Code the Fun Way
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl mb-8 select-none transition-transform hover:scale-[1.05]">
          Solve engaging challenges, earn achievements, and level up your programming skills one game at a time.
        </p>
      </div>

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
          <div className="absolute top-20 flex flex-col left-20 bg-[#131416] h-[470px] w-[600px] border border-white/10 border-b-0 rounded-t-2xl">
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
            <div className="p-3">
              <pre className="text-gray-400 relative">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </pre>
            </div>
          </div>

          {/* Feature box */}
          <div className="absolute top-12 right-28 w-[220px] bg-[#1D1F22] rounded-xl shadow-md p-4">
            <h2 className="text-white text-base font-semibold mb-3">Explore Features</h2>
            <ul className="flex flex-col gap-2">
              <Link href="/languages">
                <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                  Languages
                </li>
              </Link>
              <Link href="/challenges">
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                Challenges
              </li>
              </Link>
              <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                Leaderboard
              </li>
              <li onClick={handleProfileClick} className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                Profile
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
