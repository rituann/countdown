"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";

const DURATION = 30; // seconds
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  onTimeUp: () => void;
  running: boolean;
}

/**
 * Circular 30-second countdown timer using Framer Motion.
 * Drives a SVG strokeDashoffset from 0 → CIRCUMFERENCE as time runs out.
 * Color shifts gold → red in the final 10 seconds.
 * Fires `onTimeUp` once when it reaches zero.
 */
export default function Timer({ onTimeUp, running }: Props) {
  const progress = useMotionValue(0); // 0 = full, 1 = empty
  const firedRef = useRef(false);
  const [displaySeconds, setDisplaySeconds] = useState(DURATION);
  const [strokeColor, setStrokeColor] = useState("#d4af37");

  // Map progress (0→1) to stroke offset (0→CIRCUMFERENCE)
  const dashOffset = useTransform(progress, [0, 1], [0, CIRCUMFERENCE]);

  useEffect(() => {
    if (!running) return;
    firedRef.current = false;
    progress.set(0);
    setDisplaySeconds(DURATION);
    setStrokeColor("#d4af37");

    const controls = animate(progress, 1, {
      duration: DURATION,
      ease: "linear",
      onUpdate(v) {
        // Update displayed seconds
        const secs = Math.max(0, Math.ceil(DURATION * (1 - v)));
        setDisplaySeconds(secs);

        // Shift colour: gold → orange → red over final third
        if (v < 0.667) {
          setStrokeColor("#d4af37");
        } else if (v < 0.9) {
          setStrokeColor("#ff8800");
        } else {
          setStrokeColor("#ff4444");
        }

        if (v >= 1 && !firedRef.current) {
          firedRef.current = true;
          onTimeUp();
        }
      },
      onComplete() {
        setDisplaySeconds(0);
        if (!firedRef.current) {
          firedRef.current = true;
          onTimeUp();
        }
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              stroke: strokeColor,
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>

        {/* Countdown number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="led text-3xl font-bold"
            style={{ color: strokeColor }}
          >
            {displaySeconds}
          </span>
        </div>
      </div>

      <span className="text-xs uppercase tracking-widest opacity-40">seconds</span>
    </div>
  );
}
