import { useState } from "react";
import axios from "axios";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";
// Ensure this file exists in src/tabs/ and is named exactly RepoExplorerTab.css
import "./RepoExplorerTab.css";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
function RepositoryExplorerTab({
  repositories,
  profile
}) {
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [contributors, setContributors] = useState({});
  const [loadingRepo, setLoadingRepo] = useState(null);

  // Enhanced safety check: handles null, non-arrays, and empty lists
  if (!repositories || !Array.isArray(repositories) || repositories.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No repositories found for this user.</p>
      </div>
    );
  }

  // Filter repositories based on search term
  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (repo.language && repo.language.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedRepos = [...filteredRepos];

  // Helper functions to handle possible field name variations from backend/GitHub API
  const getStars = (r) => r.stars ?? r.stargazers_count ?? 0;
  const getForks = (r) => r.forks ?? r.forks_count ?? 0;
  const getDate = (r) => new Date(r.createdAt ?? r.created_at ?? 0);
  const getUpdateDate = (r) => new Date(r.updatedAt ?? r.updated_at ?? 0);

  switch (sortBy) {
    case "stars":
      sortedRepos.sort((a, b) => getStars(b) - getStars(a));
      break;
    case "forks":
      sortedRepos.sort((a, b) => getForks(b) - getForks(a));
      break;
    case "oldest":
      sortedRepos.sort((a, b) => getDate(a) - getDate(b));
      break;
    case "az":
      sortedRepos.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;
    default:
      sortedRepos.sort((a, b) => getDate(b) - getDate(a));
  }

  const fetchContributors = async (owner, repo) => {
    const key = `${owner}/${repo}`;

    if (contributors[key] !== undefined) {
      setContributors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    try {
      setLoadingRepo(key);

      const response = await axios.get(
        `${API_URL}/api/repo-contributors/${owner}/${repo}`
      );


      setContributors(prev => ({
        ...prev,
        [key]: response.data
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRepo(null);
    }
  };

  return (
    <div className="repo-explorer">
      <div className="repo-toolbar glass-panel">
        <div className="repo-search-wrapper">
          <FaSearch className="repo-search-icon" />
          <input
            type="text"
            placeholder="Filter by name, description or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="repo-search-input"
          />
        </div>

        <div className="repo-sort-wrapper">
          <label className="repo-sort-label">
            <FaSortAmountDown /> Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="repo-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </div>

      {sortedRepos.length > 0 ? (
        <div className="repo-grid">
          {sortedRepos.map(repo => {
            const key = `${profile.username}/${repo.name}`;
            const isOpen = contributors[key];
            return (
              <div
                key={repo.name}
                className="repo-card glass-panel"
              >
                <h3>{repo.name}</h3>
                <div className="repo-meta">
                  Created {getDate(repo).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  {" • "}
                  Updated {getUpdateDate(repo).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <p className="repo-description">
                  {repo.description ||
                    "No description provided"}
                </p>
                <div className="repo-language">
                  ● {repo.language || "Unknown"}
                </div>
                <div className="repo-stats">
                  <div className="repo-stat">⭐ {getStars(repo)}</div>
                  <div className="repo-stat">🍴 {getForks(repo)}</div>
                </div>
                <a
                  className="repo-link"
                  href={repo.url || repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Repository ↗
                </a>

                <button
                  className="contributors-btn"
                  onClick={() => fetchContributors(profile.username, repo.name)}
                >
                  {isOpen ? "Hide Contributors ▲" : "Show Contributors ▼"}
                </button>

                {loadingRepo === `${profile.username}/${repo.name}` && (
                  <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>
                    Loading contributors...
                  </p>
                )}

                {contributors[`${profile.username}/${repo.name}`] && (
                  <div className="contributors-list">
                    {contributors[`${profile.username}/${repo.name}`].map(c => (
                      <a
                        key={c.username}
                        href={c.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="contributor-card"
                      >
                        <img
                          src={c.avatar}
                          alt={c.username}
                        />
                        <div className="contributor-info">
                          <strong>{c.username}</strong>
                          <p>
                            {c.contributions} contributions
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No repositories match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}

export default RepositoryExplorerTab;