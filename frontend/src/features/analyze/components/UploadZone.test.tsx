import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadZone } from "./UploadZone";

describe("UploadZone", () => {
  it("renders the upload prompt", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(screen.getByText(/drag & drop your resume/i)).toBeInTheDocument();
    expect(screen.getByText(/browse files/i)).toBeInTheDocument();
  });

  it("renders supported format badges", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("DOCX")).toBeInTheDocument();
    expect(screen.getByText("Max 10 MB")).toBeInTheDocument();
  });

  it("renders the analyze button disabled when no file is selected", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    const buttons = screen.getAllByText("Analyze Resume");
    const button = buttons[buttons.length - 1].closest("button");
    expect(button).toBeDisabled();
  });

  it("shows error banner when error prop is provided", () => {
    render(<UploadZone onAnalyze={vi.fn()} error="Invalid file format" />);
    expect(screen.getByText("Invalid file format")).toBeInTheDocument();
  });

  it("shows try again button when error and onReset are provided", () => {
    const onReset = vi.fn();
    render(<UploadZone onAnalyze={vi.fn()} error="Something went wrong" onReset={onReset} />);
    const tryAgain = screen.getByText("Try again");
    expect(tryAgain).toBeInTheDocument();
    fireEvent.click(tryAgain);
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("renders security message", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(
      screen.getByText(/your file is secure and never stored/i)
    ).toBeInTheDocument();
  });

  it("renders job description textarea", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(
      screen.getByPlaceholderText(/paste the job description here/i)
    ).toBeInTheDocument();
  });

  it("shows character count for job description", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(screen.getByText("0 / 2000")).toBeInTheDocument();
  });

  it("shows page title and subtitle", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    expect(screen.getAllByText("Analyze Resume").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/upload your resume to receive a detailed/i)
    ).toBeInTheDocument();
  });

  it("shows the 'or browse files' link for file selection", () => {
    render(<UploadZone onAnalyze={vi.fn()} />);
    const browseLink = screen.getByText(/browse files/i);
    expect(browseLink).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<UploadZone onAnalyze={vi.fn()} disabled={true} />);
    const buttons = screen.getAllByText("Analyze Resume");
    const button = buttons[buttons.length - 1].closest("button");
    expect(button).toBeDisabled();
  });

  it("shows an inline error for unsupported file types", () => {
    const { container } = render(<UploadZone onAnalyze={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["content"], "resume.txt", { type: "text/plain" })] },
    });
    expect(
      screen.getByText("Unsupported file format. Only PDF and DOCX files are supported.")
    ).toBeInTheDocument();
  });

  it("shows an inline error when the file exceeds 10 MB", () => {
    const { container } = render(<UploadZone onAnalyze={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const oversized = new File([new Uint8Array(11 * 1024 * 1024)], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [oversized] } });
    expect(screen.getByText("File size exceeds 10 MB limit.")).toBeInTheDocument();
  });

  it("clears the inline error and selects the file when a valid file is chosen", async () => {
    const { container } = render(<UploadZone onAnalyze={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["content"], "resume.txt", { type: "text/plain" })] },
    });
    expect(
      screen.getByText("Unsupported file format. Only PDF and DOCX files are supported.")
    ).toBeInTheDocument();

    fireEvent.change(input, {
      target: { files: [new File(["content"], "resume.pdf", { type: "application/pdf" })] },
    });
    expect(
      screen.queryByText("Unsupported file format. Only PDF and DOCX files are supported.")
    ).not.toBeInTheDocument();
    expect(await screen.findByText("resume.pdf")).toBeInTheDocument();
  });
});
