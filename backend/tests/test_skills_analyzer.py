from app.analyzers.skills_analyzer import SkillsAnalyzer

def test_skills_analyzer_detection():
    sample_text = "Proficient in Python, FastAPI, React, PostgreSQL, Docker, and Linux."
    analysis = SkillsAnalyzer.analyze_skills(sample_text)

    assert "Python" in analysis.detected
    assert "FastAPI" in analysis.detected
    assert "React" in analysis.detected
    assert "PostgreSQL" in analysis.detected
    assert "Docker" in analysis.detected
    assert "Linux" in analysis.detected
    assert len(analysis.categories) >= 3
