import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

// Controllable theme mock so we can render the toggle in either theme and
// verify the icon-visibility contract without wiring up a full ThemeProvider
// (which would need a matchMedia polyfill in jsdom).
const { themeState, toggleTheme } = vi.hoisted(() => ({
  themeState: { current: "dark" as "dark" | "light" },
  toggleTheme: vi.fn(() => {
    themeState.current = themeState.current === "dark" ? "light" : "dark";
  }),
}));

vi.mock("@/lib/theme", () => ({
  useTheme: () => ({ theme: themeState.current, toggleTheme, setTheme: vi.fn() }),
}));

// The sun icon contains a <circle>; the moon icon contains only the crescent <path>.
function iconSvgs(container: HTMLElement) {
  const svgs = Array.from(container.querySelectorAll("svg"));
  const sun = svgs.find((s) => s.querySelector("circle"));
  const moon = svgs.find((s) => !s.querySelector("circle"));
  return { sun, moon, count: svgs.length };
}

function visibleIcons(container: HTMLElement) {
  return Array.from(container.querySelectorAll("svg")).filter((s) =>
    s.classList.contains("opacity-100")
  );
}

beforeEach(() => {
  themeState.current = "dark";
  toggleTheme.mockClear();
});

describe("ThemeToggle slide toggle", () => {
  it("renders both sun and moon icons", () => {
    const { container } = render(<ThemeToggle />);
    const { sun, moon, count } = iconSvgs(container);
    expect(count).toBe(2);
    expect(sun).toBeTruthy();
    expect(moon).toBeTruthy();
  });

  it("shows exactly one icon in dark mode (sun visible, moon hidden)", () => {
    themeState.current = "dark";
    const { container } = render(<ThemeToggle />);
    const { sun, moon } = iconSvgs(container);
    expect(sun).toHaveClass("opacity-100");
    expect(moon).toHaveClass("opacity-0");
    expect(visibleIcons(container).length).toBe(1);
  });

  it("shows exactly one icon in light mode (moon visible, sun hidden)", () => {
    themeState.current = "light";
    const { container } = render(<ThemeToggle />);
    const { sun, moon } = iconSvgs(container);
    expect(sun).toHaveClass("opacity-0");
    expect(moon).toHaveClass("opacity-100");
    expect(visibleIcons(container).length).toBe(1);
  });

  it("flips the visible icon when toggled", () => {
    themeState.current = "dark";
    const { container, rerender } = render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("switch"));
    rerender(<ThemeToggle />);
    const { sun, moon } = iconSvgs(container);
    expect(sun).toHaveClass("opacity-0");
    expect(moon).toHaveClass("opacity-100");
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("marks both decorative icons as aria-hidden", () => {
    const { container } = render(<ThemeToggle />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
    svgs.forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });

  it("sets the knob color to var(--toggle-icon) so the icon contrasts with the knob", () => {
    const { container } = render(<ThemeToggle />);
    // The knob is the absolutely-positioned knob inside the track — find it by
    // its inline background-color (var(--toggle-active)).
    const knob = Array.from(container.querySelectorAll("div")).find((el) =>
      el.getAttribute("style")?.includes("--toggle-active")
    );
    expect(knob).toBeTruthy();
    // The knob supplies the icon color, tuned to contrast against --toggle-active.
    expect(knob!.getAttribute("style")).toContain("color: var(--toggle-icon)");
  });

  it("lets the icon-only SVGs inherit color instead of hardcoding the knob color", () => {
    // Regression: the icons previously forced `color: var(--toggle-icon)`,
    // which is tuned for the knob background — on the page background it made
    // the icon invisible in light mode (white on white).
    const { container } = render(<ThemeToggle iconOnly />);
    const { sun, moon } = iconSvgs(container);
    expect(sun!.getAttribute("style")).toBeNull();
    expect(moon!.getAttribute("style")).toBeNull();
  });
});

describe("ThemeToggle iconOnly", () => {
  it("renders both icons with exactly one visible in dark mode", () => {
    themeState.current = "dark";
    const { container } = render(<ThemeToggle iconOnly />);
    const { sun, moon, count } = iconSvgs(container);
    expect(count).toBe(2);
    expect(sun).toHaveClass("opacity-100");
    expect(moon).toHaveClass("opacity-0");
    expect(visibleIcons(container).length).toBe(1);
  });

  it("renders both icons with exactly one visible in light mode", () => {
    themeState.current = "light";
    const { container } = render(<ThemeToggle iconOnly />);
    const { sun, moon } = iconSvgs(container);
    expect(sun).toHaveClass("opacity-0");
    expect(moon).toHaveClass("opacity-100");
    expect(visibleIcons(container).length).toBe(1);
  });

  it("renders as a subtle chip so it is discoverable in the nav", () => {
    render(<ThemeToggle iconOnly />);
    const button = screen.getByRole("button", { name: /switch to .* theme/i });
    // Subtle elevated background + border, like the GitHubStar badge in the nav.
    expect(button).toHaveClass("bg-[var(--bg-elevated)]");
    expect(button).toHaveClass("border-[var(--border)]");
  });

  it("adds focus, active, and tooltip affordances to the icon-only chip", () => {
    themeState.current = "dark";
    render(<ThemeToggle iconOnly />);
    const button = screen.getByRole("button", { name: /switch to .* theme/i });
    // Keyboard focus ring + press feedback.
    expect(button).toHaveClass("focus-visible:ring-2");
    expect(button).toHaveClass("active:bg-[var(--bg-hover)]");
    // Tooltip names the target theme; hidden from the a11y tree since the
    // button's aria-label already announces it.
    const tooltip = screen.getByText("Switch to Light theme");
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip.className).toContain("opacity-0");
    expect(tooltip.className).toContain("group-hover:opacity-100");
  });
});

describe("ThemeToggle compact", () => {
  it("renders both icons with exactly one visible", () => {
    themeState.current = "dark";
    const { container } = render(<ThemeToggle compact />);
    const { sun, moon, count } = iconSvgs(container);
    expect(count).toBe(2);
    expect(sun).toHaveClass("opacity-100");
    expect(moon).toHaveClass("opacity-0");
    expect(visibleIcons(container).length).toBe(1);
  });
});
