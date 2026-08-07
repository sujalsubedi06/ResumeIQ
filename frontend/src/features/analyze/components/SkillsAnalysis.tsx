"use client";

import React from "react";
import { Code, AlertTriangle, Check } from "lucide-react";
import { SkillAnalysis as SkillAnalysisType } from "../types/analysis";

interface SkillsAnalysisProps {
  skills: SkillAnalysisType;
}

export function SkillsAnalysis({ skills }: SkillsAnalysisProps) {
  const totalDetected = skills.detected.length;
  const totalMissing = skills.missing.length;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Skills Analysis
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 font-mono">
            {totalDetected} detected
          </span>
          {totalMissing > 0 && (
            <span className="text-xs text-yellow-400 font-mono">
              {totalMissing} missing
            </span>
          )}
        </div>
      </div>

      {/* Detected Skills */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Detected Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.detected.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      {totalMissing > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.missing.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-medium bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skill Categories */}
      {skills.categories.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--text-secondary)]" />
            Skill Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.categories.map((category) => (
              <div
                key={category.category}
                className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg space-y-2"
              >
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {category.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[10px] font-medium bg-[var(--border)] rounded text-[var(--text-primary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
