"use client";

import { useCallback, useEffect, useState } from "react";

export function useGame<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!url) return;
    try {
      const response = await fetch(url, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load this session.");
      setData(body);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load this session.");
    }
  }, [url]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { data, error, refresh };
}
