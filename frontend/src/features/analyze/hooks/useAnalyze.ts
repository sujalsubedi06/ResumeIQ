import { useState } from "react";
import { analyzeResumeApi } from "../api/analyzeApi";
import { AnalysisReport, AnalysisStep } from "../types/analysis";

export type AnalysisStatus = "idle" | "uploading" | "processing" | "completed" | "error";

const INITIAL_STEPS: AnalysisStep[] = [
  { id: "step-1", title: "Resume Uploaded", subtitle: "File received successfully", status: "pending" },
  { id: "step-2", title: "Parsing Document", subtitle: "Reading and understanding the document structure", status: "pending" },
  { id: "step-3", title: "Extracting Sections", subtitle: "Identifying resume sections and content blocks", status: "pending" },
  { id: "step-4", title: "Skills Analysis", subtitle: "Detecting technical and soft skills", status: "pending" },
  { id: "step-5", title: "ATS Score Calculation", subtitle: "Calculating overall ATS compatibility score", status: "pending" },
  { id: "step-6", title: "Keyword Matching", subtitle: "Matching keywords with job description", status: "pending" },
  { id: "step-7", title: "Generating Recommendations", subtitle: "Creating personalized improvement suggestions", status: "pending" },
  { id: "step-8", title: "Finalizing Report", subtitle: "Preparing your comprehensive analysis report", status: "pending" },
];

export function useAnalyze() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<AnalysisStep[]>(INITIAL_STEPS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProcessingText, setCurrentProcessingText] = useState<string>("");

  const updateStepStatus = (index: number, stepStatus: AnalysisStep["status"], time?: string) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === index) {
          return { ...step, status: stepStatus, time: time || step.time };
        }
        return step;
      })
    );
  };

  const startAnalysis = async (file: File, jobDescription?: string) => {
    setSelectedFile(file);
    setStatus("uploading");
    setError(null);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })));

    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Step 1: Uploading
    updateStepStatus(0, "in_progress");
    setCurrentProcessingText("Receiving and validating file structure...");

    try {
      // Simulate real-time pipeline progression visually for smooth experience
      setTimeout(() => {
        updateStepStatus(0, "completed", nowStr);
        updateStepStatus(1, "in_progress");
        setCurrentProcessingText("Reading text and extracting paragraph layouts...");
      }, 500);

      setTimeout(() => {
        updateStepStatus(1, "completed", nowStr);
        updateStepStatus(2, "in_progress");
        setCurrentProcessingText("Identifying sections (Experience, Education, Skills)...");
      }, 1000);

      setTimeout(() => {
        updateStepStatus(2, "completed", nowStr);
        updateStepStatus(3, "in_progress");
        setCurrentProcessingText("Extracting technical skills and competencies from your resume...");
      }, 1500);

      // Perform API call
      const result = await analyzeResumeApi(file, jobDescription);

      updateStepStatus(3, "completed", nowStr);
      updateStepStatus(4, "completed", nowStr);
      updateStepStatus(5, "completed", nowStr);
      updateStepStatus(6, "completed", nowStr);
      updateStepStatus(7, "completed", nowStr);

      setReport(result);
      setStatus("completed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during resume analysis.");
      setStatus("error");
    }
  };

  const resetAnalysis = () => {
    setStatus("idle");
    setReport(null);
    setError(null);
    setSelectedFile(null);
    setSteps(INITIAL_STEPS);
  };

  return {
    status,
    report,
    error,
    steps,
    selectedFile,
    currentProcessingText,
    startAnalysis,
    resetAnalysis,
  };
}
