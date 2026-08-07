import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsAnalysis } from "./SkillsAnalysis";
import type { SkillAnalysis } from "../types/analysis";

const mockSkills: SkillAnalysis = {
  detected: ["Python", "JavaScript", "React", "TypeScript"],
  missing: ["Docker", "AWS"],
  categories: [
    { category: "Frontend", skills: ["JavaScript", "React", "TypeScript"] },
    { category: "Backend", skills: ["Python"] },
  ],
};

describe("SkillsAnalysis", () => {
  it("renders the heading", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    expect(screen.getByText("Skills Analysis")).toBeInTheDocument();
  });

  it("renders detected skills count", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    expect(screen.getByText("4 detected")).toBeInTheDocument();
  });

  it("renders missing skills count", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    expect(screen.getByText("2 missing")).toBeInTheDocument();
  });

  it("renders detected skills labels", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    // Use getAllByText since some skills appear in both detected + categories
    const pythons = screen.getAllByText("Python");
    expect(pythons.length).toBeGreaterThanOrEqual(1);
    const reacts = screen.getAllByText("React");
    expect(reacts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders missing skills labels", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
  });

  it("renders category headings", () => {
    render(<SkillsAnalysis skills={mockSkills} />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Skill Categories")).toBeInTheDocument();
  });

  it("handles empty skills gracefully", () => {
    const empty: SkillAnalysis = { detected: [], missing: [], categories: [] };
    render(<SkillsAnalysis skills={empty} />);
    expect(screen.getByText("0 detected")).toBeInTheDocument();
    expect(screen.queryByText("missing")).not.toBeInTheDocument();
    expect(screen.queryByText("Docker")).not.toBeInTheDocument();
  });

  it("handles no missing skills", () => {
    const noMissing: SkillAnalysis = {
      detected: ["Python"],
      missing: [],
      categories: [],
    };
    render(<SkillsAnalysis skills={noMissing} />);
    expect(screen.getByText("1 detected")).toBeInTheDocument();
    expect(screen.queryByText("0 missing")).not.toBeInTheDocument();
    expect(screen.queryByText("Missing Skills")).not.toBeInTheDocument();
  });

  it("handles no categories", () => {
    const noCategories: SkillAnalysis = {
      detected: ["Python"],
      missing: [],
      categories: [],
    };
    render(<SkillsAnalysis skills={noCategories} />);
    expect(screen.queryByText("Skill Categories")).not.toBeInTheDocument();
  });
});
