import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnalyze } from "./useAnalyze";

// Mock the analyze API
vi.mock("../api/analyzeApi", () => ({
  analyzeResumeApi: vi.fn(),
}));

import { analyzeResumeApi } from "../api/analyzeApi";

const mockFile = new File(["test content"], "resume.pdf", { type: "application/pdf" });

describe("useAnalyze", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts in idle status", () => {
    const { result } = renderHook(() => useAnalyze());
    expect(result.current.status).toBe("idle");
    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("starts with initial steps all pending", () => {
    const { result } = renderHook(() => useAnalyze());
    expect(result.current.steps.length).toBeGreaterThan(0);
    result.current.steps.forEach((step) => {
      expect(step.status).toBe("pending");
    });
  });

  it("sets status to uploading on startAnalysis", async () => {
    // Mock API to never resolve so we can inspect the intermediate uploading state
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAnalyze());
    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe("uploading");
  });

  it("sets selectedFile on startAnalysis", async () => {
    const { result } = renderHook(() => useAnalyze());
    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.selectedFile?.name).toBe("resume.pdf");
  });

  it("sets status to completed on successful analysis", async () => {
    const mockReport = { resume: { fileName: "test.pdf" } };
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockResolvedValue(mockReport);

    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.status).toBe("completed");
    expect(result.current.report).toEqual(mockReport);
  });

  it("sets status to error on failed analysis", async () => {
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("API error occurred")
    );

    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("API error occurred");
  });

  it("sets a default error message when error has no message", async () => {
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockRejectedValue(null);

    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(
      "An unexpected error occurred during resume analysis."
    );
  });

  it("resets to idle on resetAnalysis", async () => {
    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(0);
    });

    act(() => {
      result.current.resetAnalysis();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.selectedFile).toBeNull();
  });

  it("clears error on new analysis", async () => {
    // Mock API to reject so we get into error state
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(result.current.error).toBe("fail");

    // Mock API to resolve successfully for the second call
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockResolvedValue({});

    // Call startAnalysis again - should clear error
    await act(async () => {
      result.current.startAnalysis(mockFile);
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.error).toBeNull();
  });

  it("updates step statuses through the pipeline", async () => {
    const mockReport = { resume: { fileName: "test.pdf" } };
    (analyzeResumeApi as ReturnType<typeof vi.fn>).mockResolvedValue(mockReport);

    const { result } = renderHook(() => useAnalyze());

    await act(async () => {
      result.current.startAnalysis(mockFile);
      // Let the initial synchronous state updates settle
      await vi.advanceTimersByTimeAsync(0);
    });

    // After startAnalysis, step 0 should be in_progress
    expect(result.current.steps[0].status).toBe("in_progress");

    // Advance to 500ms — step 0 completes, step 1 starts
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(result.current.steps[0].status).toBe("completed");
    expect(result.current.steps[1].status).toBe("in_progress");

    // Advance to 1000ms — step 1 completes, step 2 starts
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(result.current.steps[1].status).toBe("completed");
    expect(result.current.steps[2].status).toBe("in_progress");

    // Advance to 1500ms — step 2 completes, step 3 starts
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(result.current.steps[2].status).toBe("completed");
    expect(result.current.steps[3].status).toBe("in_progress");
  });
});
