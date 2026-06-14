import { 
  FaStar, 
  FaCodeBranch, 
  FaTrophy, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCode
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

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

  const allDays = contributionSummary.heatmap.flatMap(
    week => week.contributionDays
  );

  const monthlyMap = {};
  allDays.forEach(day => {
    const month = day.date.slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + day.contributionCount;
  });

  const activityChartData = {
    labels: Object.keys(monthlyMap).map(m => {
      const date = new Date(m + "-02"); // Day 02 to avoid timezone shifts
      return date.toLocaleDateString(undefined, { month: 'short' });
    }),
    datasets: [
      {
        label: "Contributions",
        data: Object.values(monthlyMap),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4,
      }
    ]
  };

  const peakMonthEntry = Object.entries(monthlyMap)
    .sort((a, b) => b[1] - a[1])[0];

  const avgMonthlyContributions = Math.round(
    Object.values(monthlyMap).reduce((a, b) => a + b, 0) / 
    (Object.keys(monthlyMap).length || 1)
  );

  return (
    <div className="profile-dashboard" style={{ animation: 'fade-in 0.5s ease-out', gap: '0' }}>
      {/* 1. Heatmap Widget */}
      <Heatmap data={contributionSummary.heatmap} />

      {/* Activity Trend */}
      <div className="glass-panel" style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
          Activity Trend
        </h3>

        <div className="stats-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="stat-card" style={{ padding: '15px' }}>
            <div className="stat-info">
              <span className="stat-label">Peak Month</span>
              <span className="stat-value" style={{ fontSize: '16px' }}>
                {peakMonthEntry ? new Date(peakMonthEntry[0] + "-02").toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '15px' }}>
            <div className="stat-info">
              <span className="stat-label">Monthly Avg</span>
              <span className="stat-value" style={{ fontSize: '16px' }}>{avgMonthlyContributions}</span>
            </div>
          </div>
        </div>

        <div style={{ height: '250px' }}>
          <Line
            data={activityChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </div>

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
