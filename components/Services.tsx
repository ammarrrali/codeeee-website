// components/Services.tsx
"use client";

import { motion } from "framer-motion";
import GlowCard from "./GlowCard";
import BinaryBackground from "./BinaryBackground";
import BinaryRevealText from "./BinaryRevealText";
import TiltCard from "./TiltCard";

const sectionFade = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const services = [
  {
    title: "Business Websites",
    subtitle: "Fast, modern sites built to convert visitors into inquiries.",
    bullets: ["Custom UI", "SEO-ready", "Speed optimized", "Conversion-focused"],
    code: `export const website = {
  goal: "more inquiries",
  stack: ["Next.js", "SEO", "UI/UX"],
  speed: "A-grade"
}`,
  },
  {
    title: "Web Apps & Portals",
    subtitle: "Dashboards, client portals, admin panels—built like software.",
    bullets: [
      "Secure access",
      "Role-based users",
      "Dashboards",
      "Custom workflows",
    ],
    code: `export const portal = {
  users: ["admin", "staff", "client"],
  features: ["roles", "reports", "automation"],
  secure: true
}`,
  },
  {
    title: "Booking Systems",
    subtitle: "Appointments, schedules, and management—automated & clean.",
    bullets: ["Calendar logic", "Notifications", "Staff management", "Tracking"],
    code: `export const booking = {
  slots: "auto-managed",
  reminders: ["WhatsApp", "email"],
  status: ["pending", "confirmed"]
}`,
  },
  {
    title: "Automation & AI Workflows",
    subtitle: "Workflow automation with integrations (WhatsApp, email, APIs).",
    bullets: [
      "Workflow automation",
      "AI-assisted flows",
      "Integrations",
      "API setup",
    ],
    code: `export const automation = {
  triggers: ["form_submit", "new_order"],
  actions: ["notify", "assign", "follow_up"]
}`,
  },
  {
    title: "Maintenance & Updates",
    subtitle: "Ongoing support so your system stays fast & reliable.",
    bullets: ["Fixes & updates", "Improvements", "Monitoring", "Priority support"],
    code: `export const support = {
  updates: "monthly",
  monitoring: true,
  response: "fast"
}`,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-6 py-24 bg-[#050505] text-white"
    >
      {/* Background Layer (rain) */}
      <BinaryBackground />

      {/* Depth overlay (keeps rain subtle + readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80 pointer-events-none" />

      <motion.div
        variants={sectionFade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto max-w-6xl"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-sm text-cyan-300/90">
              &gt; capabilities.list()
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              <BinaryRevealText
                text="What we build"
                durationMs={2200}
                delayMs={120}
              />
            </h2>

            <p className="mt-3 max-w-2xl text-white/75">
              <BinaryRevealText
                text="Modern websites, software, and automation for small businesses—built with clean UI and real engineering standards."
                durationMs={2600}
                delayMs={220}
              />
            </p>
          </div>

          {/* Targets box */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4">
            <div className="font-mono text-xs text-white/60">{">"} targets</div>
            <div className="mt-1 text-sm text-white/85">
              Smooth UI • Fast Loads • Trust
            </div>
          </div>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2"
        >
          {services.map((s, i) => (
  <motion.div
    key={s.title}
    variants={cardAnim}
    className={i === services.length - 1 ? "md:col-span-2" : ""}
  >

            <TiltCard className="h-full" maxTilt={9} perspective={1100} scale={1.02} lift={6}>
  <GlowCard className="h-full">
    {/* Title decode */}
    <div className="font-mono text-sm text-cyan-200">
      {">"}{" "}
      <BinaryRevealText text={s.title} durationMs={1800} delayMs={140} />
    </div>

    {/* Subtitle decode */}
    <p className="mt-2 text-white/75 text-sm">
      <BinaryRevealText text={s.subtitle} durationMs={2200} delayMs={240} />
    </p>

    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <ul className="space-y-2 text-xs text-white/70">
        {s.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-cyan-400">▸</span>
            <span>
              <BinaryRevealText text={b} durationMs={1400} delayMs={280} />
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-white/10 bg-black/45 p-3 font-mono text-[10px] leading-relaxed text-cyan-100/60">
        <pre className="whitespace-pre-wrap">{s.code}</pre>
      </div>
    </div>
  </GlowCard>
</TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Card */}
        <div className="mt-10">
          <GlowCard>
            <div className="font-mono text-sm text-cyan-200">
              {">"}{" "}
              <BinaryRevealText
                text="low_risk_start"
                durationMs={1800}
                delayMs={160}
              />
            </div>

            <p className="mt-2 text-white/80">
              <BinaryRevealText
                text="For selected business types, we can provide a starter website preview so you can evaluate direction before committing."
                durationMs={2600}
                delayMs={240}
              />
            </p>

            <p className="mt-1 text-sm text-white/55 font-mono">
              *websites only • eligibility depends on business type
            </p>
          </GlowCard>
        </div>
      </motion.div>
    </section>
  );
}