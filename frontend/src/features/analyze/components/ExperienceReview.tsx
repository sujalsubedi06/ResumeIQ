"use client";

import React from "react";
import { Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { ExperienceAnalysis as ExperienceAnalysisType } from "../types/analysis";

interface ExperienceReviewProps {
  experience: ExperienceAnalysisType;
}

export function ExperienceReview({ experience }: ExperienceReviewProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Experience Review
        </h2>
        <Briefcase className="w-4 h-4 text-[var(--text-muted)]" />
      </div>

      <div className="space-y-4">
        {/* Metrics Check */}
        <div className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg">
          <div className="flex items-center gap-3">
            {experience.hasMetrics ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Measurable Achievements</p>
              <p className="text-xs text-[var(--text-muted)]">
                {experience.hasMetrics
                  ? "Your resume includes quantified results"
                  : "Add metrics to demonstrate impact"}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold ${
              experience.hasMetrics ? "text-emerald-400" : "text-yellow-400"
            }`}
          >
            {experience.hasMetrics ? "Found" : "Missing"}
          </span>
        </div>

        {/* Score Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg space-y-2">
            <span className="text-xs text-[var(--text-muted)]">Action Verbs</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${experience.actionVerbScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                {experience.actionVerbScore}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg space-y-2">
            <span className="text-xs text-[var(--text-muted)]">Impact Score</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${experience.impactScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                {experience.impactScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{experience.summary}</p>
        </div>
      </div>
    </div>
  );
}
