# GitRank

GitRank is a modern GitHub analytics platform that transforms raw GitHub profile data into meaningful developer insights.

Beyond basic GitHub statistics, GitRank evaluates repository impact, developer activity, account maturity, and profile quality to generate a custom GitRank Score along with actionable recommendations.

---

## Features

### GitHub Profile Analysis

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

---

## GitRank Score

GitRank calculates a custom developer score using:

* Followers
* Public Repositories
* Total Repository Stars
* Account Age

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

* Followers
* Following
* Public Repositories
* Total Stars
* Average Stars per Repository
* Account Age
* Most Starred Repository
* Developer Score
* Profile Archetype

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
│   ├── public/
│   └── package.json
│
└── README.md
```

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
GITHUB_TOKEN=your_github_personal_access_token
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
* Responsive Dashboard UI
* Theme Toggle
* Loading Skeletons
* Top Repository Spotlight
* Full Stack Integration

### In Progress

* Repository Insights
* Language Analysis
* Contribution Analytics
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
