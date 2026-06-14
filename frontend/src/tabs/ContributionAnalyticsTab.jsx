import { 
  FaStar, 
  FaCodeBranch, 
  FaTrophy, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCode
} from "react-icons/fa";

// Map strings to React Icons components for Achievements and Badges

// Heatmap Grid (aligned to 53 weeks)
const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return null;
  const allDays = data.flatMap(week => week.contributionDays);
  
  return (
    <div className="glass-panel heatmap-container-outer">
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Contribution Heatmap</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Real-time GitHub contribution activity over the last 12 months.
      </p>
      
      <div className="heatmap-scroll-area">
        <div className="heatmap-grid">
          {allDays.map((day, idx) => {
            let level = 0;
            const count = day.contributionCount;
            if (count > 0 && count <= 2) level = 1;
            else if (count > 2 && count <= 4) level = 2;
            else if (count > 4 && count <= 6) level = 3;
            else if (count > 6) level = 4;
            
            return (
              <div 
                key={idx} 
                className="heatmap-day"
                style={{ backgroundColor: `var(--heatmap-l${level})` }}
                title={`${day.date}: ${count} ${count === 1 ? 'contribution' : 'contributions'}`}
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

// Main Export Component for Tab
function ContributionAnalyticsTab({ profile }) {
  if (!profile || !profile.contributionSummary) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <FaExclamationCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
        <h3>No Contribution Data Available</h3>
      </div>
    );
  }

  const { contributionSummary } = profile;

  return (
    <div className="profile-dashboard" style={{ animation: 'fade-in 0.5s ease-out', gap: '0' }}>
      {/* 1. Heatmap Widget */}
      <Heatmap data={contributionSummary.heatmap} />

      {/* 2. Core Stats Grid */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Contribution Statistics</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaTrophy /></div>
            <div className="stat-info">
              <span className="stat-label">Total Contributions</span>
              <span className="stat-value">{contributionSummary.totalContributions}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCodeBranch /></div>
            <div className="stat-info">
              <span className="stat-label">Commit Contributions</span>
              <span className="stat-value">{contributionSummary.totalCommitContributions}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '-2px' }}>Recent public GitHub activity</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCode /></div>
            <div className="stat-info">
              <span className="stat-label">Total PRs</span>
              <span className="stat-value">{contributionSummary.totalPullRequestContributions}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaExclamationCircle /></div>
            <div className="stat-info">
              <span className="stat-label">Total Issues</span>
              <span className="stat-value">{contributionSummary.totalIssueContributions}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper"><FaCheckCircle /></div>
            <div className="stat-info">
              <span className="stat-label">Code Reviews</span>
              <span className="stat-value">{contributionSummary.totalReviewContributions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributionAnalyticsTab;
