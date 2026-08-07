import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceReview } from "./ExperienceReview";
import type { ExperienceAnalysis } from "../types/analysis";

describe("ExperienceReview", () => {
  const withMetrics: ExperienceAnalysis = {
    hasMetrics: true,
    actionVerbScore: 85,
    impactScore: 75,
    summary: "Strong experience with measurable achievements.",
  };

  const withoutMetrics: ExperienceAnalysis = {
    hasMetrics: false,
    actionVerbScore: 40,
    impactScore: 30,
    summary: "Add more quantified results.",
  };

  it("renders the heading", () => {
    render(<ExperienceReview experience={withMetrics} />);
    expect(screen.getByText("Experience Review")).toBeInTheDocument();
  });

  it("shows Found when hasMetrics is true", () => {
    render(<ExperienceReview experience={withMetrics} />);
    expect(screen.getByText("Found")).toBeInTheDocument();
    expect(screen.getByText("Measurable Achievements")).toBeInTheDocument();
  });

  it("shows Missing when hasMetrics is false", () => {
    render(<ExperienceReview experience={withoutMetrics} />);
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("renders action verb score", () => {
    render(<ExperienceReview experience={withMetrics} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Action Verbs")).toBeInTheDocument();
  });

  it("renders impact score", () => {
    render(<ExperienceReview experience={withMetrics} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Impact Score")).toBeInTheDocument();
  });

  it("renders summary text", () => {
    render(<ExperienceReview experience={withMetrics} />);
    expect(screen.getByText("Strong experience with measurable achievements.")).toBeInTheDocument();
  });

  it("renders correct text when metrics are missing", () => {
    render(<ExperienceReview experience={withoutMetrics} />);
    expect(screen.getByText("Add metrics to demonstrate impact")).toBeInTheDocument();
    expect(screen.getByText("Add more quantified results.")).toBeInTheDocument();
  });

  it("renders zero scores correctly", () => {
    const zero: ExperienceAnalysis = {
      hasMetrics: false,
      actionVerbScore: 0,
      impactScore: 0,
      summary: "No experience data.",
    };
    render(<ExperienceReview experience={zero} />);
    const zeroPercentElements = screen.getAllByText("0%");
    expect(zeroPercentElements).toHaveLength(2);
  });
});
