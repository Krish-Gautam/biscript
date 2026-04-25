"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, Settings, LogOut, Menu, X } from "lucide-react";
import logo6 from "../assets/logo6.png";

const NAV_LINKS = [
  { to: "/languages", label: "Languages" },
  { to: "/challenges", label: "Challenges" },
  { to: "/docs", label: "Docs" },
  { to: "/community", label: "Community" },
];

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add("dark");
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!mounted || loading) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-neutral-900/80 border border-white/10 shadow-2xl px-6 py-2 flex items-center justify-between">
        <div className="w-full h-8 flex items-center justify-between animate-pulse">
          <div className="w-32 h-6 bg-gray-700 rounded"></div>
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-neutral-900/80 backdrop-blur-md border-b border-white/10 shadow-2xl px-4 md:px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobileMenu}>
          <img
            src={logo6}
            alt="Logo"
            style={{ objectFit: "contain", width: "120px", height: "40px" }}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="nav-anim-link text-gray-200 font-medium px-2 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login">
                <button className="px-4 py-1 rounded-md cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm">
                  Login
                </button>
              </Link>
              <Link to="/auth/register">
                <button className="px-4 py-1 rounded-md cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm">
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <div className="relative z-50">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex cursor-pointer items-center space-x-2 hover:bg-gray-700 px-3 py-1 rounded transition-colors text-white"
              >
                <User size={20} />
                <span>Profile</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#252526] border border-gray-700 rounded shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} className="mr-2" /> Profile
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={16} className="mr-2" /> Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors w-full cursor-pointer text-gray-200"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide-Down Menu Panel */}
      <div
        ref={mobileMenuRef}
        className={`
          md:hidden fixed top-[56px] left-0 right-0 z-50
          bg-neutral-900 border-b border-white/10 shadow-2xl
          transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col px-4 py-4 gap-1">
          {/* Nav Links */}
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-gray-200 font-medium px-3 py-3 rounded-md hover:bg-white/10 transition-colors text-base"
              onClick={closeMobileMenu}
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-white/10" />

          {/* Auth / Profile */}
          {!user ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={closeMobileMenu}>
                <button className="w-full px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm">
                  Login
                </button>
              </Link>
              <Link to="/auth/register" onClick={closeMobileMenu}>
                <button className="w-full px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition text-sm">
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-white/10 transition-colors text-gray-200"
                onClick={closeMobileMenu}
              >
                <User size={18} /> Profile
              </Link>
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-white/10 transition-colors text-gray-200"
                onClick={closeMobileMenu}
              >
                <Settings size={18} /> Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-white/10 transition-colors text-gray-200 w-full text-left"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Click outside to close profile dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;