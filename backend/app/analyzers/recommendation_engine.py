from typing import List, Optional
from app.schemas.analysis import (
    ExperienceAnalysis,
    Recommendation,
    SectionResult,
    SkillAnalysis,
    ScoreResult,
)

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(
        sections: List[SectionResult],
        skills: SkillAnalysis,
        experience: ExperienceAnalysis,
        score: ScoreResult,
        job_description: Optional[str] = None,
    ) -> List[Recommendation]:

        recommendations: List[Recommendation] = []

        # 1. High Priority: Missing Essential Sections
        missing_sections = [s.name for s in sections if s.name in ["Experience", "Education", "Contact Information", "Skills"] and not s.exists]
        if missing_sections:
            recommendations.append(
                Recommendation(
                    id="rec-missing-sections",
                    priority="high",
                    title="Missing essential resume sections",
                    description=f"Your resume lacks standard headers for: {', '.join(missing_sections)}.",
                    suggestion="Add standard section headers to ensure ATS parsers correctly index your work history and credentials.",
                )
            )

        # 2. High Priority: Lack of Measurable Achievements
        if not experience.hasMetrics:
            recommendations.append(
                Recommendation(
                    id="rec-experience-metrics",
                    priority="high",
                    title="Add measurable achievements to experience",
                    description="Your experience bullets currently lack quantified metrics and measurable outcomes.",
                    suggestion="Incorporate quantified impact numbers (e.g., 'Reduced API latency by 40%', 'Managed system serving 10k+ users').",
                )
            )

        # 3. Medium Priority: Skill Coverage & Common Missing Skills
        if skills.missing:
            recommendations.append(
                Recommendation(
                    id="rec-missing-skills",
                    priority="medium",
                    title="Increase keyword alignment with industry standards",
                    description=f"Common technical keywords not detected: {', '.join(skills.missing[:4])}.",
                    suggestion="Add relevant technical competencies and tools you have experience with to improve ATS match score.",
                )
            )

        # 4. Medium Priority: Action Verbs
        if experience.actionVerbScore < 70:
            recommendations.append(
                Recommendation(
                    id="rec-action-verbs",
                    priority="medium",
                    title="Strengthen experience bullet action verbs",
                    description="Bullet points rely on passive phrasing or repetitive descriptors.",
                    suggestion="Begin bullet points with strong active verbs like 'Architected', 'Implemented', 'Optimized', or 'Orchestrated'.",
                )
            )

        # 5. Low Priority: Projects Section
        has_projects = any(s.name == "Projects" and s.exists for s in sections)
        if not has_projects:
            recommendations.append(
                Recommendation(
                    id="rec-add-projects",
                    priority="low",
                    title="Add technical projects section",
                    description="Including a dedicated Projects section strengthens technical validation.",
                    suggestion="Add 1-2 key technical projects detailing the architecture, tools used, and problem solved.",
                )
            )

        # 6. Low Priority: Keyword Matching if Job Description provided
        if job_description:
            kw_cat = next((c for c in score.breakdown if c.category == "Keywords"), None)
            if kw_cat and kw_cat.score < 14:
                recommendations.append(
                    Recommendation(
                        id="rec-job-match",
                        priority="medium",
                        title="Tailor keywords to target job description",
                        description="Several key terms from the provided job description were not found in your resume.",
                        suggestion="Incorporate key domain terms from the target job posting into your summary and experience bullet points.",
                    )
                )

        return recommendations
