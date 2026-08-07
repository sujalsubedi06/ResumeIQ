import re
from typing import Dict, List, Set
from app.schemas.analysis import SkillAnalysis, SkillCategory

SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Languages": [
        "Python", "JavaScript", "TypeScript", "C++", "C#", "Java", "Go", "Golang",
        "Rust", "PHP", "Ruby", "Swift", "Kotlin", "HTML", "CSS", "SQL", "Bash", "Shell",
    ],
    "Frameworks & Libraries": [
        "React", "Next.js", "Vue", "Angular", "FastAPI", "Django", "Flask", "Express",
        "Node.js", "Spring Boot", "Tailwind CSS", "Bootstrap", "Redux", "GraphQL", "REST API",
    ],
    "Cloud & DevOps": [
        "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Google Cloud", "CI/CD", "GitHub Actions",
        "Terraform", "Ansible", "Linux", "Nginx", "System Administration",
    ],
    "Databases": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "SQLite3", "Elasticsearch",
        "DynamoDB", "Firebase", "Cassandra",
    ],
    "Tools & Security": [
        "Git", "GitHub", "GitLab", "Jira", "Postman", "Nmap", "Wireshark", "Burp Suite",
        "Metasploit", "Security", "Penetration Testing", "OWASP", "Networking",
    ],
    "Engineering Concepts": [
        "Data Structures", "Algorithms", "Object-Oriented Programming", "OOP",
        "Microservices", "System Design", "Unit Testing", "TDD", "Agile", "Scrum",
    ],
}

COMMON_IMPORTANT_SKILLS: List[str] = [
    "Docker", "Git", "CI/CD", "Testing", "Linux", "REST API", "SQL", "Security",
]

class SkillsAnalyzer:
    @staticmethod
    def analyze_skills(text: str) -> SkillAnalysis:
        text_lower = text.lower()
        detected_set: Set[str] = set()
        categorized_list: List[SkillCategory] = []

        for category_name, skills_in_cat in SKILL_TAXONOMY.items():
            cat_detected: List[str] = []
            for skill in skills_in_cat:
                # Use word boundary matching for precise detection
                pattern = r"\b" + re.escape(skill.lower()) + r"\b"
                if re.search(pattern, text_lower):
                    cat_detected.append(skill)
                    detected_set.add(skill)

            if cat_detected:
                categorized_list.append(SkillCategory(category=category_name, skills=cat_detected))

        detected_list = sorted(list(detected_set))

        # Determine missing common skills
        missing_skills = [
            skill for skill in COMMON_IMPORTANT_SKILLS
            if not re.search(r"\b" + re.escape(skill.lower()) + r"\b", text_lower)
        ]

        return SkillAnalysis(
            detected=detected_list,
            missing=missing_skills,
            categories=categorized_list,
        )
