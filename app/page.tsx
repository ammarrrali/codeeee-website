"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import FxBackground from "../components/FxBackground";
import BinaryDecodeText from "../components/BinaryDecodeText";
import Services from "../components/Services";
import Process from "../components/Trust";
import ScrollCue from "../components/ScrollCue";
import MagneticButton from "../components/MagneticButton";
import Trust from "../components/Trust";
import Contact from "../components/Contact";
import Chatbot from "../components/Chatbot";
import ConsultationFunnel from "../components/ConsultationFunnel";
import SystemStatus from "../components/SystemStatus";
import CapabilitiesReel from "../components/CapabilitiesReel";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Home() {
  const goToServices = () => {
    const el = document.getElementById("services");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToContact = () => {
  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

useEffect(() => {
  if (window.location.hash) {
    // remove #contact or any hash so reload stays at hero
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-screen px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FxBackground />
        </div>

        <ScrollCue />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center">
          <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
            {/* LEFT */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="text-center md:text-left"
            >
              <motion.p
                variants={fadeUp}
                className="mb-4 font-mono text-sm text-cyan-300"
              >
                &gt; software_for_small_businesses
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
              >
                We build <span className="text-cyan-300">websites</span> <br />
                that look like <span className="text-cyan-300">software</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-white/80 drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
              >
                CODEEEE is a mid-budget software company building modern websites
                and systems for all types of small businesses.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-4 md:justify-start justify-center"
              >
                <MagneticButton
                  onClick={goToContact}
                  strength={18}
                  className="rounded-xl bg-cyan-400 px-6 py-3 text-black font-mono hover:bg-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                >
                  {" > "}
                  <BinaryDecodeText
                    text="get_free_consultation"
                    delayMs={320}
                    durationMs={750}
                    binaryOnly={true}
                  />
                </MagneticButton>

                <MagneticButton
                  onClick={goToServices}
                  strength={14}
                  className="rounded-xl border border-cyan-300 px-6 py-3 font-mono text-cyan-200 hover:bg-cyan-500/10"
                >
                  {" > "}
                  <BinaryDecodeText
                    text="view_services"
                    delayMs={450}
                    durationMs={750}
                    binaryOnly={true}
                  />
                </MagneticButton>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-2 md:justify-start justify-center text-xs text-white/70"
              >
                {["Python", "Java", "Web Apps", "APIs", "Automation", "SEO"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono backdrop-blur"
                    >
                      {t}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.12)]">
                <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  <span className="ml-3 font-mono text-xs text-white/70">
                    /src/CODEEEE.build.ts
                  </span>
                </div>

                <pre className="p-5 text-[12px] leading-6 text-white/85 font-mono">
{`export const codeeee = {
  product: "Websites + Software",
  audience: "Small Businesses",
  quality: "Premium UI + Fast Performance",
  stack: ["Next.js", "Java", "Python", "APIs"],
  delivery: "Days, not weeks",
}

> run codeeee.deploy()
✓ UI: modern + smooth
✓ SEO: ready
✓ Speed: optimized
✓ Trust: engineered`}
                </pre>
              </div>

              <div className="absolute -inset-10 -z-10 blur-3xl opacity-40 bg-[radial-gradient(circle_at_40%_40%,rgba(34,211,238,0.35),transparent_60%)]" />
            </motion.div>
          </div>
        </div>
      </section>

       <CapabilitiesReel />



      {/* SERVICES */}
      <Services />

      {/* PROCESS */}
      <Trust />
      <SystemStatus />



      <ConsultationFunnel />
      {/* CONTACT */}
      <Contact />

      <Chatbot />
    </main>
  );
}