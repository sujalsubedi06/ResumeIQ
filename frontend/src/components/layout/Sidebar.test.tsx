import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/lib/theme";
import { Sidebar, MobileHeader, MobileNavBar } from "./Sidebar";

// Mutable pathname so tests can drive active states
const mockUsePathname = vi.fn(() => "/");

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("MobileHeader", () => {
  it("renders the logo and an 'Open menu' button", () => {
    render(<MobileHeader onMenuOpen={() => {}} />);
    expect(screen.getByText("ResumeIQ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open menu" })
    ).toBeInTheDocument();
  });

  it("is only visible on mobile (lg:hidden)", () => {
    render(<MobileHeader onMenuOpen={() => {}} />);
    expect(screen.getByRole("banner")).toHaveClass("lg:hidden");
  });

  it("calls onMenuOpen when the menu button is clicked", () => {
    const onMenuOpen = vi.fn();
    render(<MobileHeader onMenuOpen={onMenuOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(onMenuOpen).toHaveBeenCalledTimes(1);
  });
});

describe("MobileNavBar", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("renders all four mobile tabs", () => {
    render(<MobileNavBar />);
    expect(screen.getByText("Analyze")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("is only visible on mobile (lg:hidden)", () => {
    render(<MobileNavBar />);
    expect(screen.getByRole("navigation")).toHaveClass("lg:hidden");
  });

  it("highlights the tab matching the current path", () => {
    mockUsePathname.mockReturnValue("/docs");
    render(<MobileNavBar />);
    const docsTab = screen.getByText("Docs").closest("a")!;
    expect(docsTab).toHaveClass("text-[var(--text-primary)]");
    const aboutTab = screen.getByText("About").closest("a")!;
    expect(aboutTab).toHaveClass("text-[var(--text-muted)]");
  });

  it("opens GitHub in a new tab", () => {
    render(<MobileNavBar />);
    const ghTab = screen.getByText("GitHub").closest("a")!;
    expect(ghTab).toHaveAttribute(
      "href",
      "https://github.com/sujalsubedi06/ResumeIQ"
    );
    expect(ghTab).toHaveAttribute("target", "_blank");
    expect(ghTab).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("Sidebar", () => {
  it("renders the desktop sidebar hidden on mobile (hidden lg:flex)", () => {
    renderWithTheme(<Sidebar />);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveClass("hidden");
    expect(aside).toHaveClass("lg:flex");
  });

  it("does not render the mobile overlay when closed", () => {
    renderWithTheme(<Sidebar mobileOpen={false} />);
    expect(
      screen.queryByRole("button", { name: "Close menu" })
    ).not.toBeInTheDocument();
  });

  it("renders the mobile overlay when open", () => {
    renderWithTheme(<Sidebar mobileOpen onMobileClose={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Close menu" })
    ).toBeInTheDocument();
    // Overlay itself is hidden on desktop (lg:hidden)
    expect(
      screen.getByRole("button", { name: "Close menu" }).closest(".lg\\:hidden")
    ).not.toBeNull();
  });

  it("calls onMobileClose when the overlay close button is clicked", () => {
    const onMobileClose = vi.fn();
    renderWithTheme(<Sidebar mobileOpen onMobileClose={onMobileClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  it("highlights the active link for the current path", () => {
    mockUsePathname.mockReturnValue("/docs");
    renderWithTheme(<Sidebar />);
    const docsLink = screen.getByText("Documentation").closest("a")!;
    expect(docsLink).toHaveClass("text-[var(--text-primary)]");
  });
});
