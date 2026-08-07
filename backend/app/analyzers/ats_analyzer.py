import re
from typing import List, Optional
from app.schemas.analysis import (
    ExperienceAnalysis,
    ScoreCategory,
    ScoreResult,
    SectionResult,
    SkillAnalysis,
)
from app.schemas.parser import ResumeMetadata

class ATSAnalyzer:
    @staticmethod
    def calculate_score(
        metadata: ResumeMetadata,
        formatting_category: ScoreCategory,
        sections: List[SectionResult],
        skills: SkillAnalysis,
        experience: ExperienceAnalysis,
        text: str,
        job_description: Optional[str] = None,
    ) -> ScoreResult:

        # 1. Formatting Score (max 20) - from formatting_category
        fmt_score = formatting_category.score

        # 2. Sections Score (max 20)
        # Required sections: Contact Info, Experience, Education, Skills
        required_sections = ["Contact Information", "Experience", "Education", "Skills"]
        found_required = sum(1 for s in sections if s.name in required_sections and s.exists)
        sec_score = int((found_required / len(required_sections)) * 20)
        sec_desc = f"{found_required}/{len(required_sections)} essential resume sections detected."

        sec_category = ScoreCategory(
            category="Sections",
            score=sec_score,
            maxScore=20,
            description=sec_desc,
        )

        # 3. Skills Score (max 20)
        # 10+ detected skills -> 20, 5-9 -> 15, 1-4 -> 10, 0 -> 0
        detected_count = len(skills.detected)
        if detected_count >= 10:
            skills_score = 20
        elif detected_count >= 5:
            skills_score = 15
        elif detected_count >= 1:
            skills_score = 10
        else:
            skills_score = 0

        skills_desc = f"{detected_count} technical and professional skills detected."
        skills_category = ScoreCategory(
            category="Skills",
            score=skills_score,
            maxScore=20,
            description=skills_desc,
        )

        # 4. Experience Score (max 20)
        # Combine action verb score (50% weight) + impact score (50% weight) scaled to 20
        exp_score = int(((experience.actionVerbScore * 0.5) + (experience.impactScore * 0.5)) * 0.2)
        exp_desc = experience.summary
        exp_category = ScoreCategory(
            category="Experience",
            score=exp_score,
            maxScore=20,
            description=exp_desc,
        )

        # 5. Keywords Score (max 20)
        if job_description and job_description.strip():
            # Match keywords from job description against resume text
            jd_words = set(re.findall(r"\b[a-zA-Z]{3,}\b", job_description.lower()))
            # filter out common English stop words
            stopwords = {"and", "the", "for", "with", "that", "this", "from", "your", "have", "are", "will", "our", "you", "all", "must", "with", "work"}
            target_keywords = jd_words - stopwords

            if target_keywords:
                matched = sum(1 for kw in target_keywords if re.search(r"\b" + re.escape(kw) + r"\b", text.lower()))
                match_ratio = matched / len(target_keywords)
                kw_score = int(match_ratio * 20)
                kw_desc = f"Matched {matched}/{len(target_keywords)} key terms from provided job description."
            else:
                kw_score = 14
                kw_desc = "Standard industry technical keyword density evaluated."
        else:
            # Baseline keyword score evaluated against detected skills and technical terms
            if detected_count >= 8:
                kw_score = 16
            elif detected_count >= 4:
                kw_score = 12
            else:
                kw_score = 8
            kw_desc = "Evaluated based on standard technical keyword and skill density."

        kw_category = ScoreCategory(
            category="Keywords",
            score=kw_score,
            maxScore=20,
            description=kw_desc,
        )

        breakdown = [
            formatting_category,
            sec_category,
            skills_category,
            exp_category,
            kw_category,
        ]

        overall_score = sum(cat.score for cat in breakdown)
        overall_score = max(0, min(100, overall_score))

        # Rating classification
        if overall_score >= 85:
            rating = "excellent"
        elif overall_score >= 70:
            rating = "good"
        elif overall_score >= 50:
            rating = "average"
        else:
            rating = "needs_improvement"

        return ScoreResult(
            overall=overall_score,
            rating=rating,
            breakdown=breakdown,
        )
