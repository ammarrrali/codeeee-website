"use client";

import { useState } from "react";
import GlowCard from "./GlowCard";

const steps = [
  {
    id: "business",
    title: "Business type",
    options: ["Local business", "Online store", "Service provider", "Startup / SaaS", "Other"],
  },
  {
    id: "need",
    title: "What do you need?",
    options: ["Website", "Booking system", "Web app / portal", "Automation", "Maintenance"],
    multi: true,
  },
  {
    id: "timeline",
    title: "Timeline",
    options: ["ASAP", "2–4 weeks", "1–2 months", "Not sure"],
  },
  {
    id: "budget",
    title: "Budget comfort (optional)",
    options: ["Minimal", "Medium", "Flexible", "Not sure"],
  },
];

export default function ConsultationFunnel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const current = steps[step];

  const toggleOption = (value: string) => {
    const key = current.id;
    const prev = answers[key] || [];

    if (current.multi) {
      setAnswers({
        ...answers,
        [key]: prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      });
    } else {
      setAnswers({ ...answers, [key]: [value] });
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    const brief = `
> project.brief
Business: ${answers.business?.join(", ") || "—"}
Need: ${answers.need?.join(", ") || "—"}
Timeline: ${answers.timeline?.join(", ") || "—"}
Budget: ${answers.budget?.join(", ") || "—"}
`.trim();

    localStorage.setItem("codeeee_brief", brief);

// notify Contact immediately
window.dispatchEvent(new Event("codeeee:brief"));

document.getElementById("contact")?.scrollIntoView({
  behavior: "smooth",
  block: "start",
});
  };

  return (
    <GlowCard>
      <div className="font-mono text-sm text-cyan-200">
        {">"} consultation.start()
      </div>

      {step < steps.length ? (
        <>
          <h3 className="mt-4 text-lg font-semibold">{current.title}</h3>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {current.options.map((opt) => {
              const selected = answers[current.id]?.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className={`rounded-xl border px-4 py-2 font-mono text-sm transition
                    ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/30"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            {step > 0 && (
              <button
                onClick={back}
                className="font-mono text-xs text-white/60 hover:text-white"
              >
                ← back
              </button>
            )}

            <button
              onClick={next}
              className="ml-auto rounded-xl bg-cyan-400 px-5 py-2 font-mono text-sm text-black hover:brightness-110"
            >
              next →
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-4 text-lg font-semibold">Ready for consultation</h3>

          <p className="mt-2 text-white/70 text-sm">
            We’ve prepared a short technical brief based on your answers.
          </p>

          <button
            onClick={finish}
            className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-mono text-sm text-black hover:brightness-110"
          >
            {">"} continue_to_contact
          </button>
        </>
      )}
    </GlowCard>
  );
}