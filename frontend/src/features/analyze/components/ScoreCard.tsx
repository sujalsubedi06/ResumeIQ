"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreCardProps {
  score: number;
  rating: "excellent" | "good" | "average" | "needs_improvement";
  label?: string;
}

const ratingConfig = {
  excellent: {
    text: "Excellent Compatibility",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    barColor: "bg-emerald-500",
    glowColor: "rgba(34, 197, 94, 0.15)",
    icon: TrendingUp,
    description: "Your resume is well-optimized for ATS systems.",
  },
  good: {
    text: "Good Compatibility",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    barColor: "bg-blue-500",
    glowColor: "rgba(59, 130, 246, 0.15)",
    icon: TrendingUp,
    description: "Your resume performs well but has room for improvement.",
  },
  average: {
    text: "Average Compatibility",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
    barColor: "bg-yellow-500",
    glowColor: "rgba(234, 179, 8, 0.15)",
    icon: Minus,
    description: "Your resume meets basic ATS requirements.",
  },
  needs_improvement: {
    text: "Needs Improvement",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    barColor: "bg-red-500",
    glowColor: "rgba(239, 68, 68, 0.15)",
    icon: TrendingDown,
    description: "Your resume needs significant improvements for ATS systems.",
  },
};

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

export function ScoreCard({ score, rating, label = "ATS SCORE" }: ScoreCardProps) {
  const config = ratingConfig[rating];
  const Icon = config.icon;
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, { once: true });

  const getScoreBarColor = () => config.barColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
      className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 relative overflow-hidden"
    >
      {/* Subtle glow behind score */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 opacity-40 blur-3xl pointer-events-none"
        style={{ background: config.glowColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            {label}
          </h2>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring" as const, stiffness: 500, damping: 20, delay: 0.2 }}
            className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
          >
            <Icon className={`w-4 h-4 ${config.color}`} />
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" as const, stiffness: 200, damping: 20, delay: 0.1 }}
              className="text-5xl font-bold text-[var(--text-primary)]"
            >
              <AnimatedCounter value={score} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-lg text-[var(--text-muted)] font-medium"
            >
              / 100
            </motion.span>
          </div>

          {/* Score Bar with animated fill */}
          <div
            ref={barRef}
            className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden relative"
            role="meter"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="ATS compatibility score"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${Math.min(100, Math.max(0, score))}%` } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className={`h-full rounded-full ${getScoreBarColor()} relative`}
            >
              {/* Shimmer effect on bar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "200%" } : {}}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={`flex items-center gap-2 ${config.color}`}
            >
              <span className="text-sm font-semibold">{config.text}</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-[var(--text-muted)] font-mono"
            >
              {score}/100
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-sm text-[var(--text-secondary)] pt-1"
          >
            {config.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
