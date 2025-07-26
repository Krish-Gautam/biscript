"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Languages = () => {


  const languages = [
    {
      name: "React JavaScript",
      icon: "/reactjs.jpeg",
      description: "Frontend library for building user interfaces.",
      difficulty: "Intermediate",
    },
    {
      name: "Python",
      icon: "/python.jpeg",
      description: "Popular for data science, automation, and web apps.",
      difficulty: "Beginner",
    },
    {
      name: "Java",
      icon: "/java.jpeg",
      description: "Used for Android apps, enterprise software.",
      difficulty: "Intermediate",
    },
    {
      name: "C++",
      icon: "/cpp.jpeg",
      description: "High-performance language used in game engines.",
      difficulty: "Hard",
    },
    {
      name: "C",
      icon: "/c.jpeg",
      description: "Low-level programming for systems and embedded devices.",
      difficulty: "Hard",
    },
    {
      name: "C#",
      icon: "/csharp.jpeg",
      description: "Used for Windows apps and Unity game development.",
      difficulty: "Intermediate",
    },
    {
      name: "HTML",
      icon: "/html.jpeg",
      description: "Defines the structure of web pages.",
      difficulty: "Beginner",
    },
    {
      name: "CSS",
      icon: "/css.svg",
      description: "Used to style and layout web pages.",
      difficulty: "Beginner",
    },
    {
      name: "PHP",
      icon: "/php.jpeg",
      description: "Server-side scripting for web development.",
      difficulty: "Intermediate",
    },
    {
      name: "Node Js",
      icon: "/nodejs.jpeg",
      description: "Runs JavaScript on the server for web apps.",
      difficulty: "Intermediate",
    },
    {
      name: "Bash",
      icon: "/bash.jpeg",
      description: "Command-line scripting for automation and Linux.",
      difficulty: "Intermediate",
    },
  ];

  return (
    <div className="px-6 py-16 bg-[#1A1B1E] text-white min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 select-none">Languages Supported</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {languages.map((lang, idx) => (
          <Link
            href={`/Lessons/${lang.name.toLowerCase().replace(/\s+/g, '-')}`}
            key={idx}
            className="bg-[#282A2D] hover:bg-[#323438] transition-all duration-300 p-5 rounded-2xl w-full max-w-xs shadow-lg flex flex-col"
            
          >
            <div className="flex items-center gap-3 mb-3">
              {lang.icon && (
                <Image
                  className="rounded-md"
                  src={lang.icon}
                  width={36}
                  height={36}
                  alt={lang.name}
                />
              )}
              <span className="text-xl font-semibold">{lang.name}</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">{lang.description}</p>
            <span className="text-xs text-gray-400 mt-auto">
              Difficulty: <span className="font-medium text-white">{lang.difficulty}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Languages;
