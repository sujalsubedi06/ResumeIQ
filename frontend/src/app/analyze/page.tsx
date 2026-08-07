"use client";

import React, { useState } from "react";
import { Sidebar, MobileHeader, MobileNavBar } from "@/components/layout/Sidebar";
import { UploadZone } from "@/features/analyze/components/UploadZone";
import { AnalysisPipeline } from "@/features/analyze/components/AnalysisPipeline";
import { Report } from "@/features/analyze/components/Report";
import { useAnalyze } from "@/features/analyze/hooks/useAnalyze";

export default function AnalyzePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    status,
    error,
    report,
    steps,
    selectedFile,
    currentProcessingText,
    startAnalysis,
    resetAnalysis,
  } = useAnalyze();

  const isUploadingOrProcessing = status === "uploading" || status === "processing";
  const isCompleted = status === "completed" && report;

  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Mobile Header - outside flex to allow sticky to work */}
      <MobileHeader onMenuOpen={() => setMobileOpen(true)} />

      {/* h-dvh gives the app shell a definite height so main's overflow-y-auto
          becomes the real scroller (same fix as the docs page). Without it the
          content-driven min-height chain grows with the content and the page
          scrolls as a document instead of scrolling inside main. */}
      <div className="flex flex-col lg:flex-row h-dvh">
        {/* Sidebar Navigation */}
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:p-12 lg:pt-12 lg:pb-12 overflow-y-auto max-w-[1400px]">
        {!isUploadingOrProcessing && !isCompleted ? (
          <UploadZone
            onAnalyze={(file, jobDesc) => startAnalysis(file, jobDesc)}
            disabled={status !== "idle" && status !== "error"}
            error={error}
            onReset={status === "error" ? resetAnalysis : undefined}
          />
        ) : isUploadingOrProcessing ? (
          <AnalysisPipeline
            steps={steps}
            selectedFile={selectedFile}
            currentProcessingText={currentProcessingText}
          />
        ) : (
          <Report report={report!} onReset={resetAnalysis} onAnalyzeNew={(file, jobDesc) => startAnalysis(file, jobDesc)} />
        )}
      </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}
