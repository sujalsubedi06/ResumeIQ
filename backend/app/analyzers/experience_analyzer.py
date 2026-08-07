import re
from app.schemas.analysis import ExperienceAnalysis

STRONG_ACTION_VERBS = {
    "built", "developed", "architected", "designed", "implemented", "scaled",
    "reduced", "increased", "improved", "automated", "engineered", "optimized",
    "created", "launched", "orchestrated", "spearheaded", "managed", "deployed",
    "integrated", "refactored", "migrated", "configured", "analyzed", "established",
}

# Regex for detecting metrics: percentages (40%), dollar amounts ($10k), multipliers (2x), numbers (1000+)
METRIC_REGEX = r"(\b\d+(\.\d+)?%\b|\$\d+[\d,]*[kKmMbB]?|\b\d+[xX]\b|\b\d{2,}\+?\b)"

class ExperienceAnalyzer:
    @staticmethod
    def analyze_experience(text: str) -> ExperienceAnalysis:
        text_lower = text.lower()

        # Detect quantified metrics
        metric_matches = re.findall(METRIC_REGEX, text)
        has_metrics = len(metric_matches) > 0
        metrics_count = len(metric_matches)

        # Detect action verbs
        words = re.findall(r"\b[a-z]+\b", text_lower)
        found_verbs = [w for w in words if w in STRONG_ACTION_VERBS]
        unique_verbs = set(found_verbs)

        # Calculate Action Verb Score (up to 100)
        # 5+ unique strong verbs yields maximum score
        action_verb_score = min(100, int((len(unique_verbs) / 5) * 100))

        # Calculate Impact Score (up to 100) based on metric density
        if metrics_count == 0:
            impact_score = 40
        elif metrics_count < 3:
            impact_score = 70
        elif metrics_count < 6:
            impact_score = 85
        else:
            impact_score = 100

        # Construct summary
        if has_metrics and action_verb_score >= 80:
            summary = "Experience section demonstrates strong impact with quantified achievements and active action verbs."
        elif has_metrics:
            summary = "Experience contains measurable metrics, but would benefit from a broader variety of strong action verbs."
        elif action_verb_score >= 80:
            summary = "Experience is well-written with active verbs, but lacks measurable outcomes and quantified metrics."
        else:
            summary = "Experience section needs stronger action verbs and quantified achievements to demonstrate measurable impact."

        return ExperienceAnalysis(
            hasMetrics=has_metrics,
            actionVerbScore=action_verb_score,
            impactScore=impact_score,
            summary=summary,
        )
