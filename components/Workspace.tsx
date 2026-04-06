"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Delete } from "lucide-react";

interface Props {
  numbers: number[];
}

const OPERATORS = ["+", "−", "×", "÷"];

/**
 * Collapsible bottom-sheet scratch-pad.
 * Lets the user click number tiles and operators to build an equation string.
 * Tracks which number slots have been used (by index) to prevent reuse.
 * No submission — purely for working out the answer mentally.
 */
export default function Workspace({ numbers }: Props) {
  const [open, setOpen] = useState(false);
  const [equation, setEquation] = useState<string[]>([]); // tokens
  // Track which number indices have been placed
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  function addNumber(value: number, index: number) {
    if (usedIndices.has(index)) return;
    setEquation((prev) => [...prev, String(value)]);
    setUsedIndices((prev) => new Set(prev).add(index));
  }

  function addOperator(op: string) {
    // Don't allow two operators in a row or operator at start
    const last = equation[equation.length - 1];
    if (!last || OPERATORS.includes(last)) return;
    setEquation((prev) => [...prev, op]);
  }

  function backspace() {
    setEquation((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      // If the last token is a number, free its index
      const numVal = Number(last);
      if (!isNaN(numVal) && !OPERATORS.includes(last)) {
        // Find the first used index with this value to free
        const freed = numbers.findIndex(
          (n, i) => n === numVal && usedIndices.has(i)
        );
        if (freed !== -1) {
          setUsedIndices((s) => {
            const next = new Set(s);
            next.delete(freed);
            return next;
          });
        }
      }
      return prev.slice(0, -1);
    });
  }

  function clear() {
    setEquation([]);
    setUsedIndices(new Set());
  }

  const display = equation.join(" ") || "tap numbers to build equation";
  const isEmpty = equation.length === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      {/* Toggle handle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="mx-auto flex items-center gap-2 px-6 py-2 rounded-t-2xl border-b-0 text-sm uppercase tracking-widest transition-colors"
        style={{
          color: "var(--gold)",
          display: "flex",
          background: "rgba(0, 15, 45, 0.92)",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      >
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronUp size={16} />
        </motion.span>
        Workspace
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="workspace"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-t overflow-hidden"
            style={{
              background: "rgba(0, 15, 45, 0.96)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderColor: "rgba(212,175,55,0.3)",
            }}
          >
            <div className="max-w-lg mx-auto p-4 flex flex-col gap-4">
              {/* Equation display */}
              <div
                className="rounded-lg px-4 py-3 min-h-12 text-center text-lg tracking-wide"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: isEmpty ? "rgba(255,255,255,0.2)" : "var(--blue)",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                {display}
              </div>

              {/* Number buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {numbers.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => addNumber(n, i)}
                    disabled={usedIndices.has(i)}
                    className="w-14 h-14 rounded-xl font-bold text-lg transition-all glow-gold glass"
                    style={{
                      color: usedIndices.has(i) ? "rgba(212,175,55,0.25)" : "var(--gold)",
                      borderColor: usedIndices.has(i) ? "rgba(212,175,55,0.1)" : undefined,
                      cursor: usedIndices.has(i) ? "not-allowed" : "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Operator + control row */}
              <div className="flex gap-2 justify-center">
                {OPERATORS.map((op) => (
                  <button
                    key={op}
                    onClick={() => addOperator(op)}
                    className="w-12 h-12 rounded-xl text-xl font-bold glass transition-all"
                    style={{ color: "var(--blue)" }}
                  >
                    {op}
                  </button>
                ))}
                <button
                  onClick={backspace}
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center transition-all"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <Delete size={18} />
                </button>
                <button
                  onClick={clear}
                  className="px-4 h-12 rounded-xl glass text-sm uppercase tracking-widest transition-all"
                  style={{ color: "rgba(255,100,100,0.7)" }}
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
