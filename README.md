# CurriculumCraft AI — CBSE & NCERT Assessment & Lesson Architecture Engine

> A high-performance, open-source pedagogical AI SaaS engine designed for Indian educators, schools, and academic coordinators across Grades 9–12. Powered by Google Gemma 2 open-weight models.

Created with ❤️ by [**Naitik**](https://na1t1k.vercel.app).

---

## 🌟 Overview & Open-Source Classification

### Is this an Open-Source AI Project?
**Yes, CurriculumCraft AI is 100% an open-source AI project.**

**Why:**
1. **Open-Weight AI Foundation**: Powered by **Gemma 2** (`gemma-2-27b-it` / `gemma-2-9b-it`), Google's state-of-the-art open-weight model family. Gemma models are openly released under the permissive Gemma Terms of Use for research and commercial applications.
2. **Open-Source Codebase (MIT License)**: The entire codebase, components, parsers, and pedagogical schemas are licensed under the standard, permissive **MIT License**, permitting unrestricted modification, distribution, self-hosting, and commercial deployment.
3. **Public Educational Standards**: Built on rationalized public educational curricula from the Central Board of Secondary Education (CBSE) and National Council of Educational Research and Training (NCERT), complying with the National Education Policy (NEP 2020) and National Curriculum Framework (NCF-SE).
4. **Open-Source Technology Stack**: Built purely using open-source packages: React 19, TypeScript, Tailwind CSS v4, KaTeX, jsPDF, Lucide Icons, and Express.

---

## ⚖️ Legal, Safety & Copyright Compliance

- **Copyright-Free AI Generations**: All assessment questions, marking rubrics, exemplar solutions, and monthly instructional lesson plans are synthesized uniquely on-the-fly by Gemma 2. No questions are scraped or duplicated from copyrighted proprietary guidebooks or commercial publishers.
- **Fair Use & Public Domain Curriculum**: CBSE subject syllabi, unit lists, learning taxonomies, and question blueprints are published public curricular standards issued by the Ministry of Education / CBSE for public school assessment.
- **Zero API Key Exposure**: All communications with the Gemma AI API take place strictly server-side through protected endpoints. No client browser can access the API key.
- **Abuse Protection & Rate Limiting**: Built-in IP rate limiting limits traffic to **30 requests per 5-hour window**, preventing abuse, denial-of-service, and excessive token consumption.
- **Safe Content Generation**: Guided by structured pedagogical system prompts that enforce school-safe, age-appropriate, academic language strictly suitable for minors and K-12 classrooms.

---

## 🚀 One-Click Deployment to Vercel

CurriculumCraft AI is pre-configured for seamless deployment on **Vercel**:

### 1. Import Repository into Vercel
1. Push this project to your GitHub, GitLab, or Bitbucket account.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and select this repository.

### 2. Configure Environment Variables
In the **Environment Variables** section on Vercel, add:
- `GEMINI_API_KEY`: Your Google Gen AI / Gemini API key.

*(No other environment variables are required! `PORT` and serverless routing are handled automatically by `vercel.json`).*

### 3. Deploy
- Click **"Deploy"**. Vercel will:
  - Run `vite build` to compile the optimized production frontend into `dist/`.
  - Automatically bundle `/api/index.ts` with `@vercel/node` to power the serverless backend.
  - Route all `/api/*` calls (assessment generation, lesson plan generation, quota tracking) to the serverless function.

---

## 🛠️ Local Development & Alternative Deployment (Render, Docker, VPS)

CurriculumCraft AI also supports running as a standalone full-stack Node.js server:

```bash
# 1. Install dependencies
npm install

# 2. Configure your API key
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Start development server
npm run dev

# 4. Production build & start
npm run build
npm start
```

On platforms like **Render**, **Railway**, or **Fly.io**, the server automatically detects `process.env.PORT` and serves both the Express API and static assets from `dist/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Author: [Naitik](https://na1t1k.vercel.app)
