# CurriculumCraft AI — CBSE & NCERT Assessment Engine

> Open-source pedagogical AI engine for Indian educators and academic coordinators (Grades 9–12). Built with ❤️ by [**Naitik**](https://na1t1k.vercel.app) for **Hacktoberfest 2026**.

**Status:** Public Beta &bull; Educational materials should be reviewed by subject matter experts prior to formal classroom administration.

---

## 🤖 Models & Architecture

CurriculumCraft AI operates strictly with **open-weight Gemma models** (Google Gen AI SDK). Zero Gemini models are used.

### Active Model Pipeline:
1. **Primary Priority:** `gemma-4-26b-a4b-it`
2. **Primary Alternate:** `gemma-4-31b-it`
3. **Secondary Fallback:** `gemma-2-27b-it`
4. **Secondary Alternate:** `gemma-2-9b-it`

Generation temperature is set to `0.2` with structured pedagogical prompts to enforce factual grounding and eliminate hallucinations.

---

## ⚖️ Legal Status & Copyright

### Are NCERT textbooks copyrighted?
**Yes.** Textbooks published by the National Council of Educational Research and Training (NCERT) are protected by copyright held by NCERT (Ministry of Education, Government of India).

### Why this project is 100% legal and copyright-free:
1. **No Verbatim Content Reproduction:** This application does **not** store, scan, distribute, or reproduce copyrighted NCERT textbook text, illustrations, or publisher question banks.
2. **Public Domain Syllabi:** Subject curricula, chapter lists, and examination blueprints are public educational standards issued by CBSE and the Ministry of Education under the National Education Policy (NEP 2020).
3. **Synthetic Question Generation:** Every question, passage, marking key, and lesson tracker is newly synthesized on demand by Gemma. The generated output is original, copyright-free academic material.
4. **Nominative Fair Use:** References to "CBSE" and "NCERT" are strictly for curriculum classification and syllabus alignment.

---

## 🔒 Security & Abuse Prevention

- **Server-Side Key Isolation:** All model interactions are routed through backend API endpoints (`/api/generate-assessment`, `/api/generate-lesson-plan`). The client browser never receives or transmits API secret keys.
- **Rate Limiting:** IP-based rate limiter restricts traffic to **30 requests per 5-hour window** per IP.
- **Search Engine Blocking:** Protected with `<meta name="robots" content="noindex, nofollow" />`.

---

## 🚀 Vercel Deployment

1. Push this repository to GitHub.
2. Import project into [Vercel](https://vercel.com/dashboard).
3. Add Environment Variable:
   - `GEMINI_API_KEY`: Your Google Gen AI API key (used exclusively to call Gemma models).
4. Click **Deploy**. Vercel automatically compiles the Vite frontend and deploys `/api/index.ts` as a serverless function via `vercel.json`.

---

## 📄 License

Licensed under the [MIT License](LICENSE).
Author: [Naitik](https://na1t1k.vercel.app) &bull; Built for Hacktoberfest 2026.
