"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  index: number;
  used?: boolean;
}

/**
 * A single number tile with glassmorphism style and staggered entrance animation.
 * Dims when `used` is true (number has been placed in the Workspace).
 */
export default function NumberCard({ value, index, used = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{ opacity: used ? 0.3 : 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 18 }}
      className="glass glow-gold relative flex items-center justify-center rounded-xl flex-1 min-w-0 aspect-square cursor-default select-none"
    >
      {/* Gold gradient text */}
      <span
        className="text-2xl md:text-3xl font-bold"
        style={{ color: "var(--gold)" }}
      >
        {value}
      </span>

      {/* Subtle top-edge highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent rounded-t-xl" />
    </motion.div>
  );
}
