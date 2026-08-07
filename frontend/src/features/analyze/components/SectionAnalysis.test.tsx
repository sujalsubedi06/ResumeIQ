import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionAnalysis } from "./SectionAnalysis";
import type { SectionResult } from "../types/analysis";

const mockSections: SectionResult[] = [
  { name: "Summary", exists: true, quality: "strong" },
  { name: "Experience", exists: true, quality: "strong" },
  { name: "Education", exists: true, quality: "acceptable" },
  { name: "Skills", exists: true, quality: "weak" },
  { name: "Projects", exists: false, quality: "missing" },
];

describe("SectionAnalysis", () => {
  it("renders all section names", () => {
    render(<SectionAnalysis sections={mockSections} />);
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("renders quality labels", () => {
    render(<SectionAnalysis sections={mockSections} />);
    expect(screen.getAllByText("Strong").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Acceptable")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("shows detected count out of total", () => {
    render(<SectionAnalysis sections={mockSections} />);
    expect(screen.getByText("4/5 detected")).toBeInTheDocument();
  });

  it("handles empty sections array", () => {
    render(<SectionAnalysis sections={[]} />);
    expect(screen.getByText("0/0 detected")).toBeInTheDocument();
  });

  it("renders with all sections missing", () => {
    const allMissing: SectionResult[] = [
      { name: "Summary", exists: false, quality: "missing" },
      { name: "Experience", exists: false, quality: "missing" },
    ];
    render(<SectionAnalysis sections={allMissing} />);
    expect(screen.getByText("0/2 detected")).toBeInTheDocument();
    expect(screen.getAllByText("Missing")).toHaveLength(2);
  });

  it("renders with all sections strong", () => {
    const allStrong: SectionResult[] = [
      { name: "Summary", exists: true, quality: "strong" },
      { name: "Experience", exists: true, quality: "strong" },
    ];
    render(<SectionAnalysis sections={allStrong} />);
    expect(screen.getByText("2/2 detected")).toBeInTheDocument();
    expect(screen.getAllByText("Strong")).toHaveLength(2);
  });
});
