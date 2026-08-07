import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import DocsPage from "./page";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/docs",
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Sidebar components to avoid deep dependency chains
vi.mock("@/components/layout/Sidebar", () => ({
  MobileHeader: ({ onMenuOpen }: { onMenuOpen: () => void }) => (
    <div data-testid="mobile-header">
      <button onClick={onMenuOpen}>Open Menu</button>
    </div>
  ),
  Sidebar: ({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) => (
    <div data-testid="sidebar">
      {mobileOpen && <button onClick={onMobileClose}>Close Sidebar</button>}
    </div>
  ),
  MobileNavBar: () => <div data-testid="mobile-nav" />,
}));

// Helper: wait for isTransitioning debounce (350ms in component) inside act()
async function waitForTransition() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 400));
  });
}

// Helper: click a ToC button by its aria-label on the dot navigation
function clickSectionDot(label: string) {
  const dot = screen.getByLabelText(`Go to ${label}`);
  fireEvent.click(dot);
}

// Helper: simulate a horizontal touch swipe across an element.
// Used by the touch-swipe regression tests below to prove that swipes on
// the scroll container never navigate (the swipe feature was removed).
function swipeOn(element: HTMLElement, startX: number, endX: number, y = 300) {
  const touch = (clientX: number) => ({
    clientX,
    clientY: y,
    identifier: 0,
    target: element,
  });
  fireEvent.touchStart(element, {
    touches: [touch(startX)],
    changedTouches: [touch(startX)],
  });
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    fireEvent.touchMove(element, {
      touches: [touch(x)],
      changedTouches: [touch(x)],
    });
  }
  fireEvent.touchEnd(element, {
    touches: [],
    changedTouches: [touch(endX)],
  });
}

describe("DocsPage", () => {
  it("renders without crashing (no hooks ordering errors)", () => {
    render(<DocsPage />);
    expect(screen.getByText("Documentation")).toBeInTheDocument();
  });

  it("renders the initial Overview section", () => {
    render(<DocsPage />);
    // Overview appears in both the section header and ToC sidebar
    expect(screen.getAllByText("Overview").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/resumeiq is a resume analysis platform/i)).toBeInTheDocument();
  });

  it("renders the overview section stats", () => {
    render(<DocsPage />);
    expect(screen.getByText("File Formats")).toBeInTheDocument();
    expect(screen.getByText("PDF & DOCX")).toBeInTheDocument();
    expect(screen.getByText("Analysis Time")).toBeInTheDocument();
    expect(screen.getByText("Data Policy")).toBeInTheDocument();
  });

  it("navigates to FAQ section via dot navigation", async () => {
    render(<DocsPage />);
    // FAQ is at index 7 — click its dot
    clickSectionDot("FAQ");

    // Wait for framer-motion AnimatePresence to swap sections
    expect(
      await screen.findByText(/what file formats are supported/i)
    ).toBeInTheDocument();
  });

  it("renders all 10 FAQ items when navigating to FAQ section", async () => {
    render(<DocsPage />);
    clickSectionDot("FAQ");

    expect(await screen.findByText(/is my resume stored anywhere/i)).toBeInTheDocument();
    expect(screen.getByText(/how is the ats score calculated/i)).toBeInTheDocument();
    expect(screen.getByText(/is resumeiq free to use/i)).toBeInTheDocument();
    expect(screen.getByText(/how long does analysis take/i)).toBeInTheDocument();
    expect(screen.getByText(/does resumeiq support languages other than english/i)).toBeInTheDocument();
  });

  it("FAQ expand/collapse works through full DocsPage render", async () => {
    const { container } = render(<DocsPage />);
    clickSectionDot("FAQ");

    // Wait for FAQ to appear
    await screen.findByText(/what file formats are supported/i);

    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    expect(faqButtons.length).toBeGreaterThanOrEqual(10);

    // Click first FAQ
    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/resumeiq currently supports pdf and docx/i)).toBeInTheDocument();

    // Click second FAQ — first should close
    fireEvent.click(faqButtons[1]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(faqButtons[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("navigates to last section and shows CTA", async () => {
    render(<DocsPage />);
    clickSectionDot("FAQ");

    // The CTA should appear on the last section
    expect(await screen.findByText("Analyze Your Resume")).toBeInTheDocument();
  });

  it("navigates to Pipeline section via dot navigation", async () => {
    render(<DocsPage />);
    clickSectionDot("Analysis Pipeline");

    expect(
      await screen.findByText(/every resume goes through a multi-stage pipeline/i)
    ).toBeInTheDocument();
  });

  it("renders ToC panel with section navigation", () => {
    render(<DocsPage />);
    expect(screen.getByText("Current Section")).toBeInTheDocument();
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("progress indicator shows current section", () => {
    render(<DocsPage />);
    // "1 / 8" appears in both SectionHeader and RightToC progress
    expect(screen.getAllByText("1 / 8").length).toBeGreaterThanOrEqual(1);
  });

  it("navigates from FAQ back to Overview without hooks errors", async () => {
    render(<DocsPage />);
    // Navigate forward to FAQ (index 7)
    clickSectionDot("FAQ");
    expect(await screen.findByText(/what file formats are supported/i)).toBeInTheDocument();

    // Wait for isTransitioning debounce to reset
    await waitForTransition();

    // Navigate back to Overview (index 0) — this is the exact scenario
    // that caused the original hooks ordering bug: SectionFaq unmounts
    // while SectionOverview mounts, and React must track hooks correctly
    // across the component boundary.
    clickSectionDot("Overview");
    expect(
      await screen.findByText(/resumeiq is a resume analysis platform/i)
    ).toBeInTheDocument();

    // Verify Overview content is fully rendered
    expect(screen.getByText("File Formats")).toBeInTheDocument();
    expect(screen.getByText("PDF & DOCX")).toBeInTheDocument();
  });

  // ── Keyboard Navigation Tests ──────────────────────────────────

  it("navigates forward with ArrowRight key", async () => {
    render(<DocsPage />);

    // Start on Overview (index 0)
    expect(screen.getAllByText("Overview").length).toBeGreaterThanOrEqual(1);

    // Press ArrowRight to go to Quick Start (index 1)
    await waitForTransition();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(
      await screen.findByText(/upload your resume/i)
    ).toBeInTheDocument();
  });

  it("navigates backward with ArrowLeft key", async () => {
    render(<DocsPage />);

    // Navigate to Pipeline (index 2) first
    clickSectionDot("Analysis Pipeline");
    expect(
      await screen.findByText(/every resume goes through a multi-stage pipeline/i)
    ).toBeInTheDocument();

    await waitForTransition();

    // Press ArrowLeft to go back to Quick Start (index 1)
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(
      await screen.findByText(/upload your resume/i)
    ).toBeInTheDocument();
  });

  it("navigates forward with ArrowDown key", async () => {
    render(<DocsPage />);

    // Press ArrowDown to go from Overview to Quick Start
    await waitForTransition();
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(
      await screen.findByText(/upload your resume/i)
    ).toBeInTheDocument();
  });

  it("navigates backward with ArrowUp key", async () => {
    render(<DocsPage />);

    // Navigate to Pipeline (index 2)
    clickSectionDot("Analysis Pipeline");
    expect(
      await screen.findByText(/every resume goes through a multi-stage pipeline/i)
    ).toBeInTheDocument();

    await waitForTransition();

    // Press ArrowUp to go back to Quick Start
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(
      await screen.findByText(/upload your resume/i)
    ).toBeInTheDocument();
  });

  it("repeated ArrowRight navigates through multiple sections", async () => {
    render(<DocsPage />);

    // Press ArrowRight 3 times to go from Overview (0) → Quick Start (1) → Pipeline (2) → Categories (3)
    await waitForTransition();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    await waitForTransition();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    await waitForTransition();
    fireEvent.keyDown(window, { key: "ArrowRight" });

    // Should be on Categories section (index 3)
    expect(
      await screen.findByText(/each category is independently scored/i)
    ).toBeInTheDocument();
  });

  it("does not navigate past the last section with ArrowRight", async () => {
    render(<DocsPage />);

    // Navigate to FAQ (last section, index 7)
    clickSectionDot("FAQ");
    expect(await screen.findByText(/what file formats are supported/i)).toBeInTheDocument();

    await waitForTransition();

    // Press ArrowRight — should stay on FAQ
    fireEvent.keyDown(window, { key: "ArrowRight" });
    await waitForTransition();
    expect(screen.getByText(/what file formats are supported/i)).toBeInTheDocument();
  });

  it("does not navigate before the first section with ArrowLeft", async () => {
    render(<DocsPage />);

    // Already on Overview (index 0)
    await waitForTransition();

    // Press ArrowLeft — should stay on Overview
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    await waitForTransition();
    expect(
      screen.getAllByText("Overview").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("navigates from FAQ to Overview and back to FAQ", async () => {
    render(<DocsPage />);

    // Forward to FAQ
    clickSectionDot("FAQ");
    expect(await screen.findByText(/what file formats are supported/i)).toBeInTheDocument();

    // Wait for debounce
    await waitForTransition();

    // Back to Overview
    clickSectionDot("Overview");
    expect(
      await screen.findByText(/resumeiq is a resume analysis platform/i)
    ).toBeInTheDocument();

    // Wait for debounce
    await waitForTransition();

    // Forward to FAQ again — hooks must remain correctly ordered
    clickSectionDot("FAQ");
    expect(
      await screen.findByText(/what file formats are supported/i)
    ).toBeInTheDocument();

    // Verify FAQ content is fully rendered after round-trip
    expect(screen.getByText(/what file formats are supported/i)).toBeInTheDocument();
  });

  // ── Touch Swipe Regression Tests ────────────────────────────────
  // The mobile swipe-to-navigate feature was removed from the docs page.
  // These tests lock in that behavior: touch swipes on the scroll
  // container must NEVER change the current section.

  it("does not navigate when swiping left on the scroll container", async () => {
    render(<DocsPage />);
    const scrollContainer = screen.getByTestId("docs-scroll-container");

    // Simulate the removed mobile swipe-to-next gesture (leftward swipe)
    swipeOn(scrollContainer, 350, 50);

    await waitForTransition();

    // Must still be on Overview — Quick Start content must not be shown.
    // Async query guards against a slow section swap if swipes are ever re-added.
    expect(
      await screen.findByText(/resumeiq is a resume analysis platform/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/upload your resume/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("1 / 8").length).toBeGreaterThanOrEqual(1);
  });

  it("does not navigate when swiping right on the scroll container", async () => {
    render(<DocsPage />);
    const scrollContainer = screen.getByTestId("docs-scroll-container");

    // Simulate the removed mobile swipe-to-previous gesture (rightward swipe)
    swipeOn(scrollContainer, 50, 350);

    await waitForTransition();

    // Must still be on Overview
    expect(
      await screen.findByText(/resumeiq is a resume analysis platform/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/upload your resume/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("1 / 8").length).toBeGreaterThanOrEqual(1);
  });

  // ── Responsive Layout Tests ──────────────────────────────────────

  it("uses dvh-based heights so the layout fits mobile browser chrome", () => {
    const { container } = render(<DocsPage />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("min-h-dvh");
  });

  it("clears the fixed mobile header with top padding on mobile only", () => {
    const { container } = render(<DocsPage />);
    const main = container.querySelector("main")!;
    // pt-14 (56px) matches the fixed h-14 MobileHeader; lg:pt-0 on desktop
    expect(main).toHaveClass("pt-14");
    expect(main).toHaveClass("lg:pt-0");
  });

  it("reserves space for the fixed mobile bottom tab bar", () => {
    const { container } = render(<DocsPage />);
    const main = container.querySelector("main")!;
    // pb clears the fixed MobileNavBar plus the iPhone home indicator
    expect(main).toHaveClass("pb-[calc(4rem+env(safe-area-inset-bottom))]");
    expect(main).toHaveClass("lg:pb-0");
  });

  it("makes the content area the scrollable overflow container", () => {
    render(<DocsPage />);
    const scrollContainer = screen.getByTestId("docs-scroll-container");
    expect(scrollContainer).toHaveClass("overflow-y-auto");
    expect(scrollContainer).toHaveClass("overscroll-contain");
    expect(scrollContainer).toHaveClass("flex-1");
  });

  it("gives main a definite viewport height so the content area scrolls internally", () => {
    // Regression: main used min-h-dvh (content-driven), so the flex-1 scroll
    // container never got a bounded height and grew with its content instead
    // of scrolling — the header progress bar and bottom nav scrolled away.
    const { container } = render(<DocsPage />);
    const main = container.querySelector("main")!;
    expect(main).toHaveClass("h-dvh");
    expect(main).toHaveClass("overflow-hidden");
  });

  // ── Mobile Progress Row ──────────────────────────────────────────
  // The slider + section dots are hidden below `sm`, so a compact progress
  // row (position bar + current section label) is shown to mobile users.

  it("shows a mobile-only progress row in the bottom bar", () => {
    const { container } = render(<DocsPage />);
    const row = container.querySelector('[data-testid="docs-mobile-progress"]');
    expect(row).not.toBeNull();
    expect(row).toHaveClass("sm:hidden");
    // Shows the current position out of the total section count
    expect(row!.textContent).toContain("1");
    expect(row!.textContent).toContain("8");
    // And the current section's label
    expect(row!.textContent).toContain("Overview");
  });

  it("lets long endpoint paths wrap on small screens", async () => {
    render(<DocsPage />);
    // The API section (where endpoints are listed) is only rendered after navigating
    clickSectionDot("API Reference");
    await screen.findByRole("heading", { name: /error codes/i });

    const endpoints = screen.getAllByText("/api/v1/analyze");
    expect(endpoints.length).toBeGreaterThanOrEqual(1);
    expect(endpoints.some((el) => el.classList.contains("break-all"))).toBe(true);
  });

});
