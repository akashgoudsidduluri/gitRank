# GitRank

GitRank is a GitHub profile analysis platform that evaluates GitHub profiles using public GitHub data and generates a custom GitRank Score.

The goal is to move beyond raw GitHub statistics and provide meaningful insights into a developer's GitHub presence, repository impact, and open-source footprint.

---

## Features

### Profile Analysis

Analyze any public GitHub user by username.

Example:

```http
GET /api/analyze/torvalds
```

Returns:

* Followers
* Following
* Public repositories
* Total stars
* Average stars per repository
* Account age
* Most starred repository
* GitRank Score
* Profile Tier

---

## Current Metrics

GitRank currently evaluates:

* Followers
* Public repositories
* Total repository stars
* Average stars per repository
* Account age
* Highest starred repository

---

## GitRank Score

GitRank calculates a custom score using:

* GitHub Followers
* Repository Stars
* Repository Count
* Account Age

Profile Tiers:

| Score  | Tier     |
| ------ | -------- |
| 0-19   | Beginner |
| 20-39  | Explorer |
| 40-59  | Builder  |
| 60-79  | Advanced |
| 80-100 | Legend   |

> Note: GitRank Score measures GitHub presence and repository impact, not overall software engineering skill.

---

## Tech Stack

### Frontend

* React
* Axios

### Backend

* Node.js
* Express.js
* Axios
* Dotenv
* CORS

### Future

* SQLite / MySQL
* Caching Layer
* AI Profile Analysis

---

## Project Structure

```text
gitRank/
│
├── backend/
│   │
│   ├── controllers/
│   │   └── profileController.js
│   │
│   ├── routes/
│   │   └── profileRoutes.js
│   │
│   ├── services/
│   │   ├── githubService.js
│   │   └── scoringService.js
│   │
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   │
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
```

---

### Backend Setup

```bash
cd gitRank/backend

npm install
```

Create a `.env` file:

```env
PORT=5000
```

Run development server:

```bash
npm run dev
```

Run production server:

```bash
npm start
```

Backend runs at:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd ../frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Endpoints

### Analyze GitHub Profile

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
  "topRepoUrl": "https://github.com/torvalds/linux",
  "topRepoStars": 210000,
  "devScore": 98,
  "tier": "Legend"
}
```

---

## Screenshots

Coming Soon

---

## Roadmap

### Phase 1 (Completed)

* [x] GitHub Profile API Integration
* [x] Repository Analysis
* [x] GitRank Score Calculation
* [x] Modular Backend Architecture
* [x] React Frontend
* [x] Live Profile Search
* [x] Full-Stack Integration

### Phase 2

* [ ] Improved Profile Analysis
* [ ] Better UI Components
* [ ] Developer Insights
* [ ] Language Analysis

### Phase 3

* [ ] Analysis Cache
* [ ] SQLite / MySQL Integration
* [ ] Global Leaderboards
* [ ] Search History

### Phase 4

* [ ] AI Profile Review
* [ ] Repository Quality Analysis
* [ ] Open Source Contribution Insights
* [ ] Career Recommendations

---

## Future Vision

GitRank aims to become a GitHub profile analysis platform that helps developers understand their GitHub presence, repository impact, and overall open-source footprint.

---

## Author

Akash Goud Sidduluri

GitHub:
https://github.com/akashgoudsidduluri
