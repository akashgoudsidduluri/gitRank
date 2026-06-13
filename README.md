# GitRank

GitRank is a GitHub profile analysis platform that evaluates developers using public GitHub data and generates a custom DevScore.

The goal is to move beyond raw GitHub statistics and provide meaningful insights into a developer's profile, repository impact, and overall GitHub presence.

---

## Features

### Profile Analysis

Analyze any public GitHub user by username.

Example:

```http
GET /api/analyze/torvalds
```

Returns:

- Followers
- Following
- Public repositories
- Total stars
- Average stars per repository
- Account age
- Most starred repository
- DevScore
- Developer tier

---

## Current Metrics

GitRank currently evaluates:

- Followers
- Public repositories
- Total repository stars
- Average stars per repository
- Account age
- Highest starred repository

---

## DevScore

GitRank calculates a custom DevScore using:

- GitHub Followers
- Repository Stars
- Repository Count
- Account Age

Developer Tiers:

| Score | Tier |
|---------|---------|
| 0-19 | Beginner |
| 20-39 | Explorer |
| 40-59 | Builder |
| 60-79 | Advanced |
| 80-100 | Legend |

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Axios
- Dotenv

### Planned

- MySQL
- React
- Redis Cache (Optional)

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
│
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/akashgoudsidduluri/gitRank.git
```

Move into backend:

```bash
cd gitRank/backend
```

Install dependencies:

```bash
npm install
```

Create a .env file:

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
  "followers": 250000,
  "following": 0,
  "publicRepos": 8,
  "accountAgeYears": 14.2,
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

## Roadmap

### Phase 1 (Completed)

- [x] GitHub Profile API Integration
- [x] Repository Analysis
- [x] DevScore Calculation
- [x] Modular Backend Architecture

### Phase 2

- [ ] MySQL Integration
- [ ] Store Analyzed Profiles
- [ ] 24 Hour Analysis Cache
- [ ] Leaderboard APIs

### Phase 3

- [ ] React Frontend
- [ ] Global Developer Rankings
- [ ] Search History
- [ ] Modern Dashboard UI

### Phase 4

- [ ] AI Profile Review
- [ ] Resume Insights
- [ ] Career Recommendations
- [ ] Repository Quality Analysis

---

## Future Vision

GitRank aims to become a developer ranking and analysis platform that provides deeper insights than GitHub's default profile statistics.

---

## Author

Akash Goud Sidduluri

GitHub:
https://github.com/akashgoudsidduluri