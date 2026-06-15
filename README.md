# 🚀 GitRank


[![GitHub stars](https://img.shields.io/github/stars/akashgoudsidduluri/gitRank)](https://github.com/akashgoudsidduluri/gitRank/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/akashgoudsidduluri/gitRank)](https://github.com/akashgoudsidduluri/gitRank/issues)
[![React](https://img.shields.io/badge/Frontend-React-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/akashgoudsidduluri/gitRank/blob/main/LICENSE)

**GitRank** is a modern GitHub analytics platform that transforms raw GitHub profile data into meaningful, actionable developer insights.

Beyond basic GitHub statistics, GitRank evaluates repository impact, developer activity, account maturity, and profile quality to generate a custom GitRank Score along with actionable recommendations.

---

## 🌐 Live Demo

Coming Soon

---

## 💡 Why GitRank?

GitHub profiles expose large amounts of raw data but provide limited insight into what that data actually means.

GitRank transforms repository statistics, developer activity, and profile metrics into actionable insights, helping developers better understand their open-source footprint and identify areas for growth.

---

## ✨ Features

### 🔍 GitHub Profile Analysis

Analyze any public GitHub profile instantly.

Example:

```http
GET /api/analyze/torvalds
```

### Analytics Dashboard

GitRank provides:

* Followers & Following
* Public Repository Count
* Total Stars Earned
* Average Stars Per Repository
* Account Age
* Top Repository
* GitRank Score
* Developer Archetype

### Contribution Analytics

• Real GitHub Contribution Heatmap
• Contribution Breakdown Charts
• Current & Longest Contribution Streaks
• Peak Contribution Day
• Monthly Activity Trends
• Active Days Analysis
• Contribution Statistics
• GitRank Tier Classification

### Repository Insights

GitRank provides deeper repository-level analytics:

* Most Used Programming Language
* Language Breakdown Analysis
* Original Repository Count
* Repositories With Stars
* Repositories Without Stars
* Average Forks Per Repository
* Most Forked Repository
* Newest Repository
* Oldest Repository

### 📂 Repository Explorer

A dedicated space to browse through the user's codebase:

* **Live Search**: Filter repositories by name, description, or language.
* **Dynamic Sorting**: Sort by stars, forks, age, or alphabetical order.
* **On-Demand Contributors**: Fetch the top 3 contributors for any repository with a single click.
* **Responsive Grid**: Glassmorphic cards that adapt to all screen sizes.

### Achievements & Badges

GitRank rewards activity through unlockable achievements and reputation badges.

Achievements:
• Commit Crusader
• PR Pioneer
• Issue Hunter
• Code Reviewer
• Repo Builder
• Star Magnet
• Open Source Veteran

Badges:
• GitRank Explorer
• Open Source Explorer
• Maintainer Material

### Smart Developer Analysis

GitRank generates:

* Profile Strengths
* Profile Weaknesses
* Personalized Recommendations
* Developer Archetype Classification

### Modern Dashboard UI

* Glassmorphism Design System
* Dark / Light Theme Toggle
* Theme Persistence
* Responsive Layout
* Skeleton Loading States
* Repository Spotlight Cards
* Interactive Statistics Dashboard
* Multi-Tab Dashboard
* Repository Insights Tab
* Component-Based Architecture

---

* Overview
* Repository Insights
* Repository Explorer
* Contributions

---

## GitRank Score

GitRank calculates a custom developer score using:

• Contribution Activity
• Repository Impact (Stars)
• Community Reach (Followers)
• Repository Portfolio
• Account Age

### Score Tiers

| Score    | Tier     |
| -------- | -------- |
| 0 - 19   | Beginner |
| 20 - 39  | Explorer |
| 40 - 59  | Builder  |
| 60 - 79  | Advanced |
| 80 - 100 | Legend   |

> GitRank Score reflects GitHub profile impact and open-source visibility. It is not a direct measure of software engineering ability.

---

## Current Metrics

GitRank currently evaluates:

### Profile Metrics

* Followers
* Following
* Public Repositories
* Total Stars
* Average Stars Per Repository
* Account Age
* Most Starred Repository
* GitRank Score
* Developer Archetype

### Contribution Metrics

• Total Contributions
• Commit Contributions
• Pull Request Contributions
• Issue Contributions
• Code Reviews
• Contribution Heatmap
• Current Streak
• Longest Streak
• Peak Contribution Day
• Active Days
• Monthly Contribution Trends

### Repository Insights

* Most Used Language
* Language Distribution
* Original Repository Count
* Repositories With Stars
* Repositories Without Stars
* Average Forks Per Repository
* Most Forked Repository
* Newest Repository
* Oldest Repository

---

## Tech Stack

### Frontend

* React
* Axios
* React Icons
* Modern CSS (Glassmorphism UI)

### Backend

* Node.js
* Express.js
* Axios
* Dotenv
* CORS

### APIs

* GitHub REST API

---

## Project Structure

```text
gitRank/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── tabs/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🖼️ Screenshots

### Home Screen

Coming Soon

### Analytics Dashboard

Coming Soon

### Repository Insights

Coming Soon

---

## Installation

### Clone Repository

```bash
git clone https://github.com/akashgoudsidduluri/gitRank.git
cd gitRank
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
```

Start development server:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend runs at:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Endpoint

### Analyze Profile

```http
GET /api/analyze/:username
```

Example:

```http
GET /api/analyze/torvalds
```

---

## Sample Response

```json
{
  "username": "torvalds",
  "followers": 307000,
  "following": 0,
  "publicRepos": 8,
  "accountAgeYears": 14.8,
  "totalStars": 210000,
  "averageStarsPerRepo": 26250,
  "topRepo": "linux",
  "topRepoStars": 210000,
  "devScore": 98,
  "archetype": "Legend",
  "repoInsights": {
    "mostUsedLanguage": "JavaScript",
    "languageBreakdown": [],
    "reposWithStars": 4,
    "reposWithoutStars": 23,
    "averageForksPerRepo": 0.04
  },
  "repositoryExplorer": [
    {
      "name": "linux",
      "stars": 210000,
      "forks": 50000,
      "language": "C"
    }
  ],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
```

---

## Roadmap

### Completed

* GitHub Profile Analysis
* Repository Analytics
* GitRank Score Engine
* Smart Developer Analysis
* Archetype Classification
* Repository Insights
* Language Analysis
* Responsive Dashboard UI
* Theme Toggle
* Multi-Tab Dashboard (Overview, Repository Insights, Repository Explorer, Contributions)
* Loading Skeletons
* Top Repository Spotlight
* Full Stack Integration
* Component-Based Frontend Architecture
* Contribution Analytics (Heatmap, commit/PR/issue/review counts)
* Unlockable Achievements & Badges
* Profile Completion Progress Tracker

### In Progress

* Developer Comparison

### Planned

* PDF Export
* Search History
* Global Leaderboards
* Database Integration
* AI Career Insights
* Repository Quality Analysis
* Open Source Contribution Analytics


---

## Future Vision

GitRank aims to become a complete developer intelligence platform that helps developers understand, benchmark, and improve their GitHub presence through analytics, insights, and AI-powered recommendations.

---

## Author

Akash Goud Sidduluri

GitHub:
https://github.com/akashgoudsidduluri
