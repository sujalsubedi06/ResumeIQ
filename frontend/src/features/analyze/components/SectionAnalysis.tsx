"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { SectionResult } from "../types/analysis";

interface SectionAnalysisProps {
  sections: SectionResult[];
}

const qualityConfig = {
  strong: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    label: "Strong",
  },
  acceptable: {
    icon: CheckCircle2,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    label: "Acceptable",
  },
  weak: {
    icon: AlertCircle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
    label: "Weak",
  },
  missing: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    label: "Missing",
  },
};

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  const foundCount = sections.filter((s) => s.exists).length;
  const totalCount = sections.length;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Resume Sections
        </h2>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {foundCount}/{totalCount} detected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((section) => {
          const config = qualityConfig[section.quality];
          const Icon = config.icon;

          return (
            <div
              key={section.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {section.name}
                </span>
              </div>
              <span className={`text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
