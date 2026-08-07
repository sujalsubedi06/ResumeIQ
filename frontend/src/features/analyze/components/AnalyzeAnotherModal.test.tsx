import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnalyzeAnotherModal } from "./AnalyzeAnotherModal";

describe("AnalyzeAnotherModal", () => {
  it("does not render when isOpen is false", () => {
    render(
      <AnalyzeAnotherModal isOpen={false} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(screen.queryByText("Analyze Another Resume")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(screen.getByText("Analyze Another Resume")).toBeInTheDocument();
  });

  it("renders the upload prompt", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(screen.getByText(/drag & drop your resume/i)).toBeInTheDocument();
  });

  it("renders format badges", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("DOCX")).toBeInTheDocument();
  });

  it("renders Cancel and Analyze buttons", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    const analyzeButton = screen.getByText("Analyze");
    expect(analyzeButton).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={onClose} onAnalyze={vi.fn()} />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={onClose} onAnalyze={vi.fn()} />
    );
    const backdrop = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders privacy note", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(
      screen.getByText(/files are processed in-memory/i)
    ).toBeInTheDocument();
  });

  it("renders job description textarea", () => {
    render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    expect(
      screen.getByPlaceholderText(/paste job description for keyword matching/i)
    ).toBeInTheDocument();
  });

  it("shows an inline error for unsupported file types", () => {
    const { container } = render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["content"], "resume.txt", { type: "text/plain" })] },
    });
    expect(
      screen.getByText("Unsupported file format. Only PDF and DOCX files are supported.")
    ).toBeInTheDocument();
  });

  it("shows an inline error when the file exceeds 10 MB", () => {
    const { container } = render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const oversized = new File([new Uint8Array(11 * 1024 * 1024)], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [oversized] } });
    expect(screen.getByText("File size exceeds 10 MB limit.")).toBeInTheDocument();
  });

  it("clears the inline error and selects the file when a valid file is chosen", async () => {
    const { container } = render(
      <AnalyzeAnotherModal isOpen={true} onClose={vi.fn()} onAnalyze={vi.fn()} />
    );
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
