"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AnalysisReport } from "../types/analysis";
import { ReportHeader } from "./ReportHeader";
import { ScoreCard } from "./ScoreCard";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { SectionAnalysis } from "./SectionAnalysis";
import { SkillsAnalysis } from "./SkillsAnalysis";
import { ExperienceReview } from "./ExperienceReview";
import { RecommendationList } from "./RecommendationList";
import {
  staggerContainer,
  fadeUpItem,
  springSnappy,
  pageTransition,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
  scrollRevealScale,
} from "@/lib/animations";

interface ReportProps {
  report: AnalysisReport;
  onReset: () => void;
  onAnalyzeNew?: (file: File, jobDescription?: string) => void;
}

export function Report({ report, onReset, onAnalyzeNew }: ReportProps) {

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageTransition}
        className="max-w-6xl mx-auto space-y-8"
        role="region"
        aria-live="polite"
        aria-label="Resume analysis report"
      >
        {/* Report Header */}
        <motion.div {...scrollReveal}>
          <ReportHeader
            resume={report.resume}
            overviewStats={report.overviewStats}
            executiveSummary={report.executiveSummary}
          />
        </motion.div>

        {/* Score Overview — Dramatic two-column reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...scrollRevealLeft}>
            <ScoreCard score={report.score.overall} rating={report.score.rating} />
          </motion.div>
          <motion.div {...scrollRevealRight}>
            <ScoreBreakdown items={report.score.breakdown} />
          </motion.div>
        </div>

        {/* Analysis Details — Staggered reveal */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUpItem}>
            <SectionAnalysis sections={report.sections} />
          </motion.div>
          <motion.div variants={fadeUpItem}>
            <SkillsAnalysis skills={report.skills} />
          </motion.div>
        </motion.div>

        {/* Experience Review — Scale reveal */}
        <motion.div {...scrollRevealScale}>
          <ExperienceReview experience={report.experience} />
        </motion.div>

        {/* Recommendations — Stagger reveal */}
        <motion.div {...scrollReveal}>
          <RecommendationList recommendations={report.recommendations} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-[var(--border)]"
        >
          <p className="text-xs text-[var(--text-muted)]">
            Analysis completed • ResumeIQ v1.0
          </p>
          <div className="w-full sm:w-auto flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={springSnappy}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Another Resume
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

    </>
  );
}
