import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import AboutPage from "./page";

vi.mock("@/components/layout/Sidebar", () => ({
  MobileHeader: () => <div data-testid="mobile-header" />,
  Sidebar: () => <div data-testid="sidebar" />,
  MobileNavBar: () => <div data-testid="mobile-nav" />,
}));

describe("AboutPage layout", () => {
  it("gives the app shell a definite height so main scrolls internally", () => {
    // Regression: the wrapper used lg:min-h-dvh (content-driven), so main's
    // overflow-y-auto never got a bounded height and the page scrolled as a
    // document instead of scrolling inside main (same bug as the docs page).
    const { container } = render(<AboutPage />);
    const main = container.querySelector("main")!;
    expect(main).toHaveClass("overflow-y-auto");
    expect(main.parentElement).toHaveClass("h-dvh");
  });

  it("keeps the footer inside the scroll container", () => {
    // The footer must live inside main so it scrolls with the content instead
    // of creating a second document-level scroll area below the fold.
    const { container } = render(<AboutPage />);
    const main = container.querySelector("main")!;
    expect(main.querySelector("footer")).toBeTruthy();
  });

  it("clears the fixed mobile tab bar after the footer", () => {
    const { container } = render(<AboutPage />);
    const main = container.querySelector("main")!;
    const spacer = main.querySelector('[data-testid="about-mobile-spacer"]');
    expect(spacer).toBeTruthy();
    expect(spacer!.className).toContain("lg:hidden");
  });
});
