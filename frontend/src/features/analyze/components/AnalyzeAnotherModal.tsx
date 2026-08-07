"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileUp, FileText, ArrowRight, Shield, Sparkles, AlertCircle } from "lucide-react";
import { modalOverlay, modalContent, springSnappy, springNatural } from "@/lib/animations";

interface AnalyzeAnotherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (file: File, jobDescription?: string) => void;
}

export function AnalyzeAnotherModal({ isOpen, onClose, onAnalyze }: AnalyzeAnotherModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, jobDescription);
      setSelectedFile(null);
      setJobDescription("");
      setFileError(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setJobDescription("");
    setFileError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalOverlay}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-6 shadow-2xl max-h-[90dvh] overflow-y-auto overscroll-contain"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={springSnappy}
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-elevated)]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Header */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[var(--text-secondary)]" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Analyze Another Resume</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-[var(--text-muted)]"
              >
                Upload a new resume to replace the current analysis.
              </motion.p>
            </div>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                borderColor: dragActive ? "var(--text-primary)" : "var(--border)",
                backgroundColor: dragActive ? "var(--bg-elevated)" : "var(--bg-primary)",
              }}
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
              }}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              transition={springSnappy}
              className="border border-[var(--border)] rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[160px] transition-colors hover:border-[var(--text-muted)]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={springNatural}
                    className="flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--border)] p-4 rounded-lg text-left w-full justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-[var(--text-secondary)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={springSnappy}
                      onClick={() => {
                        setSelectedFile(null);
                        setFileError(null);
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
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
                    className="space-y-3 flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ y: dragActive ? -4 : 0 }}
                      transition={springSnappy}
                      className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg"
                    >
                      <FileUp className="w-6 h-6 text-[var(--text-secondary)]" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Drag & drop your resume</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        or <span className="underline text-[var(--text-secondary)]">browse files</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 text-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] rounded text-[var(--text-secondary)]">PDF</span>
                      <span className="px-2 py-0.5 text-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] rounded text-[var(--text-secondary)]">DOCX</span>
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

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <label className="text-xs font-medium text-[var(--text-secondary)]">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value.slice(0, 2000))}
                placeholder="Paste job description for keyword matching..."
                rows={2}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] resize-none"
              />
            </motion.div>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]"
            >
              <Shield className="w-3 h-3" />
              <span>Files are processed in-memory and deleted after analysis.</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-end gap-3 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springSnappy}
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent border border-[var(--border)] rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={selectedFile ? { scale: 1.02, y: -1 } : undefined}
                whileTap={selectedFile ? { scale: 0.98 } : undefined}
                transition={springSnappy}
                disabled={!selectedFile}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedFile
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 cursor-pointer"
                    : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Analyze
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
