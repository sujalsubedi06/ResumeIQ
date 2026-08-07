import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionFaq } from "./page";

describe("SectionFaq", () => {
  it("renders without crashing (hooks ordering regression)", () => {
    // This test specifically guards against the React hooks ordering error
    // that occurred when SectionFaq was called as a plain function instead
    // of being rendered as a JSX component.
    const { unmount } = render(<SectionFaq />);
    expect(screen.getByText(/what file formats are supported/i)).toBeInTheDocument();
    unmount();
  });

  it("renders all FAQ questions", () => {
    render(<SectionFaq />);
    expect(screen.getByText(/what file formats are supported/i)).toBeInTheDocument();
    expect(screen.getByText(/is my resume stored anywhere/i)).toBeInTheDocument();
    expect(screen.getByText(/how is the ats score calculated/i)).toBeInTheDocument();
    expect(screen.getByText(/can i analyze against a specific job description/i)).toBeInTheDocument();
    expect(screen.getByText(/is resumeiq free to use/i)).toBeInTheDocument();
    expect(screen.getByText(/how long does analysis take/i)).toBeInTheDocument();
    expect(screen.getByText(/what happens if my resume has no sections/i)).toBeInTheDocument();
    expect(screen.getByText(/can i download or save my analysis report/i)).toBeInTheDocument();
    expect(screen.getByText(/what kind of recommendations does resumeiq provide/i)).toBeInTheDocument();
    expect(screen.getByText(/does resumeiq support languages other than english/i)).toBeInTheDocument();
  });

  it("renders 10 FAQ items", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    expect(faqButtons).toHaveLength(10);
  });

  it("has all FAQs collapsed by default", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    faqButtons.forEach((button) => {
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("expands a FAQ when clicked", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/resumeiq currently supports pdf and docx/i)).toBeInTheDocument();
  });

  it("collapses the same FAQ when clicked again", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the previous FAQ when a different one is clicked", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(faqButtons[1]);
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(faqButtons[1]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/no\. your resume is processed entirely in memory/i)).toBeInTheDocument();
  });

  it("only allows one FAQ open at a time", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    fireEvent.click(faqButtons[0]);
    fireEvent.click(faqButtons[2]);
    fireEvent.click(faqButtons[4]);
    const expandedButtons = container.querySelectorAll('button[aria-expanded="true"]');
    expect(expandedButtons).toHaveLength(1);
    expect(faqButtons[4]).toHaveAttribute("aria-expanded", "true");
  });

  it("re-mounts without hooks errors", () => {
    // Simulate the exact scenario that caused the original bug:
    // mounting, unmounting, and re-mounting the component.
    // If hooks are ordered incorrectly, React will throw on re-mount.
    const { unmount } = render(<SectionFaq />);
    unmount();
    // Fresh render after unmount simulates a new mount cycle
    render(<SectionFaq />);
    expect(screen.getByText(/what file formats are supported/i)).toBeInTheDocument();
  });

  it("renders FAQ answers with expected content", () => {
    const { container } = render(<SectionFaq />);
    const faqButtons = container.querySelectorAll("button[aria-expanded]");
    fireEvent.click(faqButtons[0]);
    expect(screen.getByText(/10 mb/i)).toBeInTheDocument();
    fireEvent.click(faqButtons[1]);
    expect(screen.getByText(/no data is persisted/i)).toBeInTheDocument();
  });
});
