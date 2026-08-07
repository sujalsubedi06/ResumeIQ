import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyzePage from "./page";

// Stub the feature components and hooks so the test focuses on the page shell.
vi.mock("@/features/analyze/hooks/useAnalyze", () => ({
  useAnalyze: () => ({
    status: "idle",
    error: null,
    report: null,
    steps: [],
    selectedFile: null,
    currentProcessingText: "",
    startAnalysis: vi.fn(),
    resetAnalysis: vi.fn(),
  }),
}));

vi.mock("@/features/analyze/components/UploadZone", () => ({
  UploadZone: () => <div data-testid="upload-zone" />,
}));

vi.mock("@/features/analyze/components/AnalysisPipeline", () => ({
  AnalysisPipeline: () => <div data-testid="analysis-pipeline" />,
}));

vi.mock("@/features/analyze/components/Report", () => ({
  Report: () => <div data-testid="report" />,
}));

vi.mock("@/components/layout/Sidebar", () => ({
  MobileHeader: () => <div data-testid="mobile-header" />,
  Sidebar: () => <div data-testid="sidebar" />,
  MobileNavBar: () => <div data-testid="mobile-nav" />,
}));

describe("AnalyzePage layout", () => {
  it("renders the idle upload state", () => {
    render(<AnalyzePage />);
    expect(screen.getByTestId("upload-zone")).toBeInTheDocument();
  });

  it("gives the app shell a definite height so main scrolls internally", () => {
    // Regression: the wrapper used lg:min-h-dvh (content-driven), so main's
    // overflow-y-auto never got a bounded height and the page scrolled as a
    // document instead of scrolling inside main (same bug as the docs page).
    const { container } = render(<AnalyzePage />);
    const main = container.querySelector("main")!;
    expect(main).toHaveClass("overflow-y-auto");
    // The wrapper is the h-dvh shell that bounds main's height.
    expect(main.parentElement).toHaveClass("h-dvh");
  });

  it("keeps the mobile fixed-bar clearance inside the scroll container", () => {
    const { container } = render(<AnalyzePage />);
    const main = container.querySelector("main")!;
    // pt-20 clears the fixed h-14 mobile header; pb clears the fixed bottom tab bar.
    expect(main).toHaveClass("pt-20");
    expect(main).toHaveClass("pb-[calc(5rem+env(safe-area-inset-bottom))]");
  });
});
