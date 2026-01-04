"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type Line = { key: string; text: string };

export default function CapabilitiesReel() {
  const ref = useRef<HTMLDivElement | null>(null);

  const lines: Line[] = useMemo(
    () => [
      { key: "w1", text: "Business Websites" },
      { key: "w2", text: "Web Apps & Portals" },
      { key: "w3", text: "Booking Systems" },
      { key: "w4", text: "Automation & AI Workflows" },
      { key: "w5", text: "Maintenance & Updates" },
    ],
    []
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const steps = Math.max(1, lines.length - 1);
  const v = useTransform(scrollYProgress, [0, 1], [0, steps]);

  return (
    <section
      ref={ref}
      className="relative bg-black text-white"
      style={{
        height: `${(lines.length + 2) * 80}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="relative w-full max-w-6xl" style={{ perspective: "1200px" }}>
          {/* Stage */}
          <div
            className="relative mx-auto w-full max-w-5xl"
            style={{
              height: 520,
              // IMPORTANT: no overflow hidden while debugging visibility
              overflow: "visible",
            }}
          >
            {lines.map((line, i) => (
              <WheelLine key={line.key} index={i} v={v} text={line.text} />
            ))}
          </div>

          {/* Subtle glow only (no lines, no labels) */}
          <div className="pointer-events-none absolute -inset-16 -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_55%,rgba(34,211,238,0.22),transparent_60%)] blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function WheelLine({
  index,
  v,
  text,
}: {
  index: number;
  v: MotionValue<number>;
  text: string;
}) {
  const distance = useTransform(v, (val) => val - index);

  // Bigger Y gives the “coming from bottom” feel (but not insane)
  const y = useTransform(distance, [-2.5, 0, 2.5], [360, 0, -360]);

  // Wheel curvature
  const rotateX = useTransform(distance, [-2.5, 0, 2.5], [78, 0, -78]);

  // Use Framer Motion's supported Z (this is IMPORTANT)
  const z = useTransform(distance, [-2.5, 0, 2.5], [-180, 0, -180]);

  // Never fade to 0 (prevents blank screen)
  const opacity = useTransform(
    distance,
    [-2.5, -1.4, 0, 1.4, 2.5],
    [0.22, 0.55, 1, 0.55, 0.22]
  );

  const blur = useTransform(distance, [-2.5, 0, 2.5], [10, 0, 10]);
  const blurFilter = useTransform(blur, (b) => `blur(${b}px)`);

  const scale = useTransform(distance, [-2.5, 0, 2.5], [0.92, 1.12, 0.92]);

  // Neon intensity peaks at center
  const neon = useTransform(distance, (d) => {
    const a = Math.max(0, 1 - Math.abs(d)); // 0..1
    const glow = 0.15 + a * 0.75; // 0.15..0.9
    return `drop-shadow(0 0 26px rgba(34,211,238,${glow}))`;
  });

  return (
    <motion.div
      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center"
      style={{
        y,
        rotateX,
        z, // ✅ real translateZ
        opacity,
        scale,
        transformStyle: "preserve-3d",
        filter: blurFilter,
      }}
    >
      <motion.div style={{ filter: neon }}>
        <div className="text-center font-mono text-4xl md:text-6xl text-cyan-300 tracking-tight">
          {text}
        </div>
      </motion.div>
    </motion.div>
  );
}