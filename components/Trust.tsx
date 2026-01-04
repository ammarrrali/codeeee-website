// components/Trust.tsx
"use client";

import { motion } from "framer-motion";
import GlowCard from "./GlowCard";
import TiltCard from "./TiltCard";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const items = [
  {
    title: "Production-grade delivery",
    desc: "Clean UI, fast load, responsive layout, and deployment done properly.",
    tag: "launch_ready",
  },
  {
    title: "Clear scope, clear timeline",
    desc: "We define features first, then execute with checkpoints—no surprises.",
    tag: "no_chaos",
  },
  {
    title: "SEO + performance baseline",
    desc: "Core SEO setup, speed optimizations, and best practices by default.",
    tag: "optimized",
  },
  {
    title: "Maintenance & upgrades",
    desc: "We stay available after launch: fixes, updates, and improvements.",
    tag: "supported",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="relative px-6 py-24 bg-black text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl"
      >
        <p className="font-mono text-sm text-cyan-300/90">
          &gt; trust.layer()
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          Built for trust, not hype
        </h2>
        <p className="mt-3 max-w-2xl text-white/75">
          We focus on delivery quality: modern UI, performance, stability, and
          support—so your business looks serious online.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <TiltCard
              key={it.title}
              className="h-full"
              maxTilt={8}
              perspective={1100}
              scale={1.02}
              lift={6}
            >
              <GlowCard className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm text-cyan-200">
                      {">"} {it.title}
                    </div>
                    <p className="mt-2 text-sm text-white/75">{it.desc}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs text-white/70">
                    {it.tag}
                  </div>
                </div>
              </GlowCard>
            </TiltCard>
          ))}
        </div>

        <div className="mt-10">
          <TiltCard maxTilt={7} perspective={1100} scale={1.015} lift={5}>
            <GlowCard>
              <div className="font-mono text-sm text-cyan-200">
                {">"} stack.proof
              </div>
              <p className="mt-2 text-white/80">
                We build with modern stacks (Next.js, Java, Python, APIs) and
                deliver clean systems with good structure—so future scaling is
                easy.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {["Next.js", "React", "Java", "Python", "APIs", "Automation", "SEO"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-white/70"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </GlowCard>
          </TiltCard>
        </div>
      </motion.div>
    </section>
  );
}