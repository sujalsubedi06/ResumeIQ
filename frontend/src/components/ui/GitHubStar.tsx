"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";
import { springSnappy } from "@/lib/animations";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface GitHubStarProps {
  variant?: "badge" | "minimal";
}

export function GitHubStar({ variant = "badge" }: GitHubStarProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/github/stars`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stars != null) {
          setStars(data.stars);
        }
      })
      .catch(() => {});
  }, []);

  if (variant === "minimal") {
    return (
      <motion.a
        href="https://github.com/sujalsubedi06/ResumeIQ"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="GitHub repository"
      >
        <GitHubIcon className="w-3.5 h-3.5" />
        {stars !== null && <span>{stars}</span>}
      </motion.a>
    );
  }

  return (
    <motion.a
      href="https://github.com/sujalsubedi06/ResumeIQ"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
    >
      <GitHubIcon className="w-4 h-4" />
      <span>Star on GitHub</span>

      {stars !== null && (
        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] pl-1.5 border-l border-[var(--border)]">
          <span className="text-amber-400">★</span>
          {stars.toLocaleString()}
        </span>
      )}
    </motion.a>
  );
}