"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lightbulb, ArrowRight, ChevronDown } from "lucide-react";
import { Recommendation } from "../types/analysis";
import { springSnappy, springNatural } from "@/lib/animations";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    accentColor: "bg-red-400",
    label: "HIGH PRIORITY",
  },
  medium: {
    icon: Lightbulb,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
    accentColor: "bg-yellow-400",
    label: "MEDIUM PRIORITY",
  },
  low: {
    icon: Lightbulb,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    accentColor: "bg-blue-400",
    label: "LOW PRIORITY",
  },
};

const suggestionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = priorityConfig[recommendation.priority];
  const Icon = config.icon;
  const hasSuggestion = !!recommendation.suggestion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.005 }}
      transition={springNatural}
      className={`relative rounded-xl border ${config.borderColor} ${config.bgColor} overflow-hidden group cursor-default`}
    >
      {/* Left accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${config.accentColor} rounded-l-full opacity-80`} />

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl`}
        style={{
          background: `radial-gradient(500px circle at 0% 50%, rgba(255,255,255,0.04), transparent 60%)`,
        }}
      />

      <div className="relative p-5 pl-6">
        {/* Header with priority badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
              transition={{ duration: 0.3 }}
              className={`p-1.5 rounded-lg ${config.bgColor} ${config.borderColor} border`}
            >
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            </motion.div>
            <span className={`text-[10px] font-semibold tracking-wider ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Expand/collapse toggle (only if has suggestion) */}
          {hasSuggestion && (
            <motion.button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={springSnappy}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              aria-label={isExpanded ? "Collapse suggestion" : "Expand suggestion"}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 pr-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">
            {recommendation.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
            {recommendation.description}
          </p>
        </div>

        {/* Expandable Suggestion */}
        <AnimatePresence initial={false}>
          {hasSuggestion && isExpanded && (
            <motion.div
              key="suggestion"
              variants={suggestionVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2.5 pt-4 mt-4 border-t border-[var(--border)]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springSnappy}
                >
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
                </motion.div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                    Suggestion
                  </p>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {recommendation.suggestion}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always-visible hint for collapsed suggestion */}
        {hasSuggestion && !isExpanded && (
          <div className="mt-3">
            <motion.button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors group/hint"
            >
              <span>View suggestion</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
