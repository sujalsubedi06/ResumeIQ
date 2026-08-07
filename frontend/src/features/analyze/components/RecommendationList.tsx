"use client";

import React from "react";
import { Recommendation } from "../types/analysis";
import { RecommendationCard } from "./RecommendationCard";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const highPriority = recommendations.filter((r) => r.priority === "high");
  const mediumPriority = recommendations.filter((r) => r.priority === "medium");
  const lowPriority = recommendations.filter((r) => r.priority === "low");

  const sortedRecommendations = [...highPriority, ...mediumPriority, ...lowPriority];

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Recommendations
        </h2>
        <div className="flex items-center gap-3">
          {highPriority.length > 0 && (
            <span className="text-xs text-red-400 font-mono">
              {highPriority.length} high
            </span>
          )}
          {mediumPriority.length > 0 && (
            <span className="text-xs text-yellow-400 font-mono">
              {mediumPriority.length} medium
            </span>
          )}
          {lowPriority.length > 0 && (
            <span className="text-xs text-blue-400 font-mono">
              {lowPriority.length} low
            </span>
          )}
        </div>
      </div>

      {sortedRecommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--text-muted)]">No recommendations available.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
}
