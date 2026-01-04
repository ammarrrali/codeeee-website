"use client";

import { motion } from "framer-motion";

export default function ScrollCue() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
        className="relative"
      >
        {/* outer capsule */}
        <div className="relative h-12 w-7 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl">
          {/* inner glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.22),transparent_60%)]" />

          {/* animated dot */}
          <motion.div
            animate={{ y: [2, 24, 2] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1 -translate-x-1/2"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300/90 shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
          </motion.div>
        </div>

        {/* subtle ring pulse behind */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.18, 0.0, 0.18], scale: [1, 1.35, 1] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-xl"
        />
      </motion.div>
    </div>
  );
}