"use client";

import React from "react";
import { ScoreCategory } from "../types/analysis";

interface ScoreBreakdownProps {
  items: ScoreCategory[];
}

function getBarColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "bg-emerald-500";
  if (percentage >= 70) return "bg-blue-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function getTextColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "text-emerald-400";
  if (percentage >= 70) return "text-blue-400";
  if (percentage >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  const totalScore = items.reduce((acc, item) => acc + item.score, 0);
  const totalMax = items.reduce((acc, item) => acc + item.maxScore, 0);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Score Breakdown
        </h2>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {totalScore}/{totalMax}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage = (item.score / item.maxScore) * 100;
          const barColor = getBarColor(item.score, item.maxScore);
          const textColor = getTextColor(item.score, item.maxScore);

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {item.category}
                </span>
                <span className={`text-sm font-semibold font-mono ${textColor}`}>
                  {item.score}/{item.maxScore}
                </span>
              </div>

              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {item.description && (
                <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
