import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Report } from "./Report";
import { createMockReport } from "../types/__mocks__/mockReport";

describe("Report", () => {
  it("renders the report title", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Resume Analysis")).toBeInTheDocument();
  });

  it("renders the executive summary", () => {
    const report = createMockReport({
      executiveSummary: "Custom executive summary text.",
    });
    render(<Report report={report} onReset={() => {}} />);
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("Custom executive summary text.")).toBeInTheDocument();
  });

  it("renders the score heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("ATS SCORE")).toBeInTheDocument();
  });

  it("renders score breakdown heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Score Breakdown")).toBeInTheDocument();
  });

  it("renders resume sections heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Resume Sections")).toBeInTheDocument();
  });

  it("renders skills analysis heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Skills Analysis")).toBeInTheDocument();
  });

  it("renders experience review heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Experience Review")).toBeInTheDocument();
  });

  it("renders recommendations heading", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
  });

  it("renders the 'Analyze Another Resume' button", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText("Analyze Another Resume")).toBeInTheDocument();
  });

  it("renders the file name from report", () => {
    const report = createMockReport({
      resume: { ...createMockReport().resume, fileName: "custom-resume.pdf" },
    });
    render(<Report report={report} onReset={() => {}} />);
    expect(screen.getByText("custom-resume.pdf")).toBeInTheDocument();
  });

  it("renders the version info", () => {
    render(<Report report={createMockReport()} onReset={() => {}} />);
    expect(screen.getByText(/ResumeIQ v1.0/)).toBeInTheDocument();
  });
});
