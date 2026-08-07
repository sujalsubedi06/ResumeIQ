"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Shield, Lock, FileText } from "lucide-react";
import { AnalysisStep } from "../types/analysis";
import {
  staggerContainer,
  fadeUpItem,
  springSnappy,
  springNatural,
  springBouncy,
} from "@/lib/animations";

interface AnalysisPipelineProps {
  steps: AnalysisStep[];
  selectedFile: File | null;
  currentProcessingText: string;
}

export function AnalysisPipeline({ steps, selectedFile, currentProcessingText }: AnalysisPipelineProps) {
  const fileName = selectedFile ? selectedFile.name : "Resume.pdf";
  const fileSizeKB = selectedFile ? (selectedFile.size / 1024).toFixed(0) : "248";
  const fileExt = fileName.split(".").pop()?.toUpperCase() || "PDF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Title */}
      <div className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]"
        >
          Resume Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[var(--text-secondary)] text-base"
        >
          Your resume is being analyzed. This usually takes 5–10 seconds. You can leave this page — we&apos;ll notify you when it&apos;s done.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Progress Stepper */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Analysis Progress
            </h2>

            <div className="space-y-6 relative">
              {/* Animated Stepper line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-[var(--border)] -z-0" />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: steps.filter((s) => s.status === "completed").length / steps.length,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[15px] top-4 w-[2px] bg-emerald-500/50 -z-0 origin-top"
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {steps.map((step) => {
                  const isCompleted = step.status === "completed";
                  const isInProgress = step.status === "in_progress";

                  return (
                    <motion.div
                      key={step.id}
                      variants={fadeUpItem}
                      className="flex items-start justify-between relative z-10 mb-6 last:mb-0"
                    >
                      <div className="flex items-start gap-4">
                        {/* Animated Status Icon */}
                        <div className="bg-[var(--bg-surface)] pt-0.5">
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key="completed"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={springBouncy}
                              >
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-emerald-950" />
                              </motion.div>
                            ) : isInProgress ? (
                              <motion.div
                                key="in-progress"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={springNatural}
                                className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-[var(--bg-surface)] relative"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                                  className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                                />
                                {/* Outer ring pulse */}
                                <motion.div
                                  animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                                  transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity }}
                                  className="absolute inset-0 rounded-full border border-emerald-500"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="pending"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                              >
                                <Circle className="w-8 h-8 text-[var(--border)]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Step Info with shimmer for pending */}
                        <div>
                          {!isCompleted && !isInProgress ? (
                            <div className="space-y-2">
                              <motion.div
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.1 }}
                                className="h-4 w-28 bg-[var(--bg-elevated)] rounded"
                              />
                              <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.2 }}
                                className="h-3 w-44 bg-[var(--bg-elevated)] rounded"
                              />
                            </div>
                          ) : (
                            <>
                              <motion.p
                                animate={{
                                  color: isCompleted || isInProgress ? "var(--text-primary)" : "var(--text-muted)",
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-sm font-semibold"
                              >
                                {step.title}
                              </motion.p>
                              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                {step.subtitle}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Step Status Badge */}
                      <div className="text-right">
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.div
                              key="completed"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={springSnappy}
                            >
                              <span className="text-xs text-[var(--text-secondary)] font-medium">Completed</span>
                              {step.time && <p className="text-[10px] text-[var(--text-muted)]">{step.time}</p>}
                            </motion.div>
                          ) : isInProgress ? (
                            <motion.div
                              key="in-progress"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={springSnappy}
                              className="flex items-center gap-1"
                            >
                              <span className="text-xs text-emerald-400 font-medium">In Progress</span>
                              <span className="flex gap-0.5">
                                {[0, 0.2, 0.4].map((delay) => (
                                  <motion.span
                                    key={delay}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                      duration: 0.6,
                                      ease: "easeInOut",
                                      repeat: Infinity,
                                      delay,
                                    }}
                                    className="w-1 h-1 bg-emerald-400 rounded-full inline-block"
                                  />
                                ))}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="pending"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
                            >
                              <div className="h-3 w-14 bg-[var(--bg-elevated)] rounded" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* Currently Processing Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 space-y-2 relative overflow-hidden"
          >
            {/* Animated pulse border */}
            <motion.div
              animate={{
                borderColor: ["rgba(34,197,94,0.2)", "rgba(34,197,94,0.4)", "rgba(34,197,94,0.2)"],
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 rounded-xl border border-emerald-500/20 pointer-events-none"
            />

            <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Currently Processing
            </h3>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-500"
              />
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {currentProcessingText || "Extracting technical skills and competencies from your resume..."}
              </p>
            </div>
            <p className="text-xs text-[var(--text-muted)] pl-4">
              This step helps us understand your expertise better.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Uploaded Document Card */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-6"
          >
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Uploaded Resume
            </h2>

            {/* Document Details Box */}
            <motion.div
              whileHover={{ borderColor: "var(--border-hover)" }}
              transition={springSnappy}
              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                  >
                    <FileText className="w-6 h-6 text-[var(--text-secondary)]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[180px]">{fileName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{fileExt} Document</p>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springBouncy}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center gap-6 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>2 Pages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>{fileSizeKB} KB</span>
                </div>
              </div>
            </motion.div>

            {/* Document Preview Graphic */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[var(--preview-bg)] rounded-lg p-6 space-y-3 shadow-inner min-h-[300px] font-sans"
            >
              <div className="border-b border-[var(--preview-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--preview-text)]">Sujal Subedi</h3>
                <p className="text-xs text-[var(--preview-text)]/70 font-medium">Software Developer & Cybersecurity Student</p>
                <p className="text-[10px] text-[var(--preview-text)]/50 mt-1">sujal@example.com | +977 98XXXXXXX | Kathmandu, Nepal</p>
              </div>

              <div className="space-y-1.5 text-[10px] text-[var(--preview-text)]/80">
                <p className="font-bold text-[var(--preview-text)] uppercase tracking-wider text-[9px]">Summary</p>
                <p className="text-[var(--preview-text)]/70 leading-snug">
                  Motivated and detail-oriented cybersecurity student with a strong foundation in network security, Linux systems, and web development...
                </p>
              </div>

              <div className="space-y-1 text-[10px] text-[var(--preview-text)]/80">
                <p className="font-bold text-[var(--preview-text)] uppercase tracking-wider text-[9px]">Experience</p>
                <div className="flex justify-between font-semibold text-[var(--preview-text)]/90">
                  <span>Freelance Developer</span>
                  <span className="text-[var(--preview-text)]/60">2024 - Present</span>
                </div>
                <ul className="list-disc pl-3 text-[var(--preview-text)]/70 space-y-0.5">
                  <li>Built responsive websites and web applications using modern technologies.</li>
                  <li>Implemented secure authentication and authorization systems.</li>
                </ul>
              </div>

              <div className="space-y-1 text-[10px] text-[var(--preview-text)]/80">
                <p className="font-bold text-[var(--preview-text)] uppercase tracking-wider text-[9px]">Skills</p>
                <p className="text-[var(--preview-text)]/70">Python • JavaScript • React • FastAPI • Linux • SQL • Git</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Privacy Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4"
          >
            <Shield className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-xs font-semibold text-[var(--text-primary)]">Your data is secure</p>
              <p className="text-xs text-[var(--text-muted)]">
                Files are processed securely and automatically deleted after analysis.
              </p>
            </div>
            <Lock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
