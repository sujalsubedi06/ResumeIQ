import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreBreakdown } from "./ScoreBreakdown";
import type { ScoreCategory } from "../types/analysis";

const mockItems: ScoreCategory[] = [
  { category: "Formatting", score: 20, maxScore: 20, description: "Good formatting" },
  { category: "Sections", score: 15, maxScore: 20, description: "Some sections missing" },
  { category: "Skills", score: 10, maxScore: 20, description: "Could improve" },
  { category: "Keywords", score: 5, maxScore: 20, description: "Needs work" },
];

describe("ScoreBreakdown", () => {
  it("renders all categories", () => {
    render(<ScoreBreakdown items={mockItems} />);
    expect(screen.getByText("Formatting")).toBeInTheDocument();
    expect(screen.getByText("Sections")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Keywords")).toBeInTheDocument();
  });

  it("renders the heading", () => {
    render(<ScoreBreakdown items={mockItems} />);
    expect(screen.getByText("Score Breakdown")).toBeInTheDocument();
  });

  it("shows total score / total max", () => {
    render(<ScoreBreakdown items={mockItems} />);
    const totalScore = mockItems.reduce((a, i) => a + i.score, 0);
    const totalMax = mockItems.reduce((a, i) => a + i.maxScore, 0);
    expect(screen.getByText(`${totalScore}/${totalMax}`)).toBeInTheDocument();
  });

  it("renders descriptions when provided", () => {
    render(<ScoreBreakdown items={mockItems} />);
    expect(screen.getByText("Good formatting")).toBeInTheDocument();
    expect(screen.getByText("Needs work")).toBeInTheDocument();
  });

  it("renders empty items array gracefully", () => {
    render(<ScoreBreakdown items={[]} />);
    expect(screen.getByText("Score Breakdown")).toBeInTheDocument();
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("applies correct bar color for high scores (>=90%)", () => {
    const { container } = render(<ScoreBreakdown items={mockItems.slice(0, 1)} />);
    const bar = container.querySelector(".bg-emerald-500");
    expect(bar).toBeInTheDocument();
  });

  it("applies correct bar color for medium-high scores (>=70%)", () => {
    const mock: ScoreCategory[] = [{ category: "Test", score: 15, maxScore: 20 }];
    const { container } = render(<ScoreBreakdown items={mock} />);
    const bar = container.querySelector(".bg-blue-500");
    expect(bar).toBeInTheDocument();
  });

  it("applies correct bar color for low scores (<50%)", () => {
    const mock: ScoreCategory[] = [{ category: "Test", score: 5, maxScore: 20 }];
    const { container } = render(<ScoreBreakdown items={mock} />);
    const bar = container.querySelector(".bg-red-500");
    expect(bar).toBeInTheDocument();
  });
});
