import re
from typing import List
from app.schemas.analysis import SectionResult

STANDARD_SECTIONS = [
    {
        "name": "Contact Information",
        "keywords": [r"\bemail\b", r"\bphone\b", r"\blinkedin\b", r"\bgithub\b", r"@", r"\baddress\b", r"\blocation\b"],
        "required": True,
    },
    {
        "name": "Summary / Objective",
        "keywords": [r"\bsummary\b", r"\bobjective\b", r"\bprofile\b", r"\babout me\b", r"\bprofessional summary\b"],
        "required": False,
    },
    {
        "name": "Experience",
        "keywords": [r"\bexperience\b", r"\bwork history\b", r"\bemployment\b", r"\bprofessional experience\b", r"\bwork experience\b"],
        "required": True,
    },
    {
        "name": "Education",
        "keywords": [r"\beducation\b", r"\bacademic\b", r"\buniversity\b", r"\bcollege\b", r"\bdegree\b", r"\bbachelor\b", r"\bmaster\b"],
        "required": True,
    },
    {
        "name": "Skills",
        "keywords": [r"\bskills\b", r"\btechnical skills\b", r"\bcompetencies\b", r"\btechnologies\b", r"\bexpertise\b"],
        "required": True,
    },
    {
        "name": "Projects",
        "keywords": [r"\bprojects\b", r"\bkey projects\b", r"\bpersonal projects\b", r"\bportfolio\b"],
        "required": False,
    },
    {
        "name": "Certifications",
        "keywords": [r"\bcertifications\b", r"\bcertificates\b", r"\blicenses\b", r"\btraining\b", r"\bcertified\b"],
        "required": False,
    },
]

class SectionAnalyzer:
    @staticmethod
    def analyze_sections(text: str) -> List[SectionResult]:
        text_lower = text.lower()
        results: List[SectionResult] = []

        for sec in STANDARD_SECTIONS:
            sec_name = sec["name"]
            keywords = sec["keywords"]
            matches = [kw for kw in keywords if re.search(kw, text_lower)]

            exists = len(matches) > 0
            quality = "missing"

            if exists:
                # Assess quality based on keyword strength & context depth
                if len(matches) >= 2 or sec_name in ["Experience", "Skills", "Education"]:
                    quality = "strong" if len(matches) >= 2 else "acceptable"
                else:
                    quality = "acceptable"
            else:
                quality = "missing"

            results.append(
                SectionResult(
                    name=sec_name,
                    exists=exists,
                    quality=quality,
                )
            )

        return results
