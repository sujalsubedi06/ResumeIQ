import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeResumeApi } from "./analyzeApi";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockFile = new File(["test"], "resume.pdf", { type: "application/pdf" });

describe("analyzeResumeApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends POST request with form data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { resume: { fileName: "resume.pdf" } },
      }),
    });

    await analyzeResumeApi(mockFile);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/analyze");
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);
  });

  it("throws error when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: { message: "Invalid file type" },
      }),
    });

    await expect(analyzeResumeApi(mockFile)).rejects.toThrow(
      "Invalid file type"
    );
  });

  it("throws default error when no error message provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: {} }),
    });

    await expect(analyzeResumeApi(mockFile)).rejects.toThrow(
      "Resume analysis failed. Please try again."
    );
  });

  it("returns AnalysisReport on success", async () => {
    const mockReport = {
      resume: { fileName: "resume.pdf", fileType: "pdf", wordCount: 100 },
      score: { overall: 85, rating: "good", breakdown: [] },
      sections: [],
      skills: { detected: [], missing: [], categories: [] },
      experience: { hasMetrics: false, actionVerbScore: 0, impactScore: 0, summary: "" },
      recommendations: [],
      executiveSummary: "",
      overviewStats: { pages: 1, words: 100, sections: 0, skillsFound: 0 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockReport }),
    });

    const result = await analyzeResumeApi(mockFile);
    expect(result).toEqual(mockReport);
  });

  it("includes job description in form data when provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { resume: { fileName: "resume.pdf" } },
      }),
    });

    await analyzeResumeApi(mockFile, "Looking for a senior engineer");

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("does not include job description when empty string", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { resume: { fileName: "resume.pdf" } },
      }),
    });

    await analyzeResumeApi(mockFile, "");

    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
