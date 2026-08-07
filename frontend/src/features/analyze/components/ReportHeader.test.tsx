import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReportHeader } from "./ReportHeader";
import type { ResumeMetadata, OverviewStats } from "../types/analysis";

const resume: ResumeMetadata = {
  fileName: "john_doe_resume.pdf",
  fileType: "pdf",
  pageCount: 2,
  wordCount: 450,
  fileSizeBytes: 128_000,
};

const stats: OverviewStats = {
  pages: 2,
  words: 450,
  sections: 4,
  skillsFound: 6,
};

describe("ReportHeader", () => {
  it("renders the title", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.getByText("Resume Analysis")).toBeInTheDocument();
  });

  it("renders the file name", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.getByText("john_doe_resume.pdf")).toBeInTheDocument();
  });

  it("renders the file type", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.getByText("PDF Document")).toBeInTheDocument();
  });

  it("renders overview stats", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.getByText("2 pages")).toBeInTheDocument();
    expect(screen.getByText("450 words")).toBeInTheDocument();
    expect(screen.getByText("4 sections")).toBeInTheDocument();
    expect(screen.getByText("6 skills")).toBeInTheDocument();
  });

  it("renders the file size in KB", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.getByText("125 KB")).toBeInTheDocument();
  });

  it("renders the executive summary when provided", () => {
    render(
      <ReportHeader
        resume={resume}
        overviewStats={stats}
        executiveSummary="This is a strong resume."
      />
    );
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("This is a strong resume.")).toBeInTheDocument();
  });

  it("does not render executive summary when not provided", () => {
    render(<ReportHeader resume={resume} overviewStats={stats} />);
    expect(screen.queryByText("Executive Summary")).not.toBeInTheDocument();
  });

  it("handles docx file type", () => {
    const docxResume: ResumeMetadata = { ...resume, fileType: "docx" };
    render(<ReportHeader resume={docxResume} overviewStats={stats} />);
    expect(screen.getByText("DOCX Document")).toBeInTheDocument();
  });

  it("handles large file sizes correctly", () => {
    const largeFile: ResumeMetadata = { ...resume, fileSizeBytes: 2_500_000 };
    render(<ReportHeader resume={largeFile} overviewStats={stats} />);
    expect(screen.getByText("2441 KB")).toBeInTheDocument();
  });
});
