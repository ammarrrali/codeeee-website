"use client";

import { motion } from "framer-motion";
import GlowCard from "./GlowCard";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function SystemStatus() {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      className="mx-auto mt-10 max-w-6xl px-6"
    >
      <GlowCard>
        <div className="font-mono text-sm text-cyan-200">
          {">"} system.status()
        </div>

        <ul className="mt-3 space-y-1 font-mono text-xs text-white/80">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            accepting new consultations
          </li>

          <li className="flex items-center gap-2">
            <span className="text-cyan-300">✓</span>
            response time: same day
          </li>

          <li className="flex items-center gap-2">
            <span className="text-cyan-300">✓</span>
            timezone: PKT (UTC+5)
          </li>

          <li className="flex items-center gap-2">
            <span className="text-cyan-300">✓</span>
            stack: operational
          </li>
        </ul>
      </GlowCard>
    </motion.div>
  );
}