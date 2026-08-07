from app.analyzers.section_analyzer import SectionAnalyzer

def test_section_analyzer_detection():
    sample_resume = """
    John Doe
    Email: john@example.com | Phone: 123-456-7890 | GitHub: github.com/johndoe
    
    SUMMARY
    Motivated software developer passionate about building web applications.
    
    WORK EXPERIENCE
    Senior Developer at Tech Corp (2020 - Present)
    - Developed microservices in Python and FastAPI.
    
    EDUCATION
    BSc in Computer Science (2016 - 2020)
    
    SKILLS
    Python, FastAPI, React, Docker, SQL
    
    PROJECTS
    ResumeIQ - Resume Analysis Tool
    """

    sections = SectionAnalyzer.analyze_sections(sample_resume)
    sec_dict = {s.name: s for s in sections}

    assert sec_dict["Contact Information"].exists is True
    assert sec_dict["Summary / Objective"].exists is True
    assert sec_dict["Experience"].exists is True
    assert sec_dict["Education"].exists is True
    assert sec_dict["Skills"].exists is True
    assert sec_dict["Projects"].exists is True
    assert sec_dict["Certifications"].exists is False
