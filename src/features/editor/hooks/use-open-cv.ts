"use client";

import { useEffect, useState } from "react";

export function useOpenCvReady() {
  const [ready, setReady] = useState(() =>
    typeof window !== "undefined" ? Boolean(window.cv) : false,
  );

  useEffect(() => {
    if (typeof window === "undefined" || ready) return;
    if (window.cv) {
      return;
    }

    const timer = window.setInterval(() => {
      if (window.cv) {
        setReady(true);
        window.clearInterval(timer);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [ready]);

  return ready;
}
