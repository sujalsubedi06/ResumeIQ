from app.analyzers.experience_analyzer import ExperienceAnalyzer

def test_experience_analyzer_with_metrics():
    text = "Architected cloud microservices, reducing API response latency by 45% and serving 50k active users."
    result = ExperienceAnalyzer.analyze_experience(text)

    assert result.hasMetrics is True
    assert result.actionVerbScore > 0
    assert result.impactScore > 50

def test_experience_analyzer_without_metrics():
    text = "Responsible for writing code and attending team meetings daily."
    result = ExperienceAnalyzer.analyze_experience(text)

    assert result.hasMetrics is False
    assert result.impactScore <= 40
