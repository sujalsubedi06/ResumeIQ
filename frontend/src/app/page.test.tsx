import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ThemeProvider } from "@/lib/theme";
import HomePage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

// GitHubStar is dynamically imported (ssr: false) and fetches stars — mock it
vi.mock("@/components/ui/GitHubStar", () => ({
  GitHubStar: () => <span data-testid="github-star" />,
}));

describe("HomePage mobile navigation", () => {
  it("renders a hamburger toggle that is visible only on mobile", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveClass("sm:hidden");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-haspopup", "menu");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-nav-menu");
  });

  it("opens the dropdown menu when the hamburger is clicked", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Close menu" })
    ).toBeInTheDocument();

    const menu = screen.getByRole("navigation", { name: "Main menu" });
    expect(within(menu).getByText("Documentation")).toBeInTheDocument();
    expect(within(menu).getByText("About")).toBeInTheDocument();
    expect(within(menu).getByText("GitHub")).toBeInTheDocument();
    expect(within(menu).getByText("Portfolio")).toBeInTheDocument();
  });

  it("closes the menu when a navigation link is clicked", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);

    const menu = screen.getByRole("navigation", { name: "Main menu" });
    fireEvent.click(within(menu).getByText("Documentation"));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Open menu" })
    ).toBeInTheDocument();
  });

  it("closes the menu on Escape", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the menu when clicking outside the nav", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);

    fireEvent.pointerDown(document.body);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the menu open when clicking inside the nav", () => {
    renderWithTheme(<HomePage />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);

    fireEvent.pointerDown(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("hides the GitHub star and Docs link on small screens", async () => {
    renderWithTheme(<HomePage />);
    // Menu is closed here, so the outer <nav> is the only navigation landmark.
    const nav = screen.getByRole("navigation");

    // The nav GitHubStar is dynamically imported (ssr: false), so wait for it
    const star = await within(nav).findByTestId("github-star");
    const starWrapper = star.closest("div")!;
    expect(starWrapper).toHaveClass("hidden", "sm:flex");

    // The Docs link sits in a wrapper hidden on mobile too
    const docsWrapper = within(nav).getByText("Docs").closest("div")!;
    expect(docsWrapper).toHaveClass("hidden", "sm:flex");
  });
});
