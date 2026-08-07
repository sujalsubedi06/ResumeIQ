import { AnalysisReport, AnalysisStep } from "../analysis";

export function createMockReport(overrides?: Partial<AnalysisReport>): AnalysisReport {
  return {
    resume: {
      fileName: "resume.pdf",
      fileType: "pdf",
      pageCount: 2,
      wordCount: 450,
      fileSizeBytes: 128_000,
    },
    score: {
      overall: 87,
      rating: "excellent",
      breakdown: [
        { category: "Formatting", score: 20, maxScore: 20, description: "Clean ATS-compatible formatting" },
        { category: "Sections", score: 18, maxScore: 20, description: "Most key sections present" },
        { category: "Skills", score: 17, maxScore: 20, description: "Good skill coverage" },
        { category: "Experience", score: 19, maxScore: 20, description: "Strong experience descriptions" },
        { category: "Keywords", score: 13, maxScore: 20, description: "Could improve keyword density" },
      ],
    },
    sections: [
      { name: "Summary", exists: true, quality: "strong" },
      { name: "Experience", exists: true, quality: "strong" },
      { name: "Education", exists: true, quality: "acceptable" },
      { name: "Skills", exists: true, quality: "strong" },
      { name: "Projects", exists: false, quality: "missing" },
    ],
    skills: {
      detected: ["Python", "JavaScript", "React", "FastAPI", "TypeScript", "PostgreSQL"],
      missing: ["Docker", "AWS"],
      categories: [
        { category: "Frontend", skills: ["JavaScript", "React", "TypeScript"] },
        { category: "Backend", skills: ["Python", "FastAPI"] },
        { category: "Database", skills: ["PostgreSQL"] },
      ],
    },
    experience: {
      hasMetrics: true,
      actionVerbScore: 85,
      impactScore: 70,
      summary: "Strong experience section with measurable achievements and good action verb usage.",
    },
    recommendations: [
      {
        id: "rec-1",
        priority: "high",
        title: "Missing measurable achievements",
        description: "Some experience bullets lack quantified outcomes.",
        suggestion: "Add specific metrics like 'Reduced response time by 40%'",
      },
      {
        id: "rec-2",
        priority: "medium",
        title: "Consider adding a Projects section",
        description: "A dedicated Projects section showcases technical work.",
        suggestion: "Add 2-3 key projects with technologies used and outcomes.",
      },
      {
        id: "rec-3",
        priority: "low",
        title: "Add more industry keywords",
        description: "Your resume could benefit from additional industry-standard keywords.",
        suggestion: "Review job descriptions in your target field for common keywords.",
      },
    ],
    executiveSummary:
      "Your resume performs well against ATS standards. Strong formatting and section presence. Consider adding more quantified achievements.",
    overviewStats: {
      pages: 2,
      words: 450,
      sections: 4,
      skillsFound: 6,
    },
    ...overrides,
  };
}

export function createMockSteps(overrides?: AnalysisStep[]): AnalysisStep[] {
  const defaultSteps: AnalysisStep[] = [
    { id: "step-1", title: "Resume Uploaded", subtitle: "File received successfully", status: "completed" },
    { id: "step-2", title: "Parsing Document", subtitle: "Reading document structure", status: "completed" },
    { id: "step-3", title: "Extracting Sections", subtitle: "Identifying resume sections", status: "completed" },
    { id: "step-4", title: "Skills Analysis", subtitle: "Detecting technical skills", status: "in_progress" },
    { id: "step-5", title: "ATS Score Calculation", subtitle: "Calculating ATS score", status: "pending" },
    { id: "step-6", title: "Generating Report", subtitle: "Preparing analysis report", status: "pending" },
  ];

  if (overrides) return overrides;
  return defaultSteps;
}
