import GoblinBox from "../components/GoblinBox";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HomeSkeleton } from "../components/LoadingSkeleton";
import { motion } from "framer-motion";
import red from "../assets/red.svg";
import yellow from "../assets/yellow.svg";
import green from "../assets/green.svg";
import control from "../assets/control.svg";
import apple from "../assets/apple.svg";
import battery from "../assets/battery.svg";
import wifi from "../assets/wifi.svg";
import hi from "../assets/hi.png";
import sitting from "../assets/sitting.png";
import angry from "../assets/angry.png";
import idea from "../assets/idea.png";
import {
  Code,
  Target,
  Users,
  Zap,
  Brain,
  Globe,
  Trophy,
  BookOpen,
  Battery,
} from "lucide-react";

const Image = ({ priority, ...props }) => <img {...props} />;

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [lessonStepIndex, setLessonStepIndex] = useState(0);
  const [goblinLine, setGoblinLine] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  const dragStart = useRef({ x: 0, y: 0 });
  const grabOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const DRAG_THRESHOLD = 6;

  const goblinTeaching = useMemo(
    () => [
      {
        message: "Hey there, little guy. I’m Miko.",
        trigger: "intro",
        waitFor: null,
        reactions: [],
        emoji: hi,
      },
      {
        message: "This is where you learn to code… the fun way.",
        trigger: "intro",
        waitFor: null,
        reactions: [],
        emoji: sitting,
      },
      {
        message:
          "I’ll explain things, crack a joke or two, and poke you a little when you mess up.",
        trigger: "intro",
        waitFor: null,
        reactions: [],
        emoji: angry,
      },
      {
        message: "Relax — I tease because I care.",
        trigger: "intro",
        waitFor: null,
        reactions: [],
        emoji: idea,
      },
      {
        message: "Now go on. Let’s make your brain work.",
        trigger: "intro_end",
        waitFor: null,
        reactions: [],
        emoji: sitting,
      },
    ],
    [],
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const currentStep = goblinTeaching?.[lessonStepIndex];
    if (currentStep && currentStep.emoji) {
      setGoblinLine(currentStep.message);
      setCurrentEmoji(currentStep.emoji);
    }
  }, [goblinTeaching, lessonStepIndex]);

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

  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) {
      // Center bottom for mobile
      setPos({
        x: window.innerWidth / 2 - 100, // half width of goblin
        y: window.innerHeight - 240,
      });
    } else {
      // Keep your PC layout EXACTLY same
      setPos({
        x: window.innerWidth - 480,
        y: 275,
      });
    }
  }, [isMobile]);

  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (isMobile) return;
    const el = dragRef.current;
    const parent = el.offsetParent; // 👈 THIS is the key
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    grabOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    didDrag.current = false;

    const onMouseMove = (ev) => {
      const dx = Math.abs(ev.clientX - dragStart.current.x);
      const dy = Math.abs(ev.clientY - dragStart.current.y);

      if (dx + dy > DRAG_THRESHOLD) {
        didDrag.current = true;
        setPos({
          x: Math.max(
            0,
            Math.min(
              ev.clientX - parentRect.left - grabOffset.current.x,
              window.innerWidth - 300, // goblin width
            ),
          ),
          y: Math.max(
            0,
            Math.min(
              ev.clientY - parentRect.top - grabOffset.current.y,
              window.innerHeight - 200,
            ),
          ),
        });

        setPos({
          x: ev.clientX - parentRect.left - grabOffset.current.x,
          y: ev.clientY - parentRect.top - grabOffset.current.y,
        });
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  };

  //set the date
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes gradientShift {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div className="select-none mt-14 w-full relative bg-black">
        <div
          ref={dragRef}
          onMouseDown={onMouseDown}
          style={{
            left: pos.x,
            top: pos.y,
            position: "absolute",
          }}
          className=" absolute bg-[#1a1a1d] z-10 w-[280px] sm:w-[300px] max-w-[90vw]  text-white overflow-visible border-gray-700 shadow-md space-y-2 cursor-pointer select-none"
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              if (didDrag.current) return; // 🚫 ignore click after drag
              setIsDisabled((prev) => !prev);
            }}
            style={{
              position: "absolute",
              top: -70,
              left: "60%",
              transform: "translateX(-40%)",
              zIndex: 99,
            }}
          >
            <img
              src={currentEmoji}
              alt="Goblin"
              width={134}
              height={134}
              draggable={false}
            />
          </div>
          {!isDisabled && (
            <GoblinBox
              className=" "
              response={goblinLine}
              isLessonStarted={true}
              canGoPrev={lessonStepIndex > 0}
              canGoNext={
                goblinTeaching && lessonStepIndex < goblinTeaching.length - 1
              }
              onPrev={() => setLessonStepIndex((prev) => Math.max(0, prev - 1))}
              onNext={() =>
                setLessonStepIndex((prev) =>
                  Math.min((goblinTeaching?.length || 1) - 1, prev + 1),
                )
              }
            />
          )}
        </div>

        {/* Hero Section */}
        <div className="min-h-screen flex  flex-col items-center justify-center gap-12 px-6 py-16 relative overflow-hidden">
          {/* Base gradient - consistent dark theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900"></div>

          {/* Animated accent gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 opacity-50"
            style={{ animation: "gradientShift 8s ease-in-out infinite" }}
          ></div>

          {/* Subtle mesh gradient for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent"></div>

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.015] mix-blend-screen"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white text-center mb-6 select-none transition-transform hover:scale-[1.05] animate-fade-in">
              Start Learning Code the Fun Way
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-2xl mb-8 select-none transition-transform hover:scale-[1.05] animate-fade-in">
              Solve engaging challenges, earn achievements, and level up your
              programming skills one game at a time.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-1 border border-white/10 shadow-xl relative w-full max-w-[1100px] mx-auto">
            <div className="rounded-3xl bg-black overflow-hidden relative min-h-[500px] md:h-[550px]">
              {/* ── Top bar ───────────────────────────────────── */}
              <div className="bg-[#16171A] text-[#555657] font-sans font-bold h-10 px-3 md:px-4 flex justify-between items-center text-xs md:text-sm">
                <div className="flex items-center gap-2 md:gap-5">
                  <img width={16} height={16} src={apple} alt="Apple logo" />
                  <span className="hidden md:inline">Finder</span>
                  <span className="hidden md:inline">Edit</span>
                  <span className="hidden md:inline">View</span>
                  <span className="hidden md:inline">Go</span>
                  <span className="hidden md:inline">Window</span>
                  <span className="hidden md:inline">Help</span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <img width={16} height={16} src={wifi} alt="WiFi" />
                  <img width={16} height={16} src={battery} alt="Battery" />
                  <span className="hidden sm:inline">{date}</span>
                  <span>{time}</span>
                </div>
              </div>

              {/* ── Code Window ───────────────────────── */}
              <div
                className="
        absolute
        top-16 left-3 right-3
        sm:left-6 sm:right-6
        h-[470px] 
        md:top-20 md:left-20 md:right-auto md:w-[600px]
        bg-[#131416]
        border border-white/10 border-b-0
        rounded-2xl
      "
              >
                <div className="bg-[#17181A] w-full h-8 rounded-t-2xl flex items-center px-3 relative">
                  <div className="flex gap-1">
                    <img src={red} width={12} height={12} alt="Close" />
                    <img src={yellow} width={12} height={12} alt="Minimize" />
                    <img src={green} width={12} height={12} alt="Maximize" />
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 text-[#555657] text-xs md:text-sm font-semibold">
                    Get Started
                  </div>
                </div>

                <div className="p-3 text-xs md:text-sm overflow-x-auto max-h-[300px] md:max-h-none">
                  <pre className="text-gray-400 whitespace-pre-wrap break-words">
                    {typewriterText}
                    <span className="animate-pulse">|</span>
                  </pre>
                </div>
              </div>

              {/* ── Feature Box (FLOATING ALWAYS) ───────────────── */}
              <div
                className="
        absolute
        top-20 right-3
        sm:right-6
        md:top-12 md:right-28

        w-[150px] sm:w-[180px] md:w-[220px]

        bg-[#1D1F22]
        rounded-xl shadow-md p-3 md:p-4
      "
              >
                <h2 className="text-white text-xs sm:text-sm md:text-base font-semibold mb-2 md:mb-3">
                  Features
                </h2>

                <ul className="flex flex-col gap-1.5 md:gap-2">
                  <Link to="/languages">
                    <li className="bg-[#282A2D] text-[10px] sm:text-xs md:text-sm text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-[#333638] transition-all">
                      Languages
                    </li>
                  </Link>

                  <Link to="/challenges">
                    <li className="bg-[#282A2D] text-[10px] sm:text-xs md:text-sm text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-[#333638] transition-all">
                      Challenges
                    </li>
                  </Link>

                  <Link to="/community">
                    <li className="bg-[#282A2D] text-[10px] sm:text-xs md:text-sm text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-[#333638] transition-all">
                      Community
                    </li>
                  </Link>

                  <li
                    onClick={handleProfileClick}
                    className="bg-[#282A2D] text-[10px] sm:text-xs md:text-sm text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md hover:bg-[#333638] transition-all"
                  >
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
                "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Top gradient fade for smooth transition */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"></div>

          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 z-20">
            <div
              className="absolute top-20  left-20 w-32 h-32 border rounded-full"
              style={{
                borderColor: "rgba(34, 211, 238, 0.3)",
                borderWidth: "2px",
                filter: "blur(2px)",
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
              }}
            ></div>
            <div
              className="absolute bottom-20 right-20 w-24 h-24 border rounded-full"
              style={{
                borderColor: "rgba(34, 211, 238, 0.3)",
                borderWidth: "2px",
                filter: "blur(2px)",
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
              }}
            ></div>
            <div
              className="absolute top-1/2 left-1/3 w-16 h-16 border rounded-full"
              style={{
                borderColor: "rgba(34, 211, 238, 0.3)",
                borderWidth: "2px",
                filter: "blur(2px)",
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
              }}
            ></div>
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
              Biscript is a gamified, interactive coding platform that
              transforms learning into an immersive adventure. Master
              programming through engaging challenges, earn achievements, and
              level up your skills in a supportive community.
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
                <span className="text-white font-medium">
                  Collaborate with Coders
                </span>
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
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.08) 100%)",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                backgroundSize: "50px 50px",
                animation: "gridMove 20s linear infinite",
              }}
            ></div>
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
                  description:
                    "Solve real-world problems with hands-on coding exercises",
                },
                {
                  icon: <Zap className="w-8 h-8 text-yellow-400" />,
                  title: "Gamified Progress",
                  description:
                    "Level up through achievements, streaks, and skill trees",
                },
                {
                  icon: <Brain className="w-8 h-8 text-purple-400" />,
                  title: "AI Hints",
                  description: "Get intelligent assistance when you're stuck",
                },
                {
                  icon: <Users className="w-8 h-8 text-green-400" />,
                  title: "Community Hub",
                  description:
                    "Connect with fellow developers and share solutions",
                },
                {
                  icon: <Globe className="w-8 h-8 text-indigo-400" />,
                  title: "Multi-Language Support",
                  description: "Master Python, JavaScript, Java, C++, and more",
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-red-400" />,
                  title: "Personal Dashboard",
                  description:
                    "Build your dashboard to showcase you skills and compete with friends",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
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
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                backgroundSize: "100px 100px",
              }}
            ></div>
          </div>
        </motion.section>
        <footer className="bg-[#0b1220] text-gray-300 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Top Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {/* Brand */}
              <div>
                <Link to="/" className="text-2xl font-semibold text-white">
                  BiScript
                </Link>
                <p className="mt-3 text-gray-400 text-sm leading-relaxed max-w-xs">
                  Bite-sized coding challenges, automated feedback, and
                  practical placement playbooks.
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wide uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link
                      to="/resume-analysis"
                      className="hover:text-white transition"
                    >
                      Learn Coding
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/placement-playbook"
                      className="hover:text-white transition"
                    >
                      Coding Challenges
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-white transition">
                      AI Assistance
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wide uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link to="/about" className="hover:text-white transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wide uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link to="/privacy" className="hover:text-white transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-white transition">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/refund" className="hover:text-white transition">
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-gray-500 text-center sm:text-left">
                © {new Date().getFullYear()} BiScript. All rights reserved.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/contact" className="hover:text-white transition">
                  Support
                </Link>
                <a
                  href="mailto:biscript15@gmail.com"
                  className="hover:text-white transition"
                >
                  biscript15@gmail.com
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
