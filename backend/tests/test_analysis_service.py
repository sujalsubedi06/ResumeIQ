from app.schemas.parser import ParsedDocument, ResumeMetadata
from app.services.analysis_service import AnalysisService

def test_analysis_service_flow():
    sample_text = """
    Jane Doe
    Email: jane@example.com | Phone: 555-0199
    
    SUMMARY
    Senior Full Stack Engineer with 5+ years of experience.
    
    EXPERIENCE
    Lead Engineer at Acme Systems (2021 - Present)
    - Architected microservices platform reducing response times by 35%.
    - Managed a team of 6 engineers and deployed CI/CD pipelines.
    
    EDUCATION
    BSc Computer Science, State University
    
    SKILLS
    Python, FastAPI, TypeScript, React, Docker, PostgreSQL, Linux, Git, REST API
    """

    metadata = ResumeMetadata(
        fileName="jane_resume.pdf",
        fileType="pdf",
        pageCount=1,
        wordCount=150,
        fileSizeBytes=12000,
    )
    parsed_doc = ParsedDocument(text=sample_text, metadata=metadata)

    report = AnalysisService.analyze_document(parsed_doc)

    assert report.resume.fileName == "jane_resume.pdf"
    assert report.score.overall >= 70
    assert report.score.rating in ["good", "excellent"]
    assert len(report.sections) > 0
    assert len(report.skills.detected) >= 5
    assert report.experience.hasMetrics is True
    assert report.overviewStats.words == 150
