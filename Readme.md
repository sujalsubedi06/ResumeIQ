# ResumeIQ

A privacy-first resume analysis tool that gives structured, actionable feedback instead of generic AI conversation.

---

## Overview

ResumeIQ evaluates a resume's structure, content, and alignment with a target job description, then presents the results as clear, structured feedback rather than a chat response. The workflow is intentionally narrow: upload a resume, optionally add a job description, review the analysis, and iterate.

## Why ResumeIQ

Most resume tools either act as AI chat assistants or rewrite content for you, which makes it hard to understand *why* a resume is scoring the way it is. ResumeIQ instead performs a structured evaluation — score, breakdown, sections, skills, gaps — so the feedback is transparent and something you can act on directly, rather than a conversation you have to interpret.

## Features

- Resume upload (PDF or DOCX)
- ATS-style resume evaluation with an overall score
- Detailed score breakdown (what helps and what hurts the score)
- Resume section analysis (Contact, Summary, Experience, Education, Skills, Projects, Certifications)
- Skill extraction from the uploaded document
- Job description comparison — matching skills, missing keywords, requirement coverage
- Improvement recommendations throughout the analysis
- Analysis progress indicators

> Note: Analysis reports are displayed on screen only — nothing is ever stored or downloadable server-side.

## How It Works

```
Upload Resume (PDF/DOCX)
        ↓
Optional Job Description
        ↓
Document Extraction & Analysis
        ↓
ATS Score + Breakdown
        ↓
Section / Skill Analysis + Job Matching
        ↓
Improvement Recommendations
```

## Privacy

Uploaded resumes are processed only for the duration of the analysis and are not retained as part of normal operation. No account is required to use the application.

## Security

- Uploads are size-capped **while being read** (10 MB), so oversized payloads are rejected without ever fully loading into memory.
- Only PDF and DOCX are accepted; file extension, MIME type, and content are all validated before parsing.
- Files are parsed strictly in-memory — nothing is written to disk.
- Internal parser/exception details are logged server-side and never echoed back to clients.
- API responses ship with hardening headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict `Referrer-Policy`, `Permissions-Policy`), and CORS credentials are disabled whenever origins are open.
- Dependencies are pinned against known vulnerabilities (e.g. `python-multipart >= 0.0.22`).

## Limitations

- Analysis is a decision-support tool, not a guarantee of hiring outcomes.
- Hiring decisions depend on many factors beyond resume quality — interviews, experience, communication, and employer-specific processes.
- Results are only as strong as the input: an up-to-date PDF or DOCX resume produces the most reliable analysis, and job description comparisons are only meaningful when a job description is provided.

## Project Status

Actively maintained. Development is currently focused on iterative improvements to analysis quality, usability, and overall user experience.

## License

MIT

## Author

**Sujal Subedi**
Cybersecurity Student • Software Developer

If you find ResumeIQ useful, consider giving the repository a ⭐.
