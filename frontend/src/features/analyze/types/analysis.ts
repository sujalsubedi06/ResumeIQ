export interface ResumeMetadata {
  fileName: string;
  fileType: "pdf" | "docx";
  pageCount?: number | null;
  wordCount: number;
  fileSizeBytes: number;
}

export interface ScoreCategory {
  category: string;
  score: number;
  maxScore: number;
  description?: string;
}

export interface ScoreResult {
  overall: number;
  rating: "excellent" | "good" | "average" | "needs_improvement";
  breakdown: ScoreCategory[];
}

export interface SectionResult {
  name: string;
  exists: boolean;
  quality: "strong" | "acceptable" | "weak" | "missing";
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface SkillAnalysis {
  detected: string[];
  missing: string[];
  categories: SkillCategory[];
}

export interface ExperienceAnalysis {
  hasMetrics: boolean;
  actionVerbScore: number;
  impactScore: number;
  summary: string;
}

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion?: string;
}

export interface OverviewStats {
  pages: number;
  words: number;
  sections: number;
  skillsFound: number;
}

export interface AnalysisReport {
  resume: ResumeMetadata;
  score: ScoreResult;
  sections: SectionResult[];
  skills: SkillAnalysis;
  experience: ExperienceAnalysis;
  recommendations: Recommendation[];
  executiveSummary: string;
  overviewStats: OverviewStats;
}

export interface AnalysisStep {
  id: string;
  title: string;
  subtitle: string;
  status: "pending" | "in_progress" | "completed" | "error";
  time?: string;
}
