import { useState, useEffect } from "react";
import {
  FaCodeBranch, 
  FaTrophy, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCode,
  FaInfoCircle
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Map strings to React Icons components for Achievements and Badges

// Heatmap Grid (aligned to 53 weeks)
const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return null;
  const allDays = data.flatMap(week => week.contributionDays);

  // Calculate month label positions
  const monthLabels = [];
  data.forEach((week, i) => {
    if (week.contributionDays && week.contributionDays[0]) {
      const date = new Date(week.contributionDays[0].date);
      const monthName = date.toLocaleString('default', { month: 'short' });
      if (i === 0 || (i > 0 && new Date(data[i - 1].contributionDays[0].date).getMonth() !== date.getMonth())) {
        // Only add label if there's enough space from the previous one
        if (monthLabels.length === 0 || (i - monthLabels[monthLabels.length - 1].index) > 3) {
          monthLabels.push({ name: monthName, index: i });
        }
      }
    }
  });
  
  return (
    <div className="glass-panel heatmap-container-outer">
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Contribution Heatmap</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Real-time GitHub contribution activity over the last 12 months.
      </p>
      
      <div className="heatmap-scroll-area">
        <div className="heatmap-months">
          {monthLabels.map((m, i) => (
            <span key={i} style={{ gridColumn: m.index + 1 }}>
              {m.name}
            </span>
          ))}
        </div>
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
  // eslint-disable-next-line no-unused-vars
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [legendColor, setLegendColor] = useState("#94a3b8");
  const [gridColor, setGridColor] = useState("rgba(0, 0, 0, 0.05)");

  // Reactive color detection for Chart.js
  useEffect(() => {
    const updateChartTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      const secondary = styles.getPropertyValue('--text-secondary').trim();
      if (secondary) setLegendColor(secondary);

      const theme = document.documentElement.getAttribute('data-theme');
      setGridColor(theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)');
    };

    updateChartTheme();
    const observer = new MutationObserver(updateChartTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (!profile || !profile.contributionSummary) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <FaExclamationCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
        <h3>No Contribution Data Available</h3>
      </div>
    );
  }

  const getBadgeDescription = (title) => {
    const descriptions = {
      "GitRank Explorer": "Awarded for achieving a GitRank score above 20. Represents active participation in GitHub projects and repository ownership.",
      "Open Source Explorer": "Awarded for crossing 500+ total contributions. Recognizes consistent open-source activity across repositories, pull requests, and issues.",
      "Maintainer Material": "Awarded for managing 25+ repositories. Highlights users who actively build and maintain software projects."
    };
    return descriptions[title] || "Recognizes significant open-source contribution and profile development.";
  };

  const getAchievementDetails = (ach) => {
    const details = {
      "Commit Crusader": "Awarded for making commit contributions.",
      "PR Pioneer": "Awarded for submitting pull requests.",
      "Issue Hunter": "Awarded for opening issues.",
      "Code Reviewer": "Awarded for reviewing code.",
      "Repo Builder": "Awarded for creating repositories.",
      "Star Magnet": "Awarded for earning repository stars.",
      "Open Source Veteran": "Awarded based on GitHub account age."
    };
    
    const gold = ach.target;
    const silver = Math.round(gold * 0.4);
    const bronze = Math.round(gold * 0.1);

    return {
      desc: details[ach.title] || "Awarded for GitHub activity.",
      tiers: [
        { label: "Bronze", val: bronze },
        { label: "Silver", val: silver },
        { label: "Gold", val: gold }
      ]
    };
  };

  // Destructure for cleaner access and reliability
  const {
    contributionSummary,
    devScoreBreakdown,
    devScore,
    profileCompletion,
    // eslint-disable-next-line no-unused-vars
    osRank,
    archetype,
    achievements,
    badges
  } = profile;

  const allDays = contributionSummary.heatmap.flatMap(
    week => week.contributionDays
  );

  // Streak and Peak Calculations
  const sortedDays = [...allDays].sort((a, b) => new Date(a.date) - new Date(b.date));
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  sortedDays.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  for (let i = sortedDays.length - 1; i >= 0; i--) {
    if (sortedDays[i].contributionCount > 0) currentStreak++;
    else break;
  }

  const peakDayEntry = [...allDays].sort((a, b) => b.contributionCount - a.contributionCount)[0];
  
  const activeDaysCount = allDays.filter(d => d.contributionCount > 0).length;
  const totalDaysInPeriod = allDays.length;

  const monthlyMap = {};
  allDays.forEach(day => {
    const month = day.date.slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + day.contributionCount;
  });

  // Ensure chronological order for the trend chart
  const sortedMonthKeys = Object.keys(monthlyMap).sort();

  const activityChartData = {
    labels: sortedMonthKeys.map(m => {
      const date = new Date(m + "-02"); // Day 02 to avoid timezone shifts
      return date.toLocaleDateString(undefined, { month: 'short' });
    }),
    datasets: [
      {
        label: "Contributions",
        data: sortedMonthKeys.map(m => monthlyMap[m]),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4,
      }
    ]
  };

  const breakdownData = {
    labels: ["Commits", "PRs", "Issues", "Reviews"],
    datasets: [
      {
        data: [
          contributionSummary.totalCommitContributions,
          contributionSummary.totalPullRequestContributions,
          contributionSummary.totalIssueContributions,
          contributionSummary.totalReviewContributions,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        hoverBackgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa"],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 10,
        spacing: 4
      },
    ],
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

      {/* Top Insights Section */}
      <div className="stats-grid" style={{ marginTop: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Contribution Breakdown</h3>
          <div style={{ height: '200px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="donut-center-overlay">
              <span className="overlay-val">{contributionSummary.totalContributions}</span>
              <span className="overlay-label">Total</span>
            </div>
            <Doughnut 
              data={breakdownData} 
              options={{ 
                maintainAspectRatio: false, 
                cutout: '75%',
                plugins: { 
                  legend: { 
                    position: 'bottom', 
                    labels: { 
                      boxWidth: 12, 
                      padding: 20,
                      color: legendColor,
                      font: {
                        family: "'Outfit', sans-serif",
                        size: 12,
                        weight: '600'
                      }
                    } 
                  } 
                },
                animation: {
                  animateScale: true,
                  animateRotate: true
                }
              }} 
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Consistency & Peaks</h3>
          <div className="stat-card" style={{ padding: '12px' }}>
             <div className="stat-info">
                <span className="stat-label">Current Streak</span>
                <span className="stat-value">{currentStreak} Days</span>
             </div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
             <div className="stat-info">
                <span className="stat-label">Longest Streak</span>
                <span className="stat-value">{longestStreak} Days</span>
             </div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
             <div className="stat-info">
                <span className="stat-label">Peak Contribution Day</span>
                <span className="stat-value" style={{ fontSize: '15px' }}>
                  {peakDayEntry ? new Date(peakDayEntry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {peakDayEntry?.contributionCount} Contributions
                </span>
             </div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
             <div className="stat-info">
                <span className="stat-label">Active Days</span>
                <span className="stat-value">{activeDaysCount} / {totalDaysInPeriod}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Days with activity</span>
             </div>
          </div>
        </div>
      </div>

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
          <div className="stat-card" style={{ padding: '15px' }}>
            <div className="stat-info">
              <span className="stat-label">GitRank Tier</span>
              <span className="stat-value" style={{ fontSize: '18px', color: 'var(--strength-color)', textTransform: 'capitalize' }}>
                {archetype}
              </span>
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
                y: { 
                  beginAtZero: true, 
                  grid: { color: gridColor },
                  ticks: {
                    color: legendColor,
                    font: { size: 10 }
                  }
                },
                x: { 
                  grid: { display: false },
                  ticks: {
                    color: legendColor,
                    font: { size: 10 }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* 3. Core Stats Grid */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Contribution Statistics</h3>
          <button 
            onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
            className={`tab-btn ${showScoreBreakdown ? 'active' : ''}`}
            style={{ fontSize: '11px', padding: '8px 16px', borderRadius: '12px' }}
          >
            {showScoreBreakdown ? "Hide" : "View"} Score Breakdown
          </button>
        </div>

        {showScoreBreakdown && devScoreBreakdown && (
          <div className="glass-panel" style={{ marginBottom: '24px', background: 'var(--card-bg)', border: '1px dashed var(--accent-primary)', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
              {Object.entries(devScoreBreakdown).map(([key, val]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div className="stat-label" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</div>
                  <div className="stat-value" style={{ fontSize: '20px', fontWeight: '800' }}>+{val}</div>
                </div>
              ))}
              <div style={{ textAlign: 'center', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '12px' }}>
                <div className="stat-label" style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: '800', textTransform: 'uppercase' }}>Final Score</div>
                <div className="stat-value" style={{ fontSize: '24px', color: 'var(--accent-primary)', fontWeight: '900' }}>{devScore}</div>
              </div>
            </div>
          </div>
        )}

        <div className="stat-card" style={{ marginBottom: '16px', justifyContent: 'space-between' }}>
          <div className="stat-info">
            <span className="stat-label">Profile Completion</span>
            <span className="stat-value">{profileCompletion}%</span>
          </div>
          <div style={{ width: '60%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'var(--strength-color)' }}></div>
          </div>
        </div>

        <div className="stats-grid" style={{ marginTop: '24px' }}>
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

      {/* 4. Achievements Section */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(ach => {
            const isStarted = ach.progress > 0;
            const isCompleted = ach.unlocked;
            
            return (
              <div 
                className="achievement-card" 
                key={ach.id} 
                onClick={() => setSelectedAchievement(ach)}
                style={{ 
                  opacity: isStarted ? 1 : 0.6,
                  border: isCompleted ? '1px solid #22c55e' : '1px solid var(--card-border)',
                  boxShadow: isCompleted ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none',
                  background: isCompleted ? 'linear-gradient(135deg, var(--card-bg), rgba(34, 197, 94, 0.05))' : 'var(--card-bg)',
                  cursor: 'pointer',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <div className="badge-info-wrapper">
                  <FaInfoCircle className="badge-info-icon" />
                  <div className="badge-tooltip">
                    <strong style={{ display: 'block', marginBottom: '4px' }}>{ach.title}</strong>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', lineHeight: '1.4', color: '#cbd5e1' }}>
                      {getAchievementDetails(ach).desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center', paddingRight: '20px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontWeight: '800', fontSize: '14px', color: isCompleted ? '#22c55e' : 'var(--text-primary)' }}>
                       {isCompleted ? '✓' : (ach.progress === 0 ? '🔒' : '🎯')} {ach.title}
                     </span>
                     <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                       {isCompleted ? 'Completed' : 'Bronze Tier'}
                     </span>
                   </div>
                   <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                     {ach.current} / {ach.target}
                   </span>
                </div>
                
                <div className="achievement-progress-container" style={{ height: '14px', background: 'var(--glass-border)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <div 
                    className="achievement-progress-slider" 
                    style={{ 
                      width: `${ach.progress}%`, 
                      height: '100%', 
                      background: isCompleted ? '#22c55e' : 'var(--accent-primary)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                  <span style={{ 
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', 
                    fontSize: '9px', fontWeight: '900', color: ach.progress > 90 ? '#fff' : 'var(--text-primary)' 
                  }}>
                    {ach.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Badges Section */}
      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>GitRank Badges</h3>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {badges.map(badge => {
            const tierColors = {
              Bronze: '#cd7f32',
              Silver: '#c0c0c0',
              Gold: '#ffd700',
              Platinum: '#e5e4e2'
            };
            const color = tierColors[badge.tier] || '#64748b';
            const tierClass = `tier-${badge.tier.toLowerCase()}`;

            return (
              <div 
                className={`stat-card ${tierClass}`}
                key={badge.title} 
                style={{ 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  padding: '24px',
                  position: 'relative'
                }}
              >
                <div className="badge-info-wrapper">
                  <FaInfoCircle className="badge-info-icon" />
                  <div className="badge-tooltip">
                    <strong style={{ display: 'block', marginBottom: '4px' }}>{badge.title}</strong>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', lineHeight: '1.4', color: '#cbd5e1' }}>
                      {getBadgeDescription(badge.title)}
                    </p>
                  </div>
                </div>

                <div 
                  className="stat-icon-wrapper" 
                  style={{ 
                    marginBottom: '12px', 
                    fontSize: '24px', 
                    background: `${color}15`, 
                    color: color,
                    boxShadow: `0 0 15px ${color}33`
                  }}
                >
                  🏆
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '4px 0' }}>{badge.title}</h4>
                <span className="badge-level-tag" style={{ 
                  background: color,
                  color: badge.tier === 'Gold' || badge.tier === 'Platinum' ? '#000' : '#fff', 
                  fontSize: '9px', padding: '3px 10px', borderRadius: '10px', fontWeight: '800'
                }}>{badge.tier} Tier</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub Achievements Placeholder */}
      <div className="glass-panel" style={{ marginTop: '20px', borderStyle: 'dashed', background: 'transparent' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>GitHub Official Achievements</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Integration planned. Future support for official GitHub accolades:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
          {['Pull Shark', 'Quickdraw', 'YOLO', 'Pair Extraordinaire', 'Starstruck', 'Galaxy Brain'].map(name => (
            <span key={name} style={{ padding: '4px 10px', background: 'var(--glass-border)', borderRadius: '6px' }}>• {name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContributionAnalyticsTab;
