from typing import Optional
from app.analyzers.ats_analyzer import ATSAnalyzer
from app.analyzers.experience_analyzer import ExperienceAnalyzer
from app.analyzers.formatting_analyzer import FormattingAnalyzer
from app.analyzers.recommendation_engine import RecommendationEngine
from app.analyzers.section_analyzer import SectionAnalyzer
from app.analyzers.skills_analyzer import SkillsAnalyzer
from app.schemas.analysis import AnalysisReport, OverviewStats
from app.schemas.parser import ParsedDocument

class AnalysisService:
    @staticmethod
    def analyze_document(parsed_doc: ParsedDocument, job_description: Optional[str] = None) -> AnalysisReport:
        text = parsed_doc.text
        metadata = parsed_doc.metadata

        # 1. Section Analysis
        sections = SectionAnalyzer.analyze_sections(text)

        # 2. Skills Analysis
        skills = SkillsAnalyzer.analyze_skills(text)

        # 3. Experience Analysis
        experience = ExperienceAnalyzer.analyze_experience(text)

        # 4. Formatting Analysis
        formatting = FormattingAnalyzer.analyze_formatting(metadata, text)

        # 5. Overall ATS Score Calculation
        score = ATSAnalyzer.calculate_score(
            metadata=metadata,
            formatting_category=formatting,
            sections=sections,
            skills=skills,
            experience=experience,
            text=text,
            job_description=job_description,
        )

        # 6. Recommendation Generation
        recommendations = RecommendationEngine.generate_recommendations(
            sections=sections,
            skills=skills,
            experience=experience,
            score=score,
            job_description=job_description,
        )

        # 7. Executive Summary & Overview Stats
        detected_sections_count = sum(1 for s in sections if s.exists)
        stats = OverviewStats(
            pages=metadata.pageCount or 1,
            words=metadata.wordCount,
            sections=detected_sections_count,
            skillsFound=len(skills.detected),
        )

        summary_text = (
            f"Your resume demonstrates a strong technical foundation with {len(skills.detected)} detected skills "
            f"across {detected_sections_count} structured sections. "
            f"Overall ATS compatibility is rated as {score.rating.replace('_', ' ').title()} ({score.overall}/100)."
        )

        return AnalysisReport(
            resume=metadata,
            score=score,
            sections=sections,
            skills=skills,
            experience=experience,
            recommendations=recommendations,
            executiveSummary=summary_text,
            overviewStats=stats,
        )
