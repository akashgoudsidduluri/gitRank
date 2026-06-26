import { useState, useEffect } from 'react'
import axios from "axios";
import DashboardTabs from "./components/DashboardTabs";
import ErrorBanner from "./components/ErrorBanner";
import LoadingSkeleton from "./components/LoadingSkeleton";
import OverviewTab from "./tabs/OverviewTab";
import WeatherEffect from "./components/WeatherEffect";
import RepoInsightsTab from "./tabs/RepoInsightsTab";
import RepositoryExplorerTab from "./tabs/RepoExplorerTab";
import ContributionAnalyticsTab from "./tabs/ContributionAnalyticsTab";
import {
  FaGithub,
  FaSearch,
  FaMoon,
  FaSun,
  FaStar,
  FaUsers,
  FaCodeBranch,
  FaChartLine,
  FaCalendarAlt,
  FaArrowLeft,
  FaCloud,
  FaCloudRain
} from "react-icons/fa";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Wake up backend early on mount
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    axios.get(`${API_URL}/health`).catch(() => {});
  }, []);

  // Weather state initialization
  const [weatherEnabled, setWeatherEnabled] = useState(() => {
    const saved = localStorage.getItem('gitrank-weather');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('gitrank-weather', weatherEnabled);
  }, [weatherEnabled]);
  // Theme setting initialization
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('gitrank-theme');
    if (savedTheme) return savedTheme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Apply theme class to root element on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gitrank-theme', theme);
  }, [theme]);

  const analyzeProfile = async (e, isRetry = false) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    let targetUsername = username.trim();

    // Support URL pasting
    if (targetUsername.includes('github.com/')) {
      const parts = targetUsername.split('github.com/');
      if (parts.length > 1) {
        targetUsername = parts[1].split('/')[0].split('?')[0];
      }
    } else {
      targetUsername = targetUsername.replace(/^[/\s]+|[/\s]+$/g, '');
    }

    setLoading(true);
    if (!isRetry) {
      setLoadingMessage("Analyzing GitHub Profile...");
      setError(null);
      setProfile(null);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/api/analyze/${targetUsername}`, {
        timeout: 25000
      });
      setProfile(response.data);
      setLoading(false);
      setLoadingMessage("");
    } catch (err) {
      console.error(err);
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout') || (err.response && err.response.status === 503)) {
        if (!isRetry) {
          // If first failure due to timeout, backend is likely waking up. Automatically retry once.
          setLoadingMessage("Backend is waking up. Please wait...");
          setTimeout(() => analyzeProfile(null, true), 3000);
          return;
        } else {
          setError("The server is still waking up or is currently unavailable. Please try again in a moment.");
        }
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("GitHub Profile Not Found or network error. Please verify the username and try again.");
      }
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const resetSearch = () => {
    setProfile(null);
    setUsername("");
    setError(null);
    setActiveTab("overview");
  };

  return (
    <>
      {/* Weather Effects (Snow/Rain) */}
      {weatherEnabled && <WeatherEffect theme={theme} />}

      {/* Background Blobs for Glassmorphism Depth */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <main className="app-wrapper">
        {/* Navigation Header */}
        <header className="app-header">
          <div className="logo-section" style={{ cursor: 'pointer' }} onClick={resetSearch}>
            <FaGithub className="logo-icon" size={28} />
            <span>GitRank</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setWeatherEnabled(!weatherEnabled)}
              className="theme-toggle-btn"
              aria-label="Toggle weather animation"
              title={weatherEnabled ? "Turn off weather animations" : "Turn on weather animations"}
            >
              {weatherEnabled ? <FaCloudRain /> : <FaCloud />}
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="theme-toggle-btn"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading && <LoadingSkeleton message={loadingMessage} />}

        {/* Dashboard Profile Report */}
        {!loading && profile && (
          <div className="profile-dashboard">
            {/* Back button */}
            <div>
              <button onClick={resetSearch} className="search-btn" style={{
                padding: '10px 18px',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                boxShadow: 'none'
              }}>
                <FaArrowLeft /> Analyze Another
              </button>
            </div>

            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {activeTab === "overview" && (
              <OverviewTab profile={profile} />
            )}

            {activeTab === "repoInsights" && (
              <RepoInsightsTab
                repoInsights={profile.repoInsights}
              />
            )}
            {activeTab === "repoExplorer" && (
              <RepositoryExplorerTab
                repositories={
                  profile.repositoryExplorer ||
                  profile.repoExplorer ||
                  profile.repositories ||
                  []
                }
                profile={profile}
              />
            )}
            {activeTab === "contributions" && (
              <ContributionAnalyticsTab
                profile={profile}
              />
            )}
          </div>
        )}

        {/* Home / Search Screen */}
        {!loading && !profile && (
          <section className="glass-panel hero-section">
            <FaGithub size={100} className="hero-icon" aria-hidden="true" />
            <h1>GitRank</h1>
            <p>Get your GitRank Score, repository insights, contribution analytics, streak tracking, and developer ranking in seconds.</p>

            <form onSubmit={analyzeProfile} className="search-container">
              <div className="search-bar-wrapper">
                <FaSearch className="search-icon-inline" aria-hidden="true" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="GitHub Username or URL"
                  aria-label="Enter GitHub Username or URL"
                  className="search-input"
                  required
                />
              </div>
              <button type="submit" className="search-btn" disabled={!username.trim()}>
                Analyze Profile
              </button>
            </form>

            <div className="example-report-card">
              <div className="example-header">
                <div className="example-avatar">LT</div>
                <div className="example-user-info">
                  <h3>torvalds</h3>
                  <div className="example-badges">
                    <span className="example-score-badge">GitRank Score: 99</span>
                    <span className="example-tier-badge">Tier: Legend</span>
                  </div>
                </div>
              </div>
              <div className="example-stats">
                <div className="example-stat-item"><FaStar className="stat-icon" aria-hidden="true" /> <span>214k Stars</span></div>
                <div className="example-stat-item"><FaCodeBranch className="stat-icon" aria-hidden="true" /> <span>6 Repositories</span></div>
                <div className="example-stat-item"><FaChartLine className="stat-icon" aria-hidden="true" /> <span>365 Days Streak</span></div>
                <div className="example-stat-item"><FaUsers className="stat-icon" aria-hidden="true" /> <span>232k Followers</span></div>
              </div>
            </div>

            <ErrorBanner error={error} />
          </section>
        )}

        {/* Feature Preview Section Below the Fold */}
        {!loading && !profile && (
          <section className="feature-preview-section">
            <div className="credibility-strip">
              <span>Calculates 10+ GitHub Metrics</span> <span className="credibility-dot">•</span>
              <span>Uses GitHub REST & GraphQL APIs</span> <span className="credibility-dot">•</span>
              <span>Real-Time Profile Analysis</span>
            </div>
            <h2>What You'll Get</h2>
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon-wrapper"><FaChartLine aria-hidden="true" /></div>
                <h3>GitRank Score</h3>
                <p>Custom score based on repositories, stars, activity, and influence.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon-wrapper"><FaCalendarAlt aria-hidden="true" /></div>
                <h3>Contribution Analytics</h3>
                <p>Track streaks, consistency, and activity trends.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon-wrapper"><FaStar aria-hidden="true" /></div>
                <h3>Repository Insights</h3>
                <p>Analyze your most impactful projects and languages.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon-wrapper"><FaUsers aria-hidden="true" /></div>
                <h3>Developer Ranking</h3>
                <p>Compare your profile against other developers.</p>
              </article>
            </div>

            {/* SEO Content Sections */}
            <div className="seo-content" style={{ marginTop: '60px', textAlign: 'left', maxWidth: '800px', margin: '60px auto 0', color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>What is GitRank?</h3>
                <p style={{ lineHeight: '1.6' }}>GitRank is an advanced GitHub profile analyzer that transforms your standard GitHub data into actionable insights, visual heatmaps, and an overarching Developer Score to help you understand your open-source impact.</p>
              </div>
              
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>How GitRank Works</h3>
                <p style={{ lineHeight: '1.6' }}>By leveraging the GitHub REST and GraphQL APIs, GitRank fetches real-time data on your commits, pull requests, issues, and repositories. We then analyze this data to generate beautiful charts, streak trackers, and a unique GitRank Score that reflects your activity and community influence.</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Why Use GitRank?</h3>
                <p style={{ lineHeight: '1.6' }}>Whether you're building your portfolio, comparing stats with peers, or just trying to maintain your coding streak, GitRank offers the most visually appealing and comprehensive breakdown of your GitHub profile.</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Frequently Asked Questions</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li><strong>Is GitRank free?</strong> Yes, GitRank is entirely free to use.</li>
                  <li><strong>Do I need to sign in?</strong> No authentication is required. Just enter a public GitHub username.</li>
                  <li><strong>How is the GitRank Score calculated?</strong> It's a proprietary blend of your total stars, forks, repository count, followers, and contribution consistency.</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '48px', marginBottom: '24px' }}>
              <a
                href="https://github.com/akashgoudsidduluri/gitRank"
                target="_blank"
                rel="noopener noreferrer"
                className="github-repo-link"
              >
                <FaStar className="star-icon" aria-hidden="true" /> Star the Repo on GitHub
              </a>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
