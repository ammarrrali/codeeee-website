"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  /** Final text you want to show */
  text: string;
  /** When true, animation starts */
  start?: boolean;
  /** Delay before decoding starts (ms) */
  delayMs?: number;
  /** Total duration of decode (ms) */
  durationMs?: number;
  /** Binary-only mode (0/1). If false, it uses code-like characters. */
  binaryOnly?: boolean;
};

function randBinaryChar() {
  return Math.random() > 0.5 ? "1" : "0";
}

function randCodeChar() {
  const chars = "01_/.-:<>[]{}()$#@*";
  return chars[(Math.random() * chars.length) | 0];
}

/**
 * Displays animated "scramble" text that resolves into the final `text`.
 * Starts with mostly random chars, then locks characters left-to-right.
 */
export default function BinaryDecodeText({
  text,
  start = true,
  delayMs = 0,
  durationMs = 700,
  binaryOnly = true,
}: Props) {
  const [out, setOut] = useState(text);

  const makeNoiseChar = useMemo(() => {
    return binaryOnly ? randBinaryChar : randCodeChar;
  }, [binaryOnly]);

  useEffect(() => {
    if (!start) return;

    let timeoutId: number | undefined;
    let rafId: number | undefined;

    const run = () => {
      const final = text;
      const len = final.length;

      const t0 = performance.now();
      const tick = (now: number) => {
        const elapsed = now - t0;
        const p = Math.min(1, elapsed / durationMs);

        // how many characters are "locked" into final text
        const locked = Math.floor(p * len);

        let next = "";
        for (let i = 0; i < len; i++) {
          const ch = final[i];

          // keep spaces readable (don’t scramble)
          if (ch === " ") {
            next += " ";
            continue;
          }

          if (i < locked) next += ch;
          else next += makeNoiseChar();
        }

        setOut(next);

        if (p < 1) rafId = requestAnimationFrame(tick);
        else setOut(final);
      };

      rafId = requestAnimationFrame(tick);
    };

    timeoutId = window.setTimeout(run, delayMs);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [text, start, delayMs, durationMs, makeNoiseChar]);

  return <span aria-label={text}>{out}</span>;
}