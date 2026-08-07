import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[var(--bg-elevated)]");
    expect(badge).toHaveClass("border-[var(--border)]");
  });

  it("renders with success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass("bg-emerald-400/10");
  });

  it("renders with warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass("bg-yellow-400/10");
  });

  it("renders with error variant", () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText("Error")).toHaveClass("bg-red-400/10");
  });

  it("renders with info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText("Info")).toHaveClass("bg-blue-400/10");
  });

  it("applies custom className", () => {
    render(<Badge className="custom">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom");
  });

  it("has correct base styles", () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText("Test");
    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("font-medium");
    expect(badge).toHaveClass("rounded-lg");
  });
});
