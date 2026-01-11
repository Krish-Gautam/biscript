"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Start progress when clicking an internal link
   const handleClick = (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const url = new URL(link.href);
  const targetPath = url.pathname;

  if (targetPath === window.location.pathname) {
    // Same page → do nothing
    return;
  }

  if (url.origin === window.location.origin) {
    NProgress.start();
  }
};


    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // When the route actually changes, stop the progress bar
    NProgress.done();
  }, [pathname]);

  return null;
}

