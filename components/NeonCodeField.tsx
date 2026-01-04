"use client";

import { useEffect, useRef } from "react";

type Props = {
  opacity?: number; // overall strength
  density?: number; // how many characters
  size?: number; // font size multiplier
  speed?: number; // drift speed multiplier (0.4 slow → 1.0 normal)
  changeRate?: number; // how often characters change (bigger = slower)
};

const CHARS = "01ABCDEFabcdef0123456789";
const BIN = "01";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function NeonCodeField({
  opacity = 0.32,
  density = 320,
  size = 1.05,
  speed = 0.55,
  changeRate = 26,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Parallax (cursor)
    let mx = 0.5;
    let my = 0.35;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / Math.max(1, window.innerWidth);
      my = e.clientY / Math.max(1, window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);

    // Points
    const points = Array.from({ length: density }).map(() => {
      const kind = Math.random() > 0.65 ? "bin" : "hex";
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        s: randInt(Math.floor(13 * size), Math.floor(20 * size)),
        v: (Math.random() * 0.35 + 0.05) * speed, // slower drift
        a: Math.random() * 0.55 + 0.25,
        kind,
        phase: Math.random() * Math.PI * 2,
        // each point changes at its own pace (slower overall)
        changeEvery: randInt(changeRate, changeRate + 28),
        tick: randInt(0, 999),
        char:
          kind === "bin"
            ? BIN[randInt(0, BIN.length - 1)]
            : CHARS[randInt(0, CHARS.length - 1)],
      };
    });

    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      // Stronger neon glow
      ctx.textBaseline = "top";
      ctx.shadowBlur = 28;
      ctx.shadowColor = "rgba(34,211,238,0.85)";

      for (const p of points) {
        // Update character slowly
        p.tick += 1;
        if (p.tick % p.changeEvery === 0) {
          p.char =
            p.kind === "bin"
              ? BIN[randInt(0, BIN.length - 1)]
              : CHARS[randInt(0, CHARS.length - 1)];
        }

        // slight parallax offset
        const px = p.x + (mx - 0.5) * 34;
        const py = p.y + (my - 0.5) * 18;

        const pulse = 0.72 + 0.28 * Math.sin(p.phase + t * 0.012); // slower pulse
        const alpha = opacity * p.a * pulse;

        ctx.font = `${p.s}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

        const cyan = `rgba(34,211,238,${alpha})`;
        const purple = `rgba(168,85,247,${alpha * 0.60})`;

        // layered neon
        ctx.fillStyle = purple;
        ctx.fillText(p.char, px + 0.7, py + 0.7);

        ctx.fillStyle = cyan;
        ctx.fillText(p.char, px, py);

        // slow drift downward
        p.y += p.v;
        if (p.y > h + 28) {
          p.y = -28;
          p.x = Math.random() * w;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [opacity, density, size, speed, changeRate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        mixBlendMode: "screen",
        filter: "saturate(1.4) contrast(1.12)",
      }}
    />
  );
}