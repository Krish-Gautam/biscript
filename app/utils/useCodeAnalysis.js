// utils/useCodeAnalysis.js
import { useState, useEffect } from "react";

export function useCodeAnalysis(code, language, delay = 500) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code.trim()) {
      setAnalysis(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const resp = await fetch("/api/analyze-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.error || "Analysis failed");
        setAnalysis(json.analysis);
        setError(null);
      } catch (e) {
        setError(e.message);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [code, language, delay]);

  return { analysis, loading, error };
}
