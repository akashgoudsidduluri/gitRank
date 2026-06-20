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
  FaUserFriends,
  FaCodeBranch,
  FaChartLine,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaLightbulb,
  FaArrowLeft,
  FaCloud,
  FaCloudRain
} from "react-icons/fa";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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

  const analyzeProfile = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/api/analyze/${username.trim()}`, {
        timeout: 20000
      });
      setProfile(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("GitHub User Not Found or network error. Please try again.");
      }
    } finally {
      setLoading(false);
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

      <div className="app-wrapper">
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
        {loading && <LoadingSkeleton />}

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
          <div className="glass-panel hero-section">
            <FaGithub size={100} className="hero-icon" />
            <h1>GitRank</h1>
            <p>Get your GitRank Score, repository insights, contribution analytics, streak tracking, and developer ranking in seconds.</p>

            <form onSubmit={analyzeProfile} className="search-container">
              <div className="search-bar-wrapper">
                <FaSearch className="search-icon-inline" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub Username"
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
                    <span className="example-score-badge">GitRank Score: 98</span>
                    <span className="example-tier-badge">Tier: Legend</span>
                  </div>
                </div>
              </div>
              <div className="example-stats">
                <div className="example-stat-item"><FaStar className="stat-icon" /> <span>214k Stars</span></div>
                <div className="example-stat-item"><FaCodeBranch className="stat-icon" /> <span>6 Repositories</span></div>
                <div className="example-stat-item"><FaChartLine className="stat-icon" /> <span>365 Days Streak</span></div>
                <div className="example-stat-item"><FaUsers className="stat-icon" /> <span>232k Followers</span></div>
              </div>
            </div>

            <ErrorBanner error={error} />
          </div>
        )}

        {/* Feature Preview Section Below the Fold */}
        {!loading && !profile && (
          <div className="feature-preview-section">
            <div className="credibility-strip">
              <span>Calculates 10+ GitHub Metrics</span> <span className="credibility-dot">•</span> 
              <span>Uses GitHub REST & GraphQL APIs</span> <span className="credibility-dot">•</span> 
              <span>Real-Time Profile Analysis</span>
            </div>
            <h2>What You'll Get</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper"><FaChartLine /></div>
                <h3>GitRank Score</h3>
                <p>Custom score based on repositories, stars, activity, and influence.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper"><FaCalendarAlt /></div>
                <h3>Contribution Analytics</h3>
                <p>Track streaks, consistency, and activity trends.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper"><FaStar /></div>
                <h3>Repository Insights</h3>
                <p>Analyze your most impactful projects and languages.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper"><FaUsers /></div>
                <h3>Developer Ranking</h3>
                <p>Compare your profile against other developers.</p>
              </div>
            </div>

            <div style={{ marginTop: '48px', marginBottom: '24px' }}>
              <a
                href="https://github.com/akashgoudsidduluri/gitRank"
                target="_blank"
                rel="noopener noreferrer"
                className="github-repo-link"
              >
                <FaStar className="star-icon" /> Star the Repo on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
