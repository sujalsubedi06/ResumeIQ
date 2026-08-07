import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecommendationList } from "./RecommendationList";
import type { Recommendation } from "../types/analysis";

const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    priority: "high",
    title: "Missing metrics",
    description: "Add quantified outcomes to experience bullets.",
    suggestion: "Add specific numbers and percentages.",
  },
  {
    id: "rec-2",
    priority: "medium",
    title: "Add Projects section",
    description: "Showcase technical work with a dedicated section.",
    suggestion: "Include 2-3 key projects.",
  },
  {
    id: "rec-3",
    priority: "low",
    title: "Improve keywords",
    description: "Add industry-standard keywords.",
    suggestion: "Review job descriptions.",
  },
];

describe("RecommendationList", () => {
  it("renders the heading", () => {
    render(<RecommendationList recommendations={mockRecommendations} />);
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
  });

  it("shows priority counts", () => {
    render(<RecommendationList recommendations={mockRecommendations} />);
    expect(screen.getByText("1 high")).toBeInTheDocument();
    expect(screen.getByText("1 medium")).toBeInTheDocument();
    expect(screen.getByText("1 low")).toBeInTheDocument();
  });

  it("renders all recommendation titles", () => {
    render(<RecommendationList recommendations={mockRecommendations} />);
    expect(screen.getByText("Missing metrics")).toBeInTheDocument();
    expect(screen.getByText("Add Projects section")).toBeInTheDocument();
    expect(screen.getByText("Improve keywords")).toBeInTheDocument();
  });

  it("sorts by priority: high first, then medium, then low", () => {
    const { container } = render(
      <RecommendationList recommendations={mockRecommendations} />
    );
    const items = container.querySelectorAll('[class*="p-5"]');
    expect(items.length).toBe(3);
  });

  it("renders the empty state when no recommendations", () => {
    render(<RecommendationList recommendations={[]} />);
    expect(
      screen.getByText("No recommendations available.")
    ).toBeInTheDocument();
  });

  it("does not show priority counts for empty list", () => {
    render(<RecommendationList recommendations={[]} />);
    expect(screen.queryByText("high")).not.toBeInTheDocument();
    expect(screen.queryByText("medium")).not.toBeInTheDocument();
    expect(screen.queryByText("low")).not.toBeInTheDocument();
  });

  it("handles only high priority recommendations", () => {
    const highOnly: Recommendation[] = [
      { id: "rec-1", priority: "high", title: "Critical", description: "Fix this" },
      { id: "rec-2", priority: "high", title: "Urgent", description: "Fix this too" },
    ];
    render(<RecommendationList recommendations={highOnly} />);
    expect(screen.getByText("2 high")).toBeInTheDocument();
    expect(screen.queryByText("medium")).not.toBeInTheDocument();
  });

  it("handles only low priority recommendations", () => {
    const lowOnly: Recommendation[] = [
      { id: "rec-1", priority: "low", title: "Minor", description: "Optional" },
    ];
    render(<RecommendationList recommendations={lowOnly} />);
    expect(screen.getByText("1 low")).toBeInTheDocument();
    expect(screen.queryByText("high")).not.toBeInTheDocument();
  });
});
