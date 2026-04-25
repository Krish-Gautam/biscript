"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import reactjs from "../assets/reactjs.jpeg";
import python from "../assets/python.jpeg";
import java from "../assets/java.jpeg";
import cpp from "../assets/cpp.jpeg";
import c from "../assets/c.jpeg";
import csharp from "../assets/csharp.jpeg";
import html from "../assets/html.jpeg";
import css from "../assets/css.svg";
import php from "../assets/php.jpeg";
import nodejs from "../assets/nodejs.jpeg";
import bash from "../assets/bash.jpeg";

const Languages = () => {
  const languages = [
    { name: "React JavaScript", icon: reactjs, description: "Frontend library for building user interfaces.", difficulty: "Intermediate" },
    { name: "Python", icon: python, description: "Popular for data science, automation, and web apps.", difficulty: "Beginner" },
    { name: "Java", icon: java, description: "Used for Android apps, enterprise software.", difficulty: "Intermediate" },
    { name: "C++", icon: cpp, description: "High-performance language used in game engines.", difficulty: "Hard" },
    { name: "C", icon: c, description: "Low-level programming for systems and embedded devices.", difficulty: "Hard" },
    { name: "C#", icon: csharp, description: "Used for Windows apps and Unity game development.", difficulty: "Intermediate" },
    { name: "HTML", icon: html, description: "Defines the structure of web pages.", difficulty: "Beginner" },
    { name: "CSS", icon: css, description: "Used to style and layout web pages.", difficulty: "Beginner" },
    { name: "PHP", icon: php, description: "Server-side scripting for web development.", difficulty: "Intermediate" },
    { name: "Node Js", icon: nodejs, description: "Runs JavaScript on the server for web apps.", difficulty: "Intermediate" },
    { name: "Bash", icon: bash, description: "Command-line scripting for automation and Linux.", difficulty: "Intermediate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f12] via-[#16171b] to-[#0f0f12] px-6 py-16 text-white">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className="pb-4 text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Languages Supported
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Practice, learn, and master programming languages used in real-world software development.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link
              to={`/Lessons/${lang.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative h-full"
            >
              <div className="h-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-white/20">

                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <img
                    src={lang.icon}
                    width={42}
                    height={42}
                    alt={lang.name}
                    className="rounded-lg"
                  />
                  <h2 className="text-lg font-semibold">{lang.name}</h2>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-6 relative z-10">
                  {lang.description}
                </p>

                {/* Footer */}
                <div className="mt-auto text-xs text-gray-400 relative z-10">
                  Difficulty:{" "}
                  <span className="text-white font-medium">
                    {lang.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Languages;
