import { useState, useEffect } from 'react'
import axios from "axios";
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
  FaTrophy, 
  FaExternalLinkAlt, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaLightbulb, 
  FaArrowLeft 
} from "react-icons/fa";

const WeatherEffect = ({ theme }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const count = theme === 'dark' ? 30 : 65;
    const newElements = Array.from({ length: count }).map((_, index) => {
      const left = Math.random() * 100;
      const delay = Math.random() * -15;
      const duration = theme === 'dark' 
        ? 6 + Math.random() * 10 
        : 0.7 + Math.random() * 0.8;
      const size = theme === 'dark'
        ? 3 + Math.random() * 6 
        : 1.5 + Math.random() * 1.5;
      const height = theme === 'light' ? 22 + Math.random() * 20 : size;
      const opacity = theme === 'dark'
        ? 0.15 + Math.random() * 0.4
        : 0.45 + Math.random() * 0.4;
      
      return {
        id: index,
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        size: `${size}px`,
        height: `${height}px`,
        opacity
      };
    });
    setElements(newElements);
  }, [theme]);

  if (theme === 'dark') {
    return (
      <div className="weather-overlay" aria-hidden="true">
        {elements.map(el => (
          <span
            key={el.id}
            className="snowflake"
            style={{
              left: el.left,
              animationDelay: el.delay,
              animationDuration: el.duration,
              width: el.size,
              height: el.size,
              opacity: el.opacity
            }}
          />
        ))}
      </div>
    );
  } else {
    return (
      <div className="weather-overlay" aria-hidden="true">
        {elements.map(el => (
          <span
            key={el.id}
            className="raindrop"
            style={{
              left: el.left,
              animationDelay: el.delay,
              animationDuration: el.duration,
              width: el.size,
              height: el.height,
              opacity: el.opacity
            }}
          />
        ))}
      </div>
    );
  }
};

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      const response = await axios.get(`http://localhost:5000/api/analyze/${username.trim()}`);
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
  };

  return (
    <>
      {/* Weather Effects (Snow/Rain) */}
      <WeatherEffect theme={theme} />

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
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="glass-panel loading-skeleton">
            <div className="skeleton-item skeleton-header"></div>
            <div className="skeleton-grid">
              <div className="skeleton-item skeleton-card"></div>
              <div className="skeleton-item skeleton-card"></div>
              <div className="skeleton-item skeleton-card"></div>
              <div className="skeleton-item skeleton-card"></div>
              <div className="skeleton-item skeleton-card"></div>
              <div className="skeleton-item skeleton-card"></div>
            </div>
            <div className="skeleton-item skeleton-body" style={{ height: '120px' }}></div>
            <div className="skeleton-item skeleton-body" style={{ height: '180px' }}></div>
          </div>
        )}

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

            {/* Profile Header Glass Card */}
            <div className="glass-panel profile-header-card">
              <div className="user-info-group">
                <div className="user-avatar-wrapper">
                  <img src={profile.avatar} alt={profile.username} className="user-avatar" />
                </div>
                <div className="user-meta-details">
                  <h2 className="user-username">
                    {profile.username}
                    {profile.archetype && (
                      <span className="archetype-badge">{profile.archetype}</span>
                    )}
                  </h2>
                  <div className="user-subtext">
                    <FaCalendarAlt /> Member for {profile.accountAgeYears} {profile.accountAgeYears === 1 ? 'year' : 'years'}
                  </div>
                </div>
              </div>

              <div className="score-badge-container">
                <div className="score-text-block">
                  <div className="score-label">Dev Score</div>
                  <div className="score-value">{profile.devScore}/100</div>
                </div>
                <div className="score-gauge-ring">
                  <FaTrophy size={28} className="logo-icon" style={{
                    color: profile.devScore >= 75 ? 'var(--strength-color)' : (profile.devScore >= 45 ? 'var(--weakness-color)' : 'var(--text-muted)')
                  }} />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaStar />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Stars</div>
                  <div className="stat-value">{profile.totalStars}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Followers</div>
                  <div className="stat-value">{profile.followers}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaUserFriends />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Following</div>
                  <div className="stat-value">{profile.following}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaCodeBranch />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Public Repos</div>
                  <div className="stat-value">{profile.publicRepos}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaChartLine />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Avg Stars / Repo</div>
                  <div className="stat-value">{profile.averageStarsPerRepo}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FaCalendarAlt />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Account Age</div>
                  <div className="stat-value">{profile.accountAgeYears} Years</div>
                </div>
              </div>
            </div>

            {/* Spotlight Top Repo */}
            {profile.topRepo && (
              <div className="glass-panel spotlight-repo-card">
                <div className="spotlight-title-group">
                  <span className="spotlight-badge">Top Project Spotlight</span>
                  <span className="repo-stars-count">
                    <FaStar className="repo-star-icon" /> {profile.topRepoStars} Stars
                  </span>
                </div>
                <a href={profile.topRepoUrl || "#"} target="_blank" rel="noopener noreferrer" className="repo-link-element">
                  {profile.topRepo} <FaExternalLinkAlt size={14} />
                </a>
                <p style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  This repository has generated the highest level of community stars and serves as a core highlight.
                </p>
              </div>
            )}

            {/* Insights Section */}
            <div className="insights-container">
              {/* Strengths */}
              <div className="insights-box">
                <h3 className="insights-box-title strengths-title">
                  <FaCheckCircle className="icon-strength" /> Profile Strengths
                </h3>
                <ul className="insights-list">
                  {profile.strengths && profile.strengths.length > 0 ? (
                    profile.strengths.map((item, idx) => (
                      <li key={idx} className="insights-item insights-item-strength">
                        <FaCheckCircle className="insights-item-icon icon-strength" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No specific strengths highlighted yet.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="insights-box">
                <h3 className="insights-box-title weaknesses-title">
                  <FaExclamationCircle className="icon-weakness" /> Profile Weaknesses
                </h3>
                <ul className="insights-list">
                  {profile.weaknesses && profile.weaknesses.length > 0 ? (
                    profile.weaknesses.map((item, idx) => (
                      <li key={idx} className="insights-item insights-item-weakness">
                        <FaExclamationCircle className="insights-item-icon icon-weakness" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Excellent profile! No critical weaknesses found.</li>
                  )}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="insights-box" style={{ gridColumn: '1 / -1' }}>
                <h3 className="insights-box-title recommendations-title">
                  <FaLightbulb className="icon-recommendation" /> Actionable Recommendations
                </h3>
                <ul className="insights-list">
                  {profile.recommendations && profile.recommendations.length > 0 ? (
                    profile.recommendations.map((item, idx) => (
                      <li key={idx} className="insights-item insights-item-recommendation">
                        <FaLightbulb className="insights-item-icon icon-recommendation" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Keep maintaining this great profile!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Home / Search Screen */}
        {!loading && !profile && (
          <div className="glass-panel hero-section">
            <FaGithub size={100} className="hero-icon" />
            <h1>GitRank</h1>
            <p>Analyze your GitHub profile, calculate your Developer Score, and unlock personalized growth metrics with glassmorphic insights.</p>
            
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

            {error && (
              <div className="error-banner">
                <FaExclamationCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
