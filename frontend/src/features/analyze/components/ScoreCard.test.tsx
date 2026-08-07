import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreCard } from "./ScoreCard";

describe("ScoreCard", () => {
  it("renders the score label", () => {
    render(<ScoreCard score={87} rating="excellent" />);
    expect(screen.getByText("ATS SCORE")).toBeInTheDocument();
  });

  it("renders the score value and total", () => {
    render(<ScoreCard score={87} rating="excellent" />);
    expect(screen.getByText("/ 100")).toBeInTheDocument();
    expect(screen.getByText("87/100")).toBeInTheDocument();
  });

  it("renders the rating text for excellent", () => {
    render(<ScoreCard score={95} rating="excellent" />);
    expect(screen.getByText("Excellent Compatibility")).toBeInTheDocument();
  });

  it("renders the rating text for good", () => {
    render(<ScoreCard score={75} rating="good" />);
    expect(screen.getByText("Good Compatibility")).toBeInTheDocument();
  });

  it("renders the rating text for average", () => {
    render(<ScoreCard score={60} rating="average" />);
    expect(screen.getByText("Average Compatibility")).toBeInTheDocument();
  });

  it("renders the rating text for needs_improvement", () => {
    render(<ScoreCard score={35} rating="needs_improvement" />);
    expect(screen.getByText("Needs Improvement")).toBeInTheDocument();
  });

  it("renders with a custom label", () => {
    render(<ScoreCard score={87} rating="excellent" label="CUSTOM SCORE" />);
    expect(screen.getByText("CUSTOM SCORE")).toBeInTheDocument();
  });

  it("renders aria attributes for accessibility", () => {
    render(<ScoreCard score={87} rating="excellent" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "87");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders the trending up icon for excellent rating", () => {
    const { container } = render(<ScoreCard score={87} rating="excellent" />);
    const trendIcon = container.querySelector('[class*="text-emerald"]');
    expect(trendIcon).not.toBeNull();
  });
});
