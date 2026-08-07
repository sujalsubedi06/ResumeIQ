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
