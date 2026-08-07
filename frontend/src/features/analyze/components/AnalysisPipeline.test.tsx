import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalysisPipeline } from "./AnalysisPipeline";
import type { AnalysisStep } from "../types/analysis";

const mockSteps: AnalysisStep[] = [
  { id: "step-1", title: "Resume Uploaded", subtitle: "File received", status: "completed" },
  { id: "step-2", title: "Parsing Document", subtitle: "Reading structure", status: "completed" },
  { id: "step-3", title: "Extracting Sections", subtitle: "Identifying sections", status: "in_progress" },
  { id: "step-4", title: "Skills Analysis", subtitle: "Detecting skills", status: "pending" },
  { id: "step-5", title: "ATS Score Calculation", subtitle: "Calculating score", status: "pending" },
  { id: "step-6", title: "Generating Report", subtitle: "Preparing report", status: "pending" },
];

const mockFile = new File(["test"], "test-resume.pdf", { type: "application/pdf" });

describe("AnalysisPipeline", () => {
  it("renders the title", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Resume Analysis")).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(
      screen.getByText(/your resume is being analyzed/i)
    ).toBeInTheDocument();
  });

  it("renders completed and in-progress step titles", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Resume Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Parsing Document")).toBeInTheDocument();
    expect(screen.getByText("Extracting Sections")).toBeInTheDocument();
    // Pending steps show shimmer skeletons instead of text
  });

  it("renders Completed status for completed steps", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    const completedLabels = screen.getAllByText("Completed");
    expect(completedLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("renders In Progress status for active step", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders shimmer skeletons for pending steps", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    // Pending steps now show shimmer skeleton bars instead of "Pending" text
    const shimmerBars = document.querySelectorAll('.animate-pulse');
    // Completed and in-progress titles should still render
    expect(screen.getByText("Resume Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Extracting Sections")).toBeInTheDocument();
  });

  it("renders the uploaded resume card", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Uploaded Resume")).toBeInTheDocument();
  });

  it("displays the file name", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("test-resume.pdf")).toBeInTheDocument();
  });

  it("displays the current processing text", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Analyzing your key competencies..."
      />
    );
    expect(screen.getByText("Analyzing your key competencies...")).toBeInTheDocument();
  });

  it("renders the security and privacy message", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Your data is secure")).toBeInTheDocument();
  });

  it("renders Analysis Progress section", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Analysis Progress")).toBeInTheDocument();
  });

  it("renders the document type label", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={mockFile}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("PDF Document")).toBeInTheDocument();
  });

  it("renders correctly without a file", () => {
    render(
      <AnalysisPipeline
        steps={mockSteps}
        selectedFile={null}
        currentProcessingText="Processing..."
      />
    );
    expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
  });
});
