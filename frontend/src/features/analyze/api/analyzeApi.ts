import { API_BASE_URL } from "@/lib/api";
import { AnalysisReport } from "../types/analysis";

// Analysis typically finishes in 5–10s; cap at 90s so a hung request can't
// leave the user stuck in the processing state forever.
const REQUEST_TIMEOUT_MS = 90_000;

export async function analyzeResumeApi(
  file: File,
  jobDescription?: string
): Promise<AnalysisReport> {
  const formData = new FormData();
  formData.append("resume", file);
  if (jobDescription && jobDescription.trim()) {
    formData.append("job_description", jobDescription.trim());
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    // Some browsers/webviews reject aborted fetches with a plain Error whose
    // name is "AbortError" rather than a DOMException — detect by name only.
    if ((err as { name?: string } | null)?.name === "AbortError") {
      throw new Error("Analysis timed out. Please try again.");
    }
    throw new Error(
      "Could not reach the analysis server. Please check your connection and try again."
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // e.g. an HTML error page from a proxy/gateway instead of JSON
    throw new Error(
      "The server returned an unexpected response. Please try again."
    );
  }

  if (!response.ok || !(data as { success?: boolean })?.success) {
    const errorMsg =
      (data as { error?: { message?: string } })?.error?.message ||
      "Resume analysis failed. Please try again.";
    throw new Error(errorMsg);
  }

  return (data as { data: AnalysisReport }).data;
}
