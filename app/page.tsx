"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "@/components/Timer";
import NumberCard from "@/components/NumberCard";
import Workspace from "@/components/Workspace";
import SolutionBox from "@/components/SolutionBox";
import { generateNumbers, generateTarget } from "@/lib/gameUtils";

/** The five game states */
type GameState = "SETUP" | "PLAYING" | "TIME_UP";

const LARGE_OPTIONS = [0, 1, 2, 3, 4];

export default function Home() {
  const [state, setState] = useState<GameState>("SETUP");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);

  /** User picks how many large numbers → generate everything → start round */
  function startRound(largeCount: number) {
    setNumbers(generateNumbers(largeCount));
    setTarget(generateTarget());
    setState("PLAYING");
  }

  /** Timer callback — game stays open, Reveal button appears */
  const handleTimeUp = useCallback(() => setState("TIME_UP"), []);

  /** Full reset back to SETUP */
  function newRound() {
    setNumbers([]);
    setTarget(0);
    setState("SETUP");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 pb-40 pt-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,242,255,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Logo / title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <span
          className="led text-4xl md:text-5xl font-bold tracking-widest uppercase"
          style={{ color: "var(--gold)" }}
        >
          Countdown
        </span>
        <br />
        <span className="text-xs uppercase tracking-[0.4em] opacity-40">
          Numbers Game
        </span>
      </motion.h1>

      <AnimatePresence mode="wait">
        {/* ── SETUP ─────────────────────────────────────────── */}
        {state === "SETUP" && (
          <motion.section
            key="setup"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center gap-8 w-full max-w-sm"
          >
            <div className="glass rounded-2xl p-6 flex flex-col items-center gap-6 w-full">
              <p className="text-center text-sm uppercase tracking-widest opacity-60">
                How many large numbers?
              </p>
              <p className="text-center text-xs opacity-30">
                Large: 25, 50, 75, 100 &nbsp;·&nbsp; Small: 1–10
              </p>

              <div className="flex gap-3">
                {LARGE_OPTIONS.map((n) => (
                  <motion.button
                    key={n}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => startRound(n)}
                    className="w-12 h-12 rounded-xl font-bold text-lg transition-all glow-gold glass"
                    style={{ color: "var(--gold)", border: "1px solid rgba(212,175,55,0.4)" }}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── PLAYING + TIME_UP ─────────────────────────────── */}
        {(state === "PLAYING" || state === "TIME_UP") && (
          <motion.section
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 w-full max-w-lg"
          >
            {/* Target */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="flex flex-col items-center"
            >
              <p className="text-xs uppercase tracking-widest opacity-40 mb-1">Target</p>
              <span
                className="led text-6xl md:text-7xl font-bold glow-blue"
                style={{ color: "var(--blue)" }}
              >
                {target}
              </span>
            </motion.div>

            {/* Timer — only animates during PLAYING */}
            <Timer onTimeUp={handleTimeUp} running={state === "PLAYING"} />

            {/* Number tiles */}
            <div className="flex flex-wrap gap-3 justify-center">
              {numbers.map((n, i) => (
                <NumberCard key={i} value={n} index={i} />
              ))}
            </div>

            {/* TIME_UP: reveal + new round */}
            {state === "TIME_UP" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <SolutionBox
                  numbers={numbers}
                  target={target}
                  onNewRound={newRound}
                />
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Workspace scratch-pad — only visible during a round */}
      {(state === "PLAYING" || state === "TIME_UP") && (
        <Workspace numbers={numbers} />
      )}
    </main>
  );
}
