"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Shield,
  Layout,
  BarChart3,
  Code,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Upload,
  Search,
  Zap,
  Blocks,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MobileHeader, Sidebar, MobileNavBar } from "@/components/layout/Sidebar";
import {
  springSnappy,
  springBouncy,
} from "@/lib/animations";

// ─── Navigation Sections ───────────────────────────────────────
const navSections = [
  { id: "overview", label: "Overview", icon: BookOpen, description: "What ResumeIQ is and how it works" },
  { id: "quickstart", label: "Quick Start", icon: Sparkles, description: "Upload, analyze, improve in 3 steps" },
  { id: "pipeline", label: "Analysis Pipeline", icon: Zap, description: "6-stage processing pipeline" },
  { id: "categories", label: "Categories", icon: Layout, description: "5 evaluation categories explained" },
  { id: "scoring", label: "ATS Scoring", icon: BarChart3, description: "Score calculation & rating scale" },
  { id: "api", label: "API Reference", icon: Code, description: "REST API endpoints & error codes" },
  { id: "privacy", label: "Privacy & Data", icon: Shield, description: "Data handling & security model" },
  { id: "faq", label: "FAQ", icon: Blocks, description: "Common questions answered" },
];

// ─── Pipeline Steps ────────────────────────────────────────────
const pipelineSteps = [
  { icon: Upload, step: "01", title: "Upload", description: "Drop your PDF or DOCX resume file for analysis." },
  { icon: FileText, step: "02", title: "Parse", description: "Document text is extracted using PyMuPDF or python-docx." },
  { icon: Search, step: "03", title: "Detect", description: "Resume sections (Experience, Skills, Education) are identified." },
  { icon: BarChart3, step: "04", title: "Analyze", description: "Skills, formatting, and experience quality are evaluated." },
  { icon: Zap, step: "05", title: "Score", description: "ATS compatibility score is calculated across 5 categories." },
  { icon: Blocks, step: "06", title: "Report", description: "Personalized recommendations and report are generated." },
];

// ─── FAQ Data ──────────────────────────────────────────────────
const faqs = [
  {
    question: "What file formats are supported?",
    answer: "ResumeIQ currently supports PDF and DOCX files up to 10 MB in size. Files are validated for type and size before processing begins. You can optionally provide a job description for keyword alignment analysis.",
  },
  {
    question: "Is my resume stored anywhere?",
    answer: "No. Your resume is processed entirely in memory and deleted immediately after analysis. No data is persisted to disk, database, or external service. No user accounts, no tracking, no storage.",
  },
  {
    question: "How is the ATS score calculated?",
    answer: "The ATS score ranges from 0 to 100 and is calculated from five independent categories: Formatting (20 pts), Sections (20 pts), Skills (20 pts), Experience (20 pts), and Keywords (20 pts). Each category is evaluated using rule-based analysis and combined for the overall score.",
  },
  {
    question: "Can I analyze against a specific job description?",
    answer: "Yes. During upload, you can paste a job description for keyword alignment analysis. The engine will match your resume's keywords against the job description and provide relevance scoring.",
  },
  {
    question: "Is ResumeIQ free to use?",
    answer: "Yes. ResumeIQ is completely free to use with no account required. There are no subscription plans, usage limits, or hidden charges.",
  },
  {
    question: "How long does analysis take?",
    answer: "Most resumes are analyzed within 5 to 10 seconds. Processing time depends on file size and document complexity."
  },
  {
    question: "What happens if my resume has no sections?",
    answer: "The analysis engine can still evaluate the content even without clear section headings, but well-defined sections improve accuracy."
  },
  {
    question: "Can I download or save my analysis report?",
    answer: "Currently the report is displayed on screen only. We recommend taking screenshots before closing the page."
  },
  {
    question: "What kind of recommendations does ResumeIQ provide?",
    answer: "Recommendations cover adding missing sections, measurable achievements, stronger action verbs, and keyword coverage."
  },
  {
    question: "Does ResumeIQ support languages other than English?",
    answer: "The engine is optimized for English. Other languages may have reduced accuracy."
  },
];

// ─── API Code Examples ─────────────────────────────────────────
const apiCodeExamples = [
  {
    title: "Analyze Resume",
    method: "POST" as const,
    endpoint: "/api/v1/analyze",
    description: "Upload a resume file for analysis.",
    request: `curl -X POST http://localhost:8000/api/v1/analyze \\\n  -F "resume=@resume.pdf"`,
    response: `{\n  "success": true,\n  "data": {\n    "score": {\n      "overall": 87,\n      "rating": "excellent",\n      "breakdown": [\n        { "category": "Formatting", "score": 20, "maxScore": 20 },\n        { "category": "Sections",   "score": 18, "maxScore": 20 },\n        { "category": "Skills",     "score": 17, "maxScore": 20 },\n        { "category": "Experience", "score": 19, "maxScore": 20 },\n        { "category": "Keywords",   "score": 13, "maxScore": 20 }\n      ]\n    }\n  }\n}`,
  },
  {
    title: "Health Check",
    method: "GET" as const,
    endpoint: "/api/v1/health",
    description: "Verify backend service availability.",
    request: `curl http://localhost:8000/api/v1/health`,
    response: `{\n  "status": "healthy",\n  "service": "resumeiq-api"\n}`,
  },
];

// ─── Category Data ─────────────────────────────────────────────
const categoryData = [
  { name: "Formatting", points: "20/20", icon: Layout, description: "Evaluates document structure, font consistency, and ATS compatibility of your resume layout.", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { name: "Sections", points: "20/20", icon: FileText, description: "Checks for presence and quality of key resume sections: Summary, Experience, Education, Skills, and Projects.", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { name: "Skills", points: "20/20", icon: Code, description: "Analyzes technical and professional skill coverage, density, and relevance to target roles.", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { name: "Experience", points: "20/20", icon: BarChart3, description: "Evaluates action verb usage, measurable achievements, impact descriptions, and technical depth.", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { name: "Keywords", points: "20/20", icon: Search, description: "Measures keyword density, relevance to industry standards, and alignment with job descriptions.", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
];

// ─── Shared Sub-components ────────────────────────────────────

function CodeBlock({ code, language = "plaintext" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="absolute top-0 left-0 right-0 h-9 bg-[var(--code-bg)] border-b border-[var(--border)] rounded-t-lg flex items-center px-4 gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[10px] text-[var(--text-muted)] font-mono">{language}</span>
        {/* Copy button */}
        <motion.button
          type="button"
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 font-semibold"
            >
              Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </motion.span>
          )}
        </motion.button>
      </div>
      <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg pt-10 pb-4 px-3 sm:px-4 overflow-x-auto">
        {/* text-xs on mobile keeps long curl/json lines readable without heavy horizontal scrolling */}
        <code className="text-xs sm:text-sm text-[var(--code-text)] font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </motion.div>
  );
}

function ExpandableFaq({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div layout className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--border-hover)] transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--text-primary)]/20"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm font-semibold text-[var(--text-primary)] pr-4">{question}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={springSnappy} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-4">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Staggered Content Wrapper ─────────────────────────────────
function StaggerContainer({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.1 + delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page Slide Transition (enhanced with depth) ──────────────
const docEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.92,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: docEase },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
    scale: 0.92,
    filter: "blur(6px)",
    transition: { duration: 0.3, ease: docEase },
  }),
};

// ─── Section Header Decoration ────────────────────────────────
function SectionHeader({ icon: Icon, title, number, total }: { icon: React.ComponentType<{ className?: string }>; title: string; number: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--border)] relative">
      {/* Subtle gradient glow behind icon */}
      <div className="absolute -left-2 -top-2 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--text-primary)]/5 to-transparent blur-xl pointer-events-none" />
      <motion.div
        initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
        className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg relative z-10"
      >
        <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
      </motion.div>
      <div className="flex-1">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: docEase }}
          className="text-2xl font-semibold tracking-tight"
        >
          {title}
        </motion.h2>
      </div>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: docEase }}
        className="text-[10px] font-mono text-[var(--text-muted-strong)] bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-1 rounded-lg"
      >
        {number} / {total}
      </motion.span>
    </div>
  );
}

// ─── Section Renderers ─────────────────────────────────────────

function SectionOverview() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
          ResumeIQ is a resume analysis platform that evaluates resumes against modern Applicant Tracking System (ATS) requirements. The platform analyzes resume structure, content quality, skills alignment, and formatting compatibility to provide actionable improvement recommendations — all without storing or persisting your data.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "File Formats", value: "PDF & DOCX" },
            { label: "Analysis Time", value: "~5\u201310 seconds" },
            { label: "Data Policy", value: "Zero persistence" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 text-center group hover:border-[var(--border-hover)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[var(--text-primary)]/[0.02] to-transparent" />
              <p className="text-xs text-[var(--text-muted)] font-medium relative z-10">{stat.label}</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1 transition-colors relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionQuickStart() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl space-y-5 group hover:border-[var(--border-hover)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--text-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10">
            {[
              { step: "1", title: "Upload", desc: "Upload your resume (PDF or DOCX)" },
              { step: "2", title: "Analyze", desc: "Wait 5\u201310 seconds for analysis" },
              { step: "3", title: "Improve", desc: "Review report & recommendations" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, ease: docEase }}
                className="flex items-start gap-3"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--text-secondary)] shrink-0 mt-0.5 group-hover:border-[var(--border-hover)] transition-colors">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="pt-2 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: docEase }}
          >
            <Link href="/analyze">
              <Button size="sm">
                <Sparkles className="w-3.5 h-3.5" />
                Try it now
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionPipeline() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Every resume goes through a multi-stage pipeline. Each step is visible in the processing UI for complete transparency.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="space-y-4">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, ease: docEase }}
                className="flex items-start gap-4 relative group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shrink-0 relative z-10 group-hover:border-[var(--border-hover)] group-hover:bg-[var(--bg-hover)] transition-all duration-300">
                  <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">{step.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 group-hover:text-[var(--text-secondary)] transition-colors">{step.description}</p>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted-strong)] font-semibold pt-2 group-hover:text-[var(--text-muted)] transition-colors">{step.step}</span>
                {idx < pipelineSteps.length - 1 && <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-[var(--border)] to-transparent" />}
              </motion.div>
            );
          })}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionCategories() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Each category is independently scored out of 20 points using rule-based analysis.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryData.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`p-5 bg-[var(--bg-surface)] border ${cat.border} rounded-xl space-y-3 relative overflow-hidden group cursor-default`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${cat.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                      className={`p-2 rounded-lg ${cat.bg} border ${cat.border} group-hover:shadow-lg transition-shadow`}
                    >
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
                      className="text-xs font-mono text-[var(--text-muted)] font-semibold"
                    >
                      {cat.points}
                    </motion.span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">{cat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionScoring() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The ATS score ranges from 0 to 100 and is calculated from five independent evaluation categories. Each category is scored out of 20 points based on deterministic, rule-based analysis — no AI guesswork. The final score represents how well your resume is optimized for automated screening systems used by most employers.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 relative overflow-hidden group hover:border-[var(--border-hover)] transition-all duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-[var(--text-primary)]/[0.03] to-transparent blur-2xl pointer-events-none" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] relative z-10">Score Rating Scale</h3>
          <div className="space-y-3 relative z-10">
            {[
              { range: "90\u2013100", label: "Excellent", color: "text-emerald-400", bar: "bg-emerald-400/20 w-full" },
              { range: "75\u201389", label: "Good", color: "text-blue-400", bar: "bg-blue-400/20 w-3/4" },
              { range: "50\u201374", label: "Average", color: "text-yellow-400", bar: "bg-yellow-400/20 w-1/2" },
              { range: "0\u201349", label: "Needs Improvement", color: "text-red-400", bar: "bg-red-400/20 w-1/3" },
            ].map((rating, i) => (
              <motion.div
                key={rating.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, ease: docEase }}
                className="flex items-center gap-3 sm:gap-4 group/rating"
              >
                <span className={`text-xs font-mono font-semibold ${rating.color} w-14 sm:w-16 shrink-0`}>{rating.range}</span>
                <div className="flex-1 h-2.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${rating.bar}`}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)] w-24 sm:w-28 text-right group-hover/rating:text-[var(--text-secondary)] transition-colors">{rating.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionApi() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          ResumeIQ exposes a lightweight, stateless REST API. All endpoints return consistent JSON responses.
          The base URL for development is{" "}
          <code className="text-[var(--text-primary)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-xs font-mono border border-[var(--border)]">
            http://localhost:8000/api/v1
          </code>.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="space-y-6">
          {apiCodeExamples.map((api, i) => (
            <motion.div
              key={api.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, ease: docEase }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant={api.method === "POST" ? "success" : "info"}>{api.method}</Badge>
                <code className="text-sm font-mono text-[var(--text-primary)] break-all min-w-0">{api.endpoint}</code>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{api.description}</p>
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">Request</h4>
                <CodeBlock code={api.request} language="bash" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">Response</h4>
                <CodeBlock code={api.response} language="json" />
              </div>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Error Codes</h3>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] uppercase tracking-wider">Code</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] uppercase tracking-wider">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  { code: "INVALID_FILE_TYPE", meaning: "Unsupported file format" },
                  { code: "FILE_TOO_LARGE", meaning: "File exceeds 10 MB limit" },
                  { code: "EMPTY_FILE", meaning: "Uploaded file has no content" },
                  { code: "PARSE_FAILED", meaning: "Document extraction failed" },
                  { code: "ANALYSIS_FAILED", meaning: "Analysis engine error" },
                  { code: "RATE_LIMITED", meaning: "Too many requests — wait and retry" },
                  { code: "INTERNAL_ERROR", meaning: "Unexpected server error" },
                ].map((err) => (
                  <tr key={err.code} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-xs font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded">{err.code}</code>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">{err.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

function SectionPrivacy() {
  return (
    <StaggerContainer>
      <StaggerItem>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          ResumeIQ processes all files entirely in memory. No data is stored permanently. Files are discarded immediately after the analysis response is returned to your browser. No database, no user accounts, no tracking, no persistence. Every analysis is completely ephemeral.
        </p>
      </StaggerItem>
      <StaggerItem className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "In-memory processing", desc: "Files are never written to disk during analysis." },
            { title: "No user accounts", desc: "No sign-up, no login, no profiles to store." },
            { title: "No tracking", desc: "No cookies, analytics, or behavioral tracking." },
            { title: "Instant deletion", desc: "Data is discarded as soon as results are returned." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, ease: docEase }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 space-y-1.5 group hover:border-[var(--border-hover)] transition-all duration-300"
            >
              <p className="text-sm font-semibold text-[var(--text-primary)] transition-colors">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

export function SectionFaq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  return (
    <StaggerContainer>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <StaggerItem key={i}>
            <ExpandableFaq
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqIndex === i}
              onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
            />
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
}

function SectionCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: docEase }}
      className="text-center space-y-5 py-6"
    >
      <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
        Upload your resume and receive a comprehensive ATS analysis in seconds.
      </p>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springSnappy}>
        <Link href="/analyze">
          <Button size="lg">
            <Sparkles className="w-4 h-4" />
            Analyze Your Resume
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Section Content Map ───────────────────────────────────────
const sections: Record<string, { title: string; icon: React.ComponentType<{ className?: string }>; render: React.ComponentType }> = {
  overview:    { title: "Overview", icon: BookOpen, render: SectionOverview },
  quickstart:  { title: "Quick Start", icon: Sparkles, render: SectionQuickStart },
  pipeline:    { title: "Analysis Pipeline", icon: Zap, render: SectionPipeline },
  categories:  { title: "Categories", icon: Layout, render: SectionCategories },
  scoring:     { title: "ATS Scoring", icon: BarChart3, render: SectionScoring },
  api:         { title: "API Reference", icon: Code, render: SectionApi },
  privacy:     { title: "Privacy & Data", icon: Shield, render: SectionPrivacy },
  faq:         { title: "FAQ", icon: Blocks, render: SectionFaq },
};

// ─── Right Side Table of Contents ─────────────────────────────
function RightToC({ currentIndex, goTo }: { currentIndex: number; goTo: (index: number) => void }) {
  const currentSectionInfo = navSections[currentIndex];
  return (
    <nav className="hidden lg:block w-64 shrink-0 sticky top-24 self-start pt-8">
      <div className="space-y-6">
        {/* Current section info card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            Current Section
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {currentSectionInfo.label}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            {currentSectionInfo.description}
          </p>
        </div>

        {/* Section navigation */}
        <div className="space-y-1 border-l border-[var(--border)] pl-4">
          <p className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-3 pl-3">
            On this page
          </p>
          {navSections.map((section, idx) => {
            const Icon = section.icon;
            const isActive = idx === currentIndex;
            return (
              <motion.button
                key={section.id}
                type="button"
                onClick={() => goTo(idx)}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 text-left ${
                  isActive
                    ? "text-[var(--text-primary)] font-medium bg-[var(--bg-elevated)] border border-[var(--border)] -ml-px"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/50"
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{section.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSectionIndicator"
                    className="w-1 h-1 rounded-full bg-[var(--text-primary)] ml-auto shrink-0"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted-strong)]">
            <span>Progress</span>
            <span className="font-mono">{currentIndex + 1} / {navSections.length}</span>
          </div>
          <div className="h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--text-primary)]/30"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentIndex + 1) / navSections.length) * 100}%` }}
              transition={{ duration: 0.4, ease: docEase }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Dot Tooltip ───────────────────────────────────────────────
function DotTooltip({ label, description, children, show }: { label: string; description: string; children: React.ReactNode; show: boolean }) {
  return (
    <div className="relative group/dot">
      {children}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none transition-all duration-200 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-center whitespace-nowrap shadow-lg backdrop-blur-md">
          <p className="text-xs font-medium text-[var(--text-primary)]">{label}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{description}</p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[var(--bg-elevated)] border-r border-b border-[var(--border)] -mt-1" />
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────
export default function DocsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  // Debounce to prevent rapid-fire navigation breaks
  const isTransitioning = useRef(false);

  const currentSection = navSections[currentIndex];
  const sectionConfig = sections[currentSection.id];
  const totalSections = navSections.length;
  const progressPercent = ((currentIndex + 1) / totalSections) * 100;

  const goTo = useCallback((index: number) => {
    if (isTransitioning.current) return;
    if (index < 0 || index >= totalSections) return;
    isTransitioning.current = true;
    setDirection((prev) => (index > prev ? 1 : -1));
    setCurrentIndex(index);
    setTimeout(() => { isTransitioning.current = false; }, 350);
  }, [totalSections]);

  const goNext = useCallback(() => {
    if (isTransitioning.current) return;
    goTo(currentIndex + 1);
  }, [goTo, currentIndex]);

  const goPrev = useCallback(() => {
    if (isTransitioning.current) return;
    goTo(currentIndex - 1);
  }, [goTo, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const SectionIcon = sectionConfig?.icon;

  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors">
      <MobileHeader onMenuOpen={() => setMobileOpen(true)} />

      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* pt-14 clears the fixed mobile header; pb clears the fixed bottom tab bar */}
        <main className="flex-1 flex flex-col min-h-dvh lg:min-h-0 overflow-hidden pt-14 lg:pt-0 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          {/* ── Header with Progress Bar ── */}
          <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-primary)] relative">
            {/* Animated progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, var(--text-primary), var(--text-secondary), var(--text-primary))`,
                opacity: 0.4,
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: docEase }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.h1
                  className="text-lg font-semibold tracking-tight"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: docEase }}
                >
                  Documentation
                </motion.h1>
                <Badge variant="info">v1.0</Badge>
                <Badge variant="success">Stable</Badge>
              </div>
            </div>
          </div>

          {/* ── Section Content + Right Panel ── */}
          <div
            data-testid="docs-scroll-container"
            className="flex-1 flex items-start justify-center overflow-y-auto overscroll-contain"
          >
            <div className="flex w-full max-w-[72rem] justify-center">
              {/* Main content */}
              <div className="flex-1 px-4 sm:px-6 lg:px-12 py-8 max-w-3xl">
                  {/* Animated section content */}
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentSection.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <SectionHeader
                        icon={SectionIcon!}
                        title={sectionConfig?.title || ""}
                        number={currentIndex + 1}
                        total={totalSections}
                      />
                      {sectionConfig?.render && <sectionConfig.render />}
                      {currentIndex === totalSections - 1 && (
                        <div className="mt-8 pt-6 border-t border-[var(--border)]">
                          <SectionCTA />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
              </div>

              {/* Right Table of Contents Panel */}
              <RightToC currentIndex={currentIndex} goTo={goTo} />
            </div>
          </div>

          {/* ── Bottom Navigation Bar ── */}
          <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4 space-y-3">
              {/* Progress Slider Bar */}
              <div className="hidden sm:flex items-center gap-4 justify-center">
                {/* Draggable progress bar */}
                <div className="relative w-full max-w-[300px] h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden cursor-pointer group/slider"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    const idx = Math.min(Math.max(Math.round(pct * (totalSections - 1)), 0), totalSections - 1);
                    goTo(idx);
                  }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--text-primary)]/40 to-[var(--text-secondary)]/40"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: docEase }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover/slider:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-[var(--text-primary)]/5 to-transparent" />
                </div>

                {/* Section dots with tooltips */}
                <div className="flex items-center gap-2.5">
                  {navSections.map((section, idx) => (
                    <DotTooltip
                      key={section.id}
                      label={section.label}
                      description={section.description}
                      show={hoveredDot === idx}
                    >
                      <motion.button
                        type="button"
                        onClick={() => goTo(idx)}
                        onMouseEnter={() => setHoveredDot(idx)}
                        onMouseLeave={() => setHoveredDot(null)}
                        whileHover={{ scale: 1.8 }}
                        whileTap={{ scale: 0.8 }}
                        transition={springBouncy}
                        className={`rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "bg-[var(--text-primary)] w-3 h-3 shadow-sm"
                            : "bg-[var(--border)] hover:bg-[var(--text-muted)] w-2 h-2"
                        }`}
                        aria-label={`Go to ${section.label}`}
                      />
                    </DotTooltip>
                  ))}
                </div>
              </div>

              {/* Mobile-only compact progress row — gives phone users a clear
                  position indicator since the slider and dots are sm+ only */}
              <div
                data-testid="docs-mobile-progress"
                className="sm:hidden flex items-center gap-3"
              >
                <span className="text-[10px] font-mono text-[var(--text-muted-strong)] font-semibold shrink-0">
                  {currentIndex + 1} / {totalSections}
                </span>
                <div className="relative flex-1 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[var(--text-primary)]/40"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: docEase }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] truncate shrink-0 max-w-[7rem]">
                  {currentSection.label}
                </span>
              </div>

              {/* Full-width Previous / Next buttons */}
              <div className="flex items-center gap-3">
                {/* Previous */}
                <div className="flex-1">
                  {currentIndex > 0 ? (
                    <motion.button
                      type="button"
                      onClick={goPrev}
                      whileTap={{ scale: 0.97 }}
                      transition={springSnappy}
                      aria-label={`Previous section: ${navSections[currentIndex - 1].label}`}
                      className="w-full group flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] transition-all duration-200 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">Previous</div>
                        <div className="text-sm font-medium truncate">{navSections[currentIndex - 1].label}</div>
                      </div>
                    </motion.button>
                  ) : (
                    // Hidden on mobile so the remaining Next button goes full-width
                    <div className="hidden sm:block w-full px-5 py-3 rounded-xl border border-transparent bg-transparent opacity-40" />
                  )}
                </div>

                {/* Section indicator */}
                <div className="hidden sm:flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-mono text-[var(--text-muted-strong)] font-semibold">{currentIndex + 1}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">of {totalSections}</span>
                </div>

                {/* Next */}
                <div className="flex-1">
                  {currentIndex < totalSections - 1 ? (
                    <motion.button
                      type="button"
                      onClick={goNext}
                      whileTap={{ scale: 0.97 }}
                      transition={springSnappy}
                      aria-label={`Next section: ${navSections[currentIndex + 1].label}`}
                      className="w-full group flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] transition-all duration-200 shadow-sm"
                    >
                      <div className="flex-1 text-right">
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">Next</div>
                        <div className="text-sm font-medium truncate">{navSections[currentIndex + 1].label}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </motion.button>
                  ) : (
                    // Hidden on mobile so the remaining Previous button goes full-width
                    <div className="hidden sm:block w-full px-5 py-3 rounded-xl border border-transparent bg-transparent opacity-40" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}
