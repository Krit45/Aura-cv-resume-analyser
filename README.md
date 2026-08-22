#  Aura CV

### AI-Powered Resume Analysis & Career Optimization Platform

<p align="center">
  <strong>Analyze. Improve. Stand Out.</strong>
</p>

<p align="center">
  Aura CV helps candidates understand the strengths and weaknesses of their resumes and make smarter improvements for modern hiring.
</p>

<p align="center">
  <a href="https://ai-resume-analyzer-906550809882.asia-southeast1.run.app/">🚀 Live Demo</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Krit45/Aura-cv-resume-analyser">💻 Source Code</a>
</p>

---

## 📌 Overview

**Aura CV** is an AI-powered resume analysis platform built to help job seekers create stronger, more relevant, and recruiter-ready resumes.

Instead of treating a resume as just a formatted document, Aura CV analyzes its content and provides intelligent feedback that helps candidates understand **what is working, what is missing, and what can be improved**.

The project combines a modern web interface with a server-side AI workflow to transform a traditional resume into actionable career insights.

---

## 🎯 The Problem

Recruiters and Applicant Tracking Systems process a large number of resumes, making resume quality and relevance increasingly important.

Candidates often struggle with:

* ❌ Identifying weaknesses in their resume
* ❌ Knowing whether their skills are presented effectively
* ❌ Writing impactful professional descriptions
* ❌ Understanding what recruiters may be looking for
* ❌ Optimizing their resume for a particular career path
* ❌ Getting meaningful feedback without professional assistance

### 💡 The Solution

Aura CV provides an intelligent analysis workflow that evaluates resume content and turns the results into **clear, actionable recommendations**.

---

# ✨ Key Features

### 📄 Resume Analysis

Upload a resume and analyze its content through an AI-powered workflow.

### 🧠 AI-Powered Feedback

Receive intelligent insights designed to help identify areas that can be improved.

### 📊 Resume Evaluation

Understand the overall quality and effectiveness of your resume through structured analysis.

### 🎯 Career Relevance

Analyze how effectively your resume communicates your skills, experience, projects, and professional profile.

### 💡 Actionable Recommendations

Get practical suggestions instead of generic resume advice.

### ⚡ Modern User Experience

A clean, responsive interface designed to make resume analysis simple and accessible.

### 🔐 Environment-Based Configuration

Sensitive configuration is separated from source code through environment variables using the project's `.env.example` setup.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │   Uploads Resume     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Aura CV UI       │
                         │ React + TypeScript   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Server Layer     │
                         │      server.ts       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    AI Processing     │
                         │   Resume Analysis    │
                         └──────────┬───────────┘
                                    │
                                    ▼
              ┌─────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
     ┌──────────────────┐                       ┌──────────────────┐
     │ Resume Insights  │                       │ Recommendations  │
     └──────────────────┘                       └──────────────────┘
              │                                           │
              └───────────────────┬───────────────────────┘
                                  ▼
                         ┌──────────────────────┐
                         │   Results Dashboard  │
                         └──────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer              | Technology            |
| ------------------ | --------------------- |
| Frontend           | React                 |
| Language           | TypeScript            |
| Build Tool         | Vite                  |
| Backend            | TypeScript / Server   |
| Package Management | npm / Bun             |
| Configuration      | Environment Variables |
| Version Control    | Git + GitHub          |
| Deployment         | Google Cloud Run      |

The repository currently contains dedicated `src`, `server`, and `data` directories along with TypeScript, Vite, npm/Bun configuration files.

---

# 📂 Project Structure

```text
Aura-cv-resume-analyser/
│
├── 📁 data/
│   └── Application data/resources
│
├── 📁 server/
│   └── Backend/server-side logic
│
├── 📁 src/
│   └── Frontend application
│
├── 📄 server.ts
├── 📄 index.html
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 bun.lock
├── 📄 tsconfig.json
├── 📄 vite.config.ts
├── 📄 .env.example
├── 📄 .gitignore
└── 📄 README.md
```

---

# 🔄 How It Works

```text
1. Upload Resume
       ↓
2. Resume Processing
       ↓
3. Content Extraction
       ↓
4. AI-Powered Analysis
       ↓
5. Resume Evaluation
       ↓
6. Personalized Insights
       ↓
7. Improvement Recommendations
```

The goal is to turn a static resume into a **data-driven improvement process**.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Git

## Clone the Repository

```bash
git clone https://github.com/Krit45/Aura-cv-resume-analyser.git
```

## Navigate to the Project

```bash
cd Aura-cv-resume-analyser
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create your local environment file using the provided example:

```bash
cp .env.example .env
```

Add the required configuration values to `.env`.

> ⚠️ Never commit API keys, credentials, or other secrets to GitHub.

## Run the Application

```bash
npm run dev
```

Open the local URL displayed by Vite.

---

# 🌐 Deployment

Aura CV is deployed using **Google Cloud Run**.

### Live Application

https://ai-resume-analyzer-906550809882.asia-southeast1.run.app/

The live application is also linked directly from the GitHub repository.

---

# 🎨 Product Vision

Aura CV is built around a simple idea:

> **A resume should not just describe a candidate — it should communicate their value clearly.**

The platform aims to bridge the gap between:

**Candidate → Resume → Recruiter → Opportunity**

By combining AI-powered analysis with an intuitive interface, Aura CV can help candidates make more informed decisions about their professional presentation.

---

# 🔮 Future Roadmap

### Resume Intelligence

* [ ] Advanced ATS compatibility scoring
* [ ] Resume keyword analysis
* [ ] Missing keyword detection
* [ ] Resume section quality analysis

### Job Matching

* [ ] Job description comparison
* [ ] Resume-to-job compatibility score
* [ ] Skill-gap detection
* [ ] Role-specific recommendations

### AI Assistance

* [ ] AI-generated professional summaries
* [ ] AI bullet-point enhancement
* [ ] Achievement rewriting
* [ ] Context-aware recommendations

### User Experience

* [ ] Resume templates
* [ ] Resume builder
* [ ] PDF export
* [ ] Resume version management
* [ ] User authentication
* [ ] Personal dashboard
* [ ] Resume improvement history

---

# 📈 Why Aura CV?

Traditional resume builders focus primarily on **design and formatting**.

Aura CV focuses on the **intelligence behind the resume**.

| Traditional Resume Builder | Aura CV                     |
| -------------------------- | --------------------------- |
| Formatting                 | Analysis                    |
| Templates                  | AI Insights                 |
| Manual editing             | Intelligent recommendations |
| Static document            | Interactive experience      |
| Design focused             | Career focused              |

---

# 🧪 Development

The repository currently has a focused project structure with frontend, server, data, and configuration layers. It has also progressed through multiple commits, indicating an iterative development workflow.

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git commit -m "Add your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 👨‍💻 Author

## Kritagya Gupta

**Full Stack Developer | AI/ML Enthusiast**

Building practical applications at the intersection of **Web Development, AI, and intelligent automation.**

### Connect

**GitHub:**
https://github.com/Krit45

---

# ⭐ Support

If you find **Aura CV** interesting or useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements

---

<p align="center">

### ✦ Aura CV

**Analyze your resume. Improve your story. Elevate your career.**

</p>
