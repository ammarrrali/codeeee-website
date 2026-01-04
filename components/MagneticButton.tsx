"use client";

import { ReactNode, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number; // 10-24 feels good
};

export default function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
  strength = 16,
}: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);

      // normalized (-1..1)
      const nx = mx / (r.width / 2);
      const ny = my / (r.height / 2);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${(nx * strength).toFixed(2)}px, ${(
          ny * strength
        ).toFixed(2)}px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(0px, 0px)`;
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`will-change-transform transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.button>
  );
}