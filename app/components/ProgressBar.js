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
      if (link && link.href && link.origin === window.location.origin) {
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

