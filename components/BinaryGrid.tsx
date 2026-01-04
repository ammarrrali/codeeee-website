"use client";

import { useEffect, useRef } from "react";

function randBit() {
  return Math.random() > 0.5 ? "1" : "0";
}

function buildGrid(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, randBit).join("")
  );
}

export default function BinaryGrid() {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let lines: string[][] = [];
    let rows = 0;
    let cols = 0;

    const compute = () => {
      // Matches CSS below: text-[10px] leading-[14px]
      // Monospace char width at 10px is ~6px (approx)
      const charW = 6;
      const lineH = 14;

      cols = Math.ceil(window.innerWidth / charW) + 10;
      rows = Math.ceil(window.innerHeight / lineH) + 10;

      lines = buildGrid(rows, cols).map((l) => l.split(""));
      el.textContent = lines.map((a) => a.join("")).join("\n");
    };

    compute();
    window.addEventListener("resize", compute);

    let t = 0;
    const tick = () => {
      t++;

      // flip a few bits per line (low CPU)
      for (let i = 0; i < rows; i++) {
        for (let f = 0; f < 2; f++) {
          const idx = (Math.random() * cols) | 0;
          lines[i][idx] = lines[i][idx] === "0" ? "1" : "0";
        }
      }

      // subtle drift
      if (t % 6 === 0) {
        const j = (Math.random() * rows) | 0;
        lines[j].push(lines[j].shift()!);
      }

      el.textContent = lines.map((a) => a.join("")).join("\n");
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Strong overlay so content stays readable */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />

      {/* Full-screen binary */}
      <pre
        ref={ref}
        className="absolute inset-0 whitespace-pre font-mono text-[10px] leading-[14px] text-cyan-200/12"
      />

      {/* Soft cyan glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.12),transparent_60%)]" />
    </div>
  );
}