"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  durationMs?: number;
  delayMs?: number;
  threshold?: number;
};

export default function BinaryRevealText({
  text,
  durationMs = 4200,
  delayMs = 120,
  threshold = 0.35,
}: Props) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [canTrigger, setCanTrigger] = useState(false); // <-- user has scrolled
  const [started, setStarted] = useState(false);
  const [output, setOutput] = useState(text);

  // Hydration-safe: first render is real text
  useEffect(() => setMounted(true), []);

  // Gate: don't allow reveal until user scrolls at least a little
  useEffect(() => {
    if (!mounted) return;

    const enable = () => setCanTrigger(true);

    // if user already not at top (back/forward, refresh mid-page)
    if (window.scrollY > 8) setCanTrigger(true);

    window.addEventListener("scroll", enable, { once: true, passive: true });
    window.addEventListener("touchmove", enable, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", enable);
      window.removeEventListener("touchmove", enable);
    };
  }, [mounted]);

  // Start only when THIS element is in view AND user has scrolled
  useEffect(() => {
    if (!mounted) return;
    if (!canTrigger) return;
    if (started) return;

    const el = spanRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted, canTrigger, started, threshold]);

  // Decode animation once started
  useEffect(() => {
    if (!mounted) return;
    if (!started) return;

    const chars = "01ABCDEF0123456789";
    const startAt = performance.now() + delayMs;

    let t0 = 0;

    const tick = (now: number) => {
      if (now < startAt) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!t0) t0 = now;
      const elapsed = now - t0;
      const progress = Math.min(1, elapsed / durationMs);

      const revealCount = Math.floor(progress * text.length);

      let next = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " ") {
          next += " ";
          continue;
        }
        if (i < revealCount) next += c;
        else next += chars[Math.floor(Math.random() * chars.length)];
      }

      setOutput(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOutput(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
};
  }, [mounted, started, text, durationMs, delayMs]);

  return <span ref={spanRef}>{output}</span>;
}