"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solve } from "@/lib/solver";

interface Props {
  numbers: number[];
  target: number;
  onNewRound: () => void;
}

export default function SolutionBox({ numbers, target, onNewRound }: Props) {
  const [result, setResult] = useState<ReturnType<typeof solve> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function reveal() {
    setResult(solve(numbers, target));
    // Auto-scroll to results after they render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      {!result ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={reveal}
          className="px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all glow-gold"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))",
            border: "1px solid rgba(212,175,55,0.5)",
            color: "var(--gold)",
          }}
        >
          Reveal Solutions
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            ref={resultsRef}
            key="solutions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass rounded-2xl p-5 flex flex-col gap-4"
          >
            {/* Result badge */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Result</p>
              <p
                className="led text-4xl font-bold"
                style={{
                  color: result.diff === 0 ? "var(--blue)" : result.diff <= 2 ? "var(--gold)" : "#ff8800",
                }}
              >
                {result.closest}
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: proximityColor(result.diff) }}>
                {proximityMessage(result.diff)}
              </p>
            </div>

            {/* Step-by-step solutions */}
            {result.expressions.length > 0 && (
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                <p className="text-xs uppercase tracking-widest opacity-40">
                  {result.expressions.length === 1 ? "1 solution path" : `${result.expressions.length} solution paths`}
                </p>
                {result.expressions.map((expr, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: "rgba(0,242,255,0.05)",
                      border: "1px solid rgba(0,242,255,0.12)",
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {expr.split(", ").map((step, j) => (
                      <div key={j}>{step}</div>
                    ))}
                  </motion.div>
                ))}
              </div>
            )}

            <button
              onClick={onNewRound}
              className="mt-2 w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "var(--gold)",
              }}
            >
              New Round
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {!result && (
        <button
          onClick={onNewRound}
          className="text-xs uppercase tracking-widest opacity-30 hover:opacity-60 transition-opacity"
          style={{ color: "var(--gold)" }}
        >
          Skip — New Round
        </button>
      )}
    </div>
  );
}

function proximityMessage(diff: number): string {
  if (diff === 0) return "Exact match!";
  if (diff === 1) return "Just 1 away — so close!";
  if (diff === 2) return "Only 2 away — very close!";
  return `Closest achievable: off by ${diff}`;
}

function proximityColor(diff: number): string {
  if (diff === 0) return "var(--blue)";
  if (diff <= 2) return "var(--gold)";
  return "#ff8800";
}
