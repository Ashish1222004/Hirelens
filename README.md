# HireLens — AI Resume Analyzer

A portfolio-ready MERN-style resume analysis demo: React/Vite frontend and Express/Node.js API. Upload a PDF, DOCX, or TXT resume, paste a job description, and receive a match estimate, matched/missing skills, strengths, and improvement suggestions. Gemini AI is optional; without an API key, the app explicitly shows **demo mode** with a simple keyword match.

> **Honesty note:** This starter uses React + Node.js/Express; **MongoDB is not included**. It does **not** store accounts, resume history, or uploaded files. The estimated score is **not** an actual ATS score or hiring prediction. Do not represent these as implemented features.

## Requirements

- Node.js 20 or newer
- npm
- Optional: a Google Gemini API key

## Run locally

```bash
cd hirelens
npm install
npm run install:all
cp server/.env.example server/.env
npm run dev
```

Windows PowerShell: replace the `cp` command with `Copy-Item server/.env.example server/.env`.

Open **http://localhost:5173**. The backend runs at **http://localhost:5000**.

For real AI analysis, open `server/.env` and set:

```env
GEMINI_API_KEY=your_real_key_here
```

Restart the dev servers after editing `.env`. If the configured Gemini model is unavailable to your API key, change `GEMINI_MODEL` in `.env` to an available model.

## Demonstration in under one minute

1. Start the app (`npm run dev`).
2. Upload a text-based PDF resume, DOCX resume, or TXT resume (max 5 MB).
3. Click **Use sample job description** or paste a real JD.
4. Click **Analyze resume** and walk through the score, matched skills, gaps, and suggestions.
5. If you have no Gemini key, point out the yellow **Demo mode** notice.

## Push to GitHub

Create an **empty** repository on GitHub, then from the `hirelens` folder run:

```bash
git init
git add .
git commit -m "Initial HireLens resume analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hirelens.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Do **not** commit `server/.env` or API keys (`.gitignore` excludes `.env`).

## Project structure

```text
hirelens/
├── client/
│   ├── src/App.jsx
│   ├── src/styles.css
│   ├── src/main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── index.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Limitations

- PDFs containing only scanned images need OCR and are not supported.
- Demo mode detects a fixed set of common skills; the percentage is only the fraction of detected JD skills present in the resume.
- Gemini requests send extracted resume text and JD text to the configured AI API. Obtain consent before processing someone else's resume.
- Resumes are processed in memory and not saved by this application. External AI provider handling is governed by their terms.
- The development frontend proxy assumes the API is running locally on port 5000. Production hosting needs a configured API URL or reverse proxy.
