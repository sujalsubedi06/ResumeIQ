from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field
from app.schemas.parser import ResumeMetadata

class ScoreCategory(BaseModel):
    category: str = Field(..., description="Category name (e.g. Formatting, Sections, Skills, Experience, Keywords)")
    score: int = Field(..., description="Earned score points")
    maxScore: int = Field(..., description="Maximum possible points in this category")
    description: Optional[str] = Field(default=None, description="Explanation of category evaluation")

class ScoreResult(BaseModel):
    overall: int = Field(..., description="Overall ATS compatibility score (0-100)")
    rating: Literal["excellent", "good", "average", "needs_improvement"] = Field(
        ..., description="Qualitative rating label"
    )
    breakdown: List[ScoreCategory] = Field(..., description="Detailed breakdown per category")

class SectionResult(BaseModel):
    name: str = Field(..., description="Standard section name")
    exists: bool = Field(..., description="Whether section was detected")
    quality: Literal["strong", "acceptable", "weak", "missing"] = Field(
        ..., description="Evaluation of section quality"
    )

class SkillCategory(BaseModel):
    category: str = Field(..., description="Skill category name (e.g. Languages, Frameworks, Cloud)")
    skills: List[str] = Field(..., description="List of skills detected in this category")

class SkillAnalysis(BaseModel):
    detected: List[str] = Field(..., description="All detected skills")
    missing: List[str] = Field(..., description="Common recommended missing skills")
    categories: List[SkillCategory] = Field(..., description="Categorized list of detected skills")

class ExperienceAnalysis(BaseModel):
    hasMetrics: bool = Field(..., description="Whether quantified metrics/achievements were found")
    actionVerbScore: int = Field(..., description="Action verb usage quality score (0-100)")
    impactScore: int = Field(..., description="Impact and achievement density score (0-100)")
    summary: str = Field(..., description="Overall summary of experience evaluation")

class Recommendation(BaseModel):
    id: str = Field(..., description="Unique recommendation ID")
    priority: Literal["high", "medium", "low"] = Field(..., description="Priority level")
    title: str = Field(..., description="Short title of recommendation")
    description: str = Field(..., description="Problem description and reason")
    suggestion: Optional[str] = Field(default=None, description="Concrete actionable advice")

class OverviewStats(BaseModel):
    pages: int = Field(..., description="Page count")
    words: int = Field(..., description="Total word count")
    sections: int = Field(..., description="Detected sections count")
    skillsFound: int = Field(..., description="Number of detected skills")

class AnalysisReport(BaseModel):
    resume: ResumeMetadata = Field(..., description="Resume metadata")
    score: ScoreResult = Field(..., description="ATS score and breakdown")
    sections: List[SectionResult] = Field(..., description="Section detection results")
    skills: SkillAnalysis = Field(..., description="Skills analysis result")
    experience: ExperienceAnalysis = Field(..., description="Experience evaluation result")
    recommendations: List[Recommendation] = Field(..., description="Prioritized recommendations")
    executiveSummary: str = Field(..., description="High-level executive summary of report")
    overviewStats: OverviewStats = Field(..., description="Summary overview statistics")
