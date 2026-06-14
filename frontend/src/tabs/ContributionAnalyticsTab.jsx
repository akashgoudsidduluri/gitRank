import { 
  FaStar, 
  FaUsers, 
  FaCodeBranch, 
  FaCalendarAlt, 
  FaTrophy, 
  FaExternalLinkAlt, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaLightbulb,
  FaShieldAlt,
  FaAward
} from "react-icons/fa";

// Map strings to React Icons components for Achievements and Badges
const iconMap = {
  FaCodeBranch: <FaCodeBranch />,
  FaGitBranch: <FaCodeBranch />,
  FaStar: <FaStar />,
  FaExclamationCircle: <FaExclamationCircle />,
  FaCalendarAlt: <FaCalendarAlt />,
  FaShieldAlt: <FaShieldAlt />,
  FaAward: <FaAward />,
  FaUsers: <FaUsers />
};

// Donut Progress Gauges
const CircularProgress = ({ percent, label }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  
  return (
    <div className="donut-item">
      <div className="donut-svg-wrapper">
        <svg width="80" height="80" className="donut-svg">
          <circle cx="40" cy="40" r={radius} className="donut-bg-circle" />
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            className="donut-progress-circle"
            style={{ 
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset 
            }}
          />
        </svg>
        <div className="donut-center-text">{percent}%</div>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
};

// SVG Curve Chart for Contribution Velocity
const ContributionChart = ({ heatmap }) => {
  if (!heatmap || heatmap.length === 0) return null;
  
  // Group into 12 weekly data bins (last 84 days)
  const weeksData = [];
  const last84Days = heatmap.slice(-84);
  for (let i = 0; i < 12; i++) {
    const weekSlice = last84Days.slice(i * 7, (i + 1) * 7);
    const weekSum = weekSlice.reduce((sum, day) => sum + day.count, 0);
    weeksData.push(weekSum);
  }
  
  const width = 500;
  const height = 120;
  const padding = 15;
  
  const maxVal = Math.max(...weeksData, 5); // default max to avoid division by 0
  const points = weeksData.map((val, idx) => {
    const x = padding + (idx / 11) * (width - 2 * padding);
    const y = height - padding - (val / maxVal) * (height - 2 * padding);
    return { x, y, val };
  });
  
  // Generate Bezier path string
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p = points[i];
      const cpX1 = p0.x + (p.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p.x - p0.x) / 2;
      const cpY2 = p.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }
  }
  
  const areaD = pathD ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : "";
  
  return (
    <div className="glass-panel" style={{ marginTop: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Contribution Velocity</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
        Weekly contribution volume tracked over the last 12 weeks.
      </p>
      
      <div className="svg-chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
          <defs>
            <linearGradient id="chart-gradient-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="chart-grid-line" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} className="chart-grid-line" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="chart-grid-line" />
          
          {/* Area under curve */}
          {areaD && <path d={areaD} className="chart-area-path" />}
          
          {/* Main Curve */}
          {pathD && <path d={pathD} className="chart-line-path" />}
          
          {/* Interactivity dots */}
          {points.map((p, idx) => (
            <circle 
              key={idx} 
              cx={p.x} 
              cy={p.y} 
              className="chart-dot-point" 
              title={`Week ${idx + 1}: ${p.val} contributions`}
            />
          ))}
        </svg>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', padding: '0 8px' }}>
        <span>12 Weeks Ago</span>
        <span>Current Week</span>
      </div>
    </div>
  );
};

// Heatmap Grid (aligned to 53 weeks)
const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="glass-panel heatmap-container-outer">
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Contribution Heatmap</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Visualizing activity weight over the last 12 months (aligned in a 53-week layout).
      </p>
      
      <div className="heatmap-scroll-area">
        <div className="heatmap-grid">
          {data.map((day, idx) => {
            let level = 0;
            if (day.count > 0 && day.count <= 2) level = 1;
            else if (day.count > 2 && day.count <= 4) level = 2;
            else if (day.count > 4 && day.count <= 6) level = 3;
            else if (day.count > 6) level = 4;
            
            return (
              <div 
                key={idx} 
                className="heatmap-day"
                style={{ backgroundColor: `var(--heatmap-l${level})` }}
                title={`${day.date}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--heatmap-l0)' }}></div>
        <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--heatmap-l1)' }}></div>
        <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--heatmap-l2)' }}></div>
        <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--heatmap-l3)' }}></div>
        <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--heatmap-l4)' }}></div>
        <span>More</span>
      </div>
    </div>
  );
};

// Badges Widget
const BadgePanel = ({ badges }) => {
  if (!badges || badges.length === 0) return null;
  
  return (
    <div className="glass-panel" style={{ marginTop: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Custom GitRank Badges</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Special credentials unlocked based on your GitHub metrics, profile size, and codebase quality.
      </p>
      
      <div className="badges-container-list">
        {badges.map((badge, idx) => {
          const levelClass = `badge-level-${badge.level.toLowerCase()}`;
          return (
            <div key={idx} className="badge-item-card">
              <div className="badge-circle-ring" style={{ color: badge.color, borderColor: badge.color }}>
                {iconMap[badge.icon] || <FaAward />}
              </div>
              <span className="badge-label-name">{badge.label}</span>
              <span className={`badge-level-tag ${levelClass}`}>{badge.level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Export Component for Tab
function ContributionAnalyticsTab({ contributionStats }) {
  if (!contributionStats) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <FaExclamationCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
        <h3>No Contribution Data Available</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          This user profile does not contain extended analytics. Please re-run the search.
        </p>
      </div>
    );
  }

  const {
    totalCommits,
    totalPRs,
    totalIssues,
    prSuccessRate,
    issueCloseRate,
    peakActiveHours,
    heatmap,
    achievements,
    badges
  } = contributionStats;

  return (
    <div className="profile-dashboard" style={{ animation: 'fade-in 0.5s ease-out', gap: '0' }}>
      {/* 1. Heatmap Widget */}
      <Heatmap data={heatmap} />

      {/* 2. Core Stats Grid */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Contribution Statistics</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCodeBranch /></div>
            <div className="stat-info">
              <span className="stat-label">Total Commits</span>
              <span className="stat-value">{totalCommits}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCodeBranch /></div>
            <div className="stat-info">
              <span className="stat-label">Total PRs</span>
              <span className="stat-value">{totalPRs}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaExclamationCircle /></div>
            <div className="stat-info">
              <span className="stat-label">Total Issues</span>
              <span className="stat-value">{totalIssues}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCalendarAlt /></div>
            <div className="stat-info">
              <span className="stat-label">Peak Active Hours</span>
              <span className="stat-value" style={{ fontSize: '14px' }}>{peakActiveHours}</span>
            </div>
          </div>
        </div>

        {/* 3. Donut percentages */}
        <div className="donuts-wrapper">
          <CircularProgress percent={prSuccessRate} label="PR Merge Rate" />
          <CircularProgress percent={issueCloseRate} label="Issue Close Rate" />
        </div>
      </div>

      {/* 4. Curve Chart Widget */}
      <ContributionChart heatmap={heatmap} />

      {/* 5. Custom Metallic Badges Widget */}
      <BadgePanel badges={badges} />

      {/* 6. Achievements Progress Cards */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>GitHub Achievements</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Earn progress milestones for active open-source activity and repository engagement.
        </p>
        
        <div className="achievements-grid">
          {achievements.map((item) => (
            <div key={item.id} className={`achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon-wrapper">
                {iconMap[item.icon] || <FaAward />}
              </div>
              <div className="achievement-details">
                <span className="achievement-title-text">{item.title}</span>
                <span className="achievement-description-text">{item.description}</span>
                <div className="achievement-progress-container">
                  <div 
                    className="achievement-progress-slider" 
                    style={{ width: `${item.unlockProgress}%` }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600', alignSelf: 'flex-end' }}>
                  {item.unlockProgress}% Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContributionAnalyticsTab;
