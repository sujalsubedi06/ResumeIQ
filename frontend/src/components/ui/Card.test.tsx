import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies default styles", () => {
    render(<Card>Test</Card>);
    const card = screen.getByText("Test").closest("div");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("p-6");
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Test</Card>);
    const card = screen.getByText("Test").closest("div");
    expect(card).toHaveClass("custom-class");
  });

  it("applies hover styles when hover is true", () => {
    render(<Card hover>Test</Card>);
    const card = screen.getByText("Test").closest("div");
    expect(card).toHaveClass("hover:border-[var(--border-hover)]");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader><span>Header</span></CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders as h3 with correct styles", () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("Title");
    expect(title).toHaveClass("text-base");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("text-[var(--text-primary)]");
  });
});

describe("CardDescription", () => {
  it("renders with correct styles", () => {
    render(<CardDescription>Description</CardDescription>);
    const desc = screen.getByText("Description");
    expect(desc).toHaveClass("text-sm");
    expect(desc).toHaveClass("text-[var(--text-secondary)]");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent><span>Content</span></CardContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardContent className="custom">Content</CardContent>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom");
  });
});
