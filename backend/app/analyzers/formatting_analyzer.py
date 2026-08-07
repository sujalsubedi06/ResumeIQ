from app.schemas.analysis import ScoreCategory
from app.schemas.parser import ResumeMetadata

class FormattingAnalyzer:
    @staticmethod
    def analyze_formatting(metadata: ResumeMetadata, text: str) -> ScoreCategory:
        score = 20
        reasons = []

        # Word count check
        word_count = metadata.wordCount
        if word_count < 200:
            score -= 6
            reasons.append("Resume length is very short (under 200 words).")
        elif word_count > 1500:
            score -= 4
            reasons.append("Resume is lengthy (over 1500 words).")

        # Page count check (if PDF)
        if metadata.pageCount and metadata.pageCount > 3:
            score -= 4
            reasons.append(f"Resume spans {metadata.pageCount} pages, which may exceed standard 1-2 page recommendations.")

        # Text structure check
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        if len(lines) < 15:
            score -= 4
            reasons.append("Document structure lacks clear line breaks or distinct sections.")

        final_score = max(0, min(20, score))
        desc = " ".join(reasons) if reasons else "Document structure and length comply with standard ATS formatting requirements."

        return ScoreCategory(
            category="Formatting",
            score=final_score,
            maxScore=20,
            description=desc,
        )
