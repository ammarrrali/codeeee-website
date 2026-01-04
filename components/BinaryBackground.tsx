"use client";

import { useEffect, useRef } from "react";

type Drop = {
  y: number;          // head position (in rows)
  speed: number;      // rows per frame-ish
  life: number;       // how long before it “dies”
  maxLife: number;
  length: number;     // trail length
  resetAt: number;    // row at which it may reset
};

export default function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;

    // Style knobs (tune here)
    const fontSize = 14;                 // try 12–16
    const fadeAlpha = 0.08;              // lower = longer trails, higher = shorter
    const color = "#06b6d4";             // cyan-500
    const chars = "01ABCDEF0123456789";  // binary + hex vibe

    let columns = 0;
    let rows = 0;
    let drops: Drop[] = [];

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    function randi(min: number, max: number) {
      return Math.floor(rand(min, max + 1));
    }

    const rebuild = () => {
      // Match PARENT size (Services section), not window
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(width / fontSize);
      rows = Math.floor(height / fontSize);

      drops = Array.from({ length: columns }).map(() => ({
        y: rand(-rows, 0),                 // start above
        speed: rand(0.1, 1.0),           // random speed
        life: randi(80, 240),              // random life
        maxLife: randi(120, 300),
        length: randi(6, 18),              // random trail length
        resetAt: randi(Math.floor(rows * 0.55), rows + randi(0, 25)), // not all bottom
      }));

      // Clear once after rebuild
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    };

    rebuild();

    // Observe parent resizing (because Services height changes with cards/content)
    const ro = new ResizeObserver(() => rebuild());
    ro.observe(parent);

    const draw = () => {
      // fade layer (controls trail)
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // x position
        const x = i * fontSize;

        // head row -> y px
        const yPx = d.y * fontSize;

        // character changes per frame
        const ch = chars.charAt(randi(0, chars.length - 1));

        // color with slight random alpha so it doesn’t look “flat”
        const alpha = rand(0.35, 0.95);
        ctx.fillStyle = `rgba(6,182,212,${alpha})`;
        ctx.fillText(ch, x, yPx);

        // Advance
        d.y += d.speed;
        d.life -= 1;

        // RANDOM ENDING: a drop can “die” early (even mid-screen)
        const dyingChance = d.life < 0 ? 0.35 : 0.0;

        // When to reset:
        // - passed resetAt (not always bottom)
        // - OR life expired
        // - OR random “die” event
        if (d.y > d.resetAt || d.life <= 0 || Math.random() < dyingChance) {
          // Restart with random settings so it ends at different heights
          d.y = rand(-rows * 0.6, 0);          // start above
          d.speed = rand(.06, 1.15);
          d.length = randi(6, 18);
          d.maxLife = randi(120, 320);
          d.life = randi(80, d.maxLife);
          d.resetAt = randi(Math.floor(rows * 0.45), rows + randi(0, 30));
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-[0.38]"
    />
  );
}