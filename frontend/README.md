# ResumeIQ — Frontend

Next.js 16 (App Router) frontend for **ResumeIQ**, a free resume analysis
platform that scores resumes against modern ATS compatibility standards —
without storing any of your data.

## Tech Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4** with CSS-variable theming (dark/light, no flash on load)
- **framer-motion** for animations (respects `prefers-reduced-motion`)
- **lucide-react** icons
- **Vitest + Testing Library** for unit/integration tests

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend talks to the FastAPI backend at `/api/v1`. Configure the backend
URL with an env var (the app falls back to `http://localhost:8000/api/v1`):

```bash
NEXT_PUBLIC_API_URL=https://your-backend.example.com/api/v1
```

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Production build                     |
| `npm run start`   | Serve the production build           |
| `npm run lint`    | Run ESLint                           |
| `npm test`        | Run the Vitest suite (once)          |
| `npm run test:watch` | Run the Vitest suite in watch mode |

## Pages

- `/` — Landing page with feature highlights
- `/analyze` — Upload a resume (PDF/DOCX), get an ATS report
- `/docs` — Product documentation (slide-based sections)
- `/about` — About the project

## Structure

```
src/
├── app/          # Next.js App Router pages & global styles
├── components/   # Layout (Sidebar, Footer) & UI primitives
├── features/
│   └── analyze/  # Upload, pipeline, report & API client
└── lib/          # Theme, animations, shared API base URL, utils
```

See `../backend/README.md` for the API documentation.
