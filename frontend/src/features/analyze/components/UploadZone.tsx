"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Shield, Sparkles, ArrowRight, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { springSnappy, springNatural, springBouncy, staggerContainer, fadeUpItem, pageTransition } from "@/lib/animations";

interface UploadZoneProps {
  onAnalyze(file: File, jobDescription?: string): void;
  disabled?: boolean;
  error?: string | null;
  onReset?: () => void;
}

// ─── Animated Border Path ────────────────────────────────────
function AnimatedBorder({ active }: { active: boolean }) {
  return (
    <>
      {/* Corner accent lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={springSnappy}
        className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent origin-center pointer-events-none z-10"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={springSnappy}
        className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent origin-center pointer-events-none z-10"
      />

      {/* Glow overlay on drag */}
      <motion.div
        animate={
          active
            ? { opacity: [0.04, 0.1, 0.04] }
            : { opacity: 0 }
        }
        transition={{ duration: 2, ease: "easeInOut", repeat: active ? Infinity : 0 }}
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: "0 0 60px rgba(242,242,240,0.06), inset 0 0 60px rgba(242,242,240,0.02)",
        }}
      />
    </>
  );
}

// ─── Floating Particles ──────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[var(--text-primary)]/10"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

// ─── File Type Badge ─────────────────────────────────────────
function FileBadge({ label }: { label: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      className="px-2.5 py-1 text-xs border border-[var(--border)] bg-[var(--bg-elevated)] rounded text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)]"
    >
      {label}
    </motion.span>
  );
}

// ─── Checkmark Overlay ───────────────────────────────────────
function DropSuccessOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="drop-success"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={springBouncy}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="bg-emerald-500/10 rounded-full p-4"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function UploadZone({ onAnalyze, disabled, error, onReset }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showDropSuccess, setShowDropSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setFileError("Unsupported file format. Only PDF and DOCX files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10 MB limit.");
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    // Show success animation briefly
    setShowDropSuccess(true);
    setTimeout(() => setShowDropSuccess(false), 800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const canSubmit = selectedFile && !disabled;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageTransition}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Page Title & Subtitle */}
      <div className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]"
        >
          Analyze Resume
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[var(--text-secondary)] text-base"
        >
          Upload your resume to receive a detailed ATS compatibility report with actionable recommendations.
        </motion.p>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={springNatural}
            className="p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm space-y-3"
          >
            <p>{error}</p>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs font-medium text-red-300 hover:text-red-200 underline focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] rounded"
              >
                Try again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Box Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <motion.h2 variants={fadeUpItem} className="text-sm font-medium text-[var(--text-primary)]">
          Upload Resume
        </motion.h2>
        <motion.div
          variants={fadeUpItem}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          animate={{
            borderColor: dragActive ? "var(--text-primary)" : "var(--border)",
            backgroundColor: dragActive ? "var(--bg-elevated)" : "var(--bg-surface)",
            scale: dragActive ? 1.01 : 1,
          }}
          transition={springSnappy}
          className="relative border rounded-xl p-6 sm:p-10 text-center cursor-pointer flex flex-col items-center justify-center min-h-[240px] transition-colors hover:border-[var(--text-muted)] overflow-hidden group"
        >
          {/* Animated border glow */}
          <AnimatedBorder active={dragActive || false} />

          {/* Floating particles */}
          <Particles />

          {/* Drop success overlay */}
          <DropSuccessOverlay show={showDropSuccess} />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={springNatural}
                className="flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--border)] p-4 pr-3 rounded-lg text-left max-w-md w-full justify-between relative z-10 group/file"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: -15, scale: 0.7 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={springBouncy}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    className="p-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg"
                  >
                    <FileText className="w-6 h-6 text-[var(--text-secondary)]" />
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[180px]"
                    >
                      {selectedFile.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-xs text-[var(--text-muted)]"
                    >
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90, color: "var(--text-primary)" }}
                  whileTap={{ scale: 0.9 }}
                  transition={springSnappy}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileError(null);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="file-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springNatural}
                className="space-y-5 flex flex-col items-center relative z-10"
              >
                {/* Floating upload icon */}
                <motion.div
                  animate={{ y: dragActive ? -8 : [0, -4, 0] }}
                  transition={
                    dragActive
                      ? springSnappy
                      : { duration: 3, ease: "easeInOut", repeat: Infinity }
                  }
                  className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl group-hover:border-[var(--border-hover)] group-hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <motion.div
                    animate={dragActive ? { rotate: [0, -5, 5, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FileUp className="w-7 h-7 text-[var(--text-secondary)]" />
                  </motion.div>
                </motion.div>

                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {dragActive ? "Drop your file here" : "Drag & drop your resume here"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    or{" "}
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      className="underline text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                    >
                      browse files
                    </motion.span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <FileBadge label="PDF" />
                  <FileBadge label="DOCX" />
                  <span className="text-xs text-[var(--text-muted)] ml-1">Max 10 MB</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inline validation error */}
        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{fileError}</span>
          </motion.div>
        )}

        {/* Security Message */}
        <motion.div
          variants={fadeUpItem}
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-1"
        >
          <Shield className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Your file is secure and never stored. It is deleted after analysis.</span>
        </motion.div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-2"
      >
        <motion.button
          type="button"
          disabled={!selectedFile || disabled}
          onClick={handleSubmit}
          whileHover={canSubmit ? { scale: 1.02, y: -1 } : undefined}
          whileTap={canSubmit ? { scale: 0.98 } : undefined}
          transition={springSnappy}
          className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] ${
            canSubmit
              ? "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 cursor-pointer"
              : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
          }`}
        >
          {/* Pulse ring when ready */}
          {canSubmit && (
            <motion.span
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 rounded-xl border border-[var(--text-primary)]/30"
            />
          )}
          <Sparkles className="w-4 h-4" />
          <span>Analyze Resume</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
