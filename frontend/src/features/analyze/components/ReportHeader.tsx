"use client";

import React from "react";
import { FileText, Calendar, BarChart3, Layout } from "lucide-react";
import { ResumeMetadata, OverviewStats } from "../types/analysis";

interface ReportHeaderProps {
  resume: ResumeMetadata;
  overviewStats: OverviewStats;
  executiveSummary?: string;
}

export function ReportHeader({ resume, overviewStats, executiveSummary }: ReportHeaderProps) {
  const fileSizeKB = (resume.fileSizeBytes / 1024).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Resume Analysis
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Comprehensive evaluation of your resume against ATS compatibility standards.
        </p>
      </div>

      {/* Document Info Bar */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[250px]">
              {resume.fileName}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{resume.fileType.toUpperCase()} Document</p>
          </div>
        </div>

        <div className="h-6 w-px bg-[var(--border)]" />

        <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{overviewStats.pages} pages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{overviewStats.words} words</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{overviewStats.sections} sections</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{overviewStats.skillsFound} skills</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{fileSizeKB} KB</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-3">
            Executive Summary
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{executiveSummary}</p>
        </div>
      )}
    </div>
  );
}
