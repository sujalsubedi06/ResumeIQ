import { AnalysisReport } from "../types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function analyzeResumeApi(file: File, jobDescription?: string): Promise<AnalysisReport> {
  const formData = new FormData();
  formData.append("resume", file);
  if (jobDescription && jobDescription.trim()) {
    formData.append("job_description", jobDescription.trim());
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data?.error?.message || "Resume analysis failed. Please try again.";
    throw new Error(errorMsg);
  }

  return data.data as AnalysisReport;
}
