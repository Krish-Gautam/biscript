"use client";
import Image from "next/image";
import { useState, useEffect, Suspense, lazy } from "react";
import Link from "next/link";
import { supabase } from "./utils/supabaseClient";
import { useRouter } from "next/navigation";
import { HomeSkeleton } from "./components/LoadingSkeleton";
import { motion } from "framer-motion";
import { Code, Target, Users, Zap, Brain, Globe, Trophy, BookOpen } from "lucide-react";

export default function Home() {
  const [session, setSession] = useState()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
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

  // fetch session once on mount with caching
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [])

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

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes gradientShift {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <div className="select-none w-full relative bg-black">
        {/* Hero Section */}
        <div className="min-h-screen flex w-100vw flex-col items-center justify-center gap-12 px-6 py-16 relative overflow-hidden">
          {/* Base gradient - consistent dark theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900"></div>

          {/* Animated accent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 opacity-50"
            style={{ animation: 'gradientShift 8s ease-in-out infinite' }}></div>

          {/* Subtle mesh gradient for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent"></div>

          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-screen"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")' }}></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white text-center mb-6 select-none transition-transform hover:scale-[1.05] animate-fade-in">
              Start Learning Code the Fun Way
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-2xl mb-8 select-none transition-transform hover:scale-[1.05] animate-fade-in">
              Solve engaging challenges, earn achievements, and level up your programming skills one game at a time.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-1 border border-white/10 shadow-xl relative w-[1100px] max-w-full">
            <div className="rounded-3xl bg-black overflow-hidden relative h-[550px]">
              {/* Top bar */}
              <div className="bg-[#16171A] text-[#555657] font-sans font-bold h-10 px-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-5">
                  <Image width={18} height={18} src="/apple.svg" alt="Apple logo" priority />
                  <span>Finder</span>
                  <span>Edit</span>
                  <span>View</span>
                  <span>Go</span>
                  <span>Window</span>
                  <span>Help</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image width={18} height={18} src="/wifi.svg" alt="WiFi" priority />
                  <Image width={18} height={18} src="/battery.svg" alt="Battery" priority />
                  <Image width={18} height={18} src="/control.svg" alt="Control" priority />
                  <span>{date}</span>
                  <span>{time}</span>
                </div>
              </div>

              {/* Main content window */}
              <div className="absolute top-20 flex flex-col left-20 bg-[#131416] h-[470px] w-[600px] border border-white/10 border-b-0 rounded-t-2xl">
                <div className="bg-[#17181A] w-full h-8 rounded-t-2xl flex items-center px-3 relative">
                  <div className="flex gap-1">
                    <Image width={12} height={12} src="/red.svg" alt="Close" priority />
                    <Image width={12} height={12} src="/yellow.svg" alt="Minimize" priority />
                    <Image width={12} height={12} src="/green.svg" alt="Maximize" priority />
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
                  <Link href="/community">
                    <li className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                      Community
                    </li>
                  </Link>
                  <li onClick={handleProfileClick} className="bg-[#282A2D] text-sm text-white px-3 py-2 rounded-md hover:bg-[#333638] transition-all duration-200 hover:scale-105 hover:shadow-md hover:cursor-pointer">
                    Profile
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section - Transition from hero */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-6 py-16 relative overflow-hidden"
        >
          {/* Base gradient - matching hero with subtle shift */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black"></div>

          {/* Animated accent gradient - transitioning from blue-purple to teal-cyan */}
          <motion.div
            className="absolute inset-0 opacity-40 "
            animate={{
              background: [
                "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.15) 100%)",
                "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Top gradient fade for smooth transition */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"></div>

          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 z-20">
            <div className="absolute top-20  left-20 w-32 h-32 border rounded-full" style={{
              borderColor: "rgba(34, 211, 238, 0.3)",
              borderWidth: "2px",
              filter: "blur(2px)",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)"
            }}></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border rounded-full" style={{
              borderColor: "rgba(34, 211, 238, 0.3)",
              borderWidth: "2px",
              filter: "blur(2px)",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)"
            }}></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 border rounded-full" style={{
              borderColor: "rgba(34, 211, 238, 0.3)",
              borderWidth: "2px",
              filter: "blur(2px)",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)"
            }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-30">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-6"
            >
              What is Biscript?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Biscript is a gamified, interactive coding platform that transforms learning into an immersive adventure.
              Master programming through engaging challenges, earn achievements, and level up your skills in a supportive community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-8"
            >
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Target className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium">Learn by Doing</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-white font-medium">Game Progression</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">Collaborate with Coders</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section - Smooth transition */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-6 py-16 relative overflow-hidden"
        >
          {/* Base gradient - continuing the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900"></div>

          {/* Animated accent gradient - subtle purple shift */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.08) 100%)",
                "linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, transparent 50%, rgba(139, 92, 246, 0.1) 100%)",
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.08) 100%)"
              ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>

          {/* Floating orbs - very subtle */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-violet-400/20 rounded-full blur-sm"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white text-center mb-12"
            >
              Powerful Features to Boost Your Coding Journey
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code className="w-8 h-8 text-blue-400" />,
                  title: "Interactive Challenges",
                  description: "Solve real-world problems with hands-on coding exercises"
                },
                {
                  icon: <Zap className="w-8 h-8 text-yellow-400" />,
                  title: "Gamified Progress",
                  description: "Level up through achievements, streaks, and skill trees"
                },
                {
                  icon: <Brain className="w-8 h-8 text-purple-400" />,
                  title: "AI Hints",
                  description: "Get intelligent assistance when you're stuck"
                },
                {
                  icon: <Users className="w-8 h-8 text-green-400" />,
                  title: "Community Hub",
                  description: "Connect with fellow developers and share solutions"
                },
                {
                  icon: <Globe className="w-8 h-8 text-indigo-400" />,
                  title: "Multi-Language Support",
                  description: "Master Python, JavaScript, Java, C++, and more"
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-red-400" />,
                  title: "Personal Dashboard",
                  description: "Build your dashboard to showcase you skills and compete with friends"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About + CTA Section - Final section with fade */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-10 px-6 relative overflow-hidden"
        >
          {/* Base gradient - darkening toward the end */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-black"></div>

          {/* Very subtle accent for continuity */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>

          {/* Minimal pattern for texture */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              backgroundSize: '100px 100px',
            }}></div>
          </div>
          <footer className="bg-[#0b1220] text-gray-200 border-t border-gray-800  relative">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex justify-between gap-8">
                <div>
                  <Link href="/" className="flex items-center space-x-3">
                    
                    <span className="font-semibold text-2xl mb-2">BiScript</span>
                  </Link>
                  <p className="mt-3  text-gray-400 max-w-xs ">
                    Bite-sized coding challenges, automated feedback, and practical placement playbooks to help you land the job.
                  </p>
                </div>

                <nav aria-label="Product" className="flex flex-col">
                  <h3 className="text-xl  font-light text-gray-300 mb-2">Product</h3>
                  <ul className="mt-3 space-y-4">
                    <li>
                      <Link href="/resume-analysis" className="text-gray-400 hover:text-gray-100 ">Learn Coding</Link>
                    </li>
                    <li>
                      <Link href="/placement-playbook" className="text-gray-400 hover:text-gray-100">Coding Challenges</Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="text-gray-400 hover:text-gray-100">AI Assistance</Link>
                    </li>
                  </ul>
                </nav>

                <nav aria-label="Company" className="flex flex-col ">
                  <h3 className="text-xl  font-light text-gray-300 mb-2">Company</h3>
                  <ul className="mt-3 space-y-4 ">
                    <li>
                      <Link href="/about" className="text-gray-400 hover:text-gray-100">About Us</Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-400 hover:text-gray-100">Contact</Link>
                    </li>
                  </ul>
                </nav>

                <nav aria-label="Legal" className="flex flex-col">
                  <h3 className="text-xl  font-light text-gray-300 mb-2">Legal</h3>
                  <ul className="mt-3 space-y-4 ">
                    <li>
                      <Link href="/privacy" className="text-gray-400 hover:text-gray-100">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-gray-400 hover:text-gray-100">Terms &amp; Conditions</Link>
                    </li>
                    <li>
                      <Link href="/refund" className="text-gray-400 hover:text-gray-100">Refund Policy</Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between">
                <p className="text-sm text-gray-500 ">© {new Date().getFullYear()} Biscript. All rights reserved.</p>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-gray-100">Support</Link>
                  <a href="mailto:biscript15@gmail.com" className="text-sm  text-gray-400 hover:text-gray-100">biscript15@gmail.com</a>
                </div>
              </div>
            </div>
          </footer>


        </motion.section>
      </div>
    </>
  );
}








