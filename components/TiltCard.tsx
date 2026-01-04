// components/TiltCard.tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  perspective?: number; // px
  scale?: number; // hover scale
  lift?: number; // px translateY on hover
};

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  perspective = 950,
  scale = 1.02,
  lift = 4,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduceMotion = !!mq?.matches;
    if (reduceMotion) return;

    let raf = 0;
    let hovering = false;

    const setTransform = (rx: number, ry: number, s: number, ty: number) => {
      el.style.transform = `perspective(${perspective}px) translateY(${ty}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const onEnter = () => {
      hovering = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTransform(0, 0, scale, -lift));
    };

    const onMove = (e: MouseEvent) => {
      if (!hovering) return;

      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1

      // clamp (safety)
      const cx = Math.max(0, Math.min(1, px));
      const cy = Math.max(0, Math.min(1, py));

      const rotY = (cx - 0.5) * (maxTilt * 2);
      const rotX = (0.5 - cy) * (maxTilt * 2);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // slightly dampen rotation for smoothness
        setTransform(
          Number(rotX.toFixed(2)),
          Number(rotY.toFixed(2)),
          scale,
          -lift
        );
      });
    };

    const onLeave = () => {
      hovering = false;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTransform(0, 0, 1, 0));
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [maxTilt, perspective, scale, lift]);

  return (
    <div
      ref={ref}
      className={`will-change-transform transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(${perspective}px) translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)`,
      }}
    >
      {children}
    </div>
  );
}