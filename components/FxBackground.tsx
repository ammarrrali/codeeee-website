"use client";

import { useEffect, useRef } from "react";
import NeonCodeField from "./NeonCodeField";

export default function FxBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Clean base gradient (professional) */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_30%_20%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_40%,rgba(168,85,247,0.08),transparent_60%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.07] noise" />

      {/* Neon binary + hex layer (your main theme) */}
      <NeonCodeField
        opacity={0.34}
        density={420}
        size={1.12}
        speed={0.50}
        changeRate={60}
      />

      {/* Cursor glow */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(700px circle at var(--mx,50%) var(--my,30%), rgba(34,211,238,0.20), transparent 55%)",
        }}
      />

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black" />
    </div>
  );
}