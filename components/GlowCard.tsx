// components/GlowCard.tsx
"use client";

import { ReactNode } from "react";

export default function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="group relative w-full">
      {/* Outer glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_60%)] blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-95" />

      <div
        className={[
          "relative w-full rounded-2xl",
          "border border-white/10",
          "bg-gradient-to-b from-white/[0.09] to-white/[0.03]",
          "backdrop-blur-2xl",
          "shadow-[0_18px_60px_-28px_rgba(0,0,0,0.85)]",
          "transition-all duration-500",
          "transform-gpu",
          "group-hover:border-cyan-300/45",
          "group-hover:shadow-[0_28px_90px_-42px_rgba(34,211,238,0.55)]",
          // CSS vars controlled by hover:
          " [--rx:0deg] [--ry:0deg] [--tz:0px] [--ty:0px]",
          " group-hover:[--rx:7deg] group-hover:[--ry:-10deg] group-hover:[--tz:18px] group-hover:[--ty:-6px]",
          className,
        ].join(" ")}
        style={{
          transform:
            "perspective(1200px) translateY(var(--ty)) translateZ(var(--tz)) rotateX(var(--rx)) rotateY(var(--ry))",
        }}
      >
        {/* Shine line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent transition-opacity duration-500 group-hover:via-cyan-300/55" />

        {/* Depth lighting */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_28%_18%,rgba(34,211,238,0.14),transparent_55%)] opacity-70" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.06),transparent_60%)] opacity-60" />

        {/* Inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-cyan-300/25" />

        {/* Content */}
        <div className="relative p-6">{children}</div>
      </div>
    </div>
  );
}