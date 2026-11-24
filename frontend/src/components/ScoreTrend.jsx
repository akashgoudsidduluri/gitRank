import { useState, useEffect } from "react";
import axios from "axios";
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

// Weekly GitRank score trend for one profile.
// Reads GET /api/history/:username — one snapshot per week, oldest first.
// History is a nice-to-have: a failed load never breaks the dashboard.
function ScoreTrend({ username }) {
  const [snapshots, setSnapshots] = useState(null);
  const [error, setError] = useState(null);
  const [legendColor, setLegendColor] = useState("#94a3b8");
  const [gridColor, setGridColor] = useState("rgba(0, 0, 0, 0.05)");

  useEffect(() => {
    if (!username) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    axios.get(`${API_URL}/api/history/${username}`)
      .then((res) => setSnapshots(res.data.snapshots || []))
      .catch(() => setError("Could not load score history."));
  }, [username]);

  // Same theme-aware chart colours as the Contributions tab.
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

  if (error) return null;
  if (snapshots === null) {
    return (
      <div className="glass-panel" style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Score Over Time</h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Loading history…</p>
      </div>
    );
  }
  if (snapshots.length === 0) {
    return (
      <div className="glass-panel" style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Score Over Time</h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          No snapshots yet. One is recorded every time this profile is analyzed, plus a weekly snapshot — check back after next week.
        </p>
      </div>
    );
  }

  const labels = snapshots.map((s) =>
    new Date(s.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })
  );
  const scores = snapshots.map((s) => s.score);
  const first = scores[0];
  const latest = scores[scores.length - 1];
  const change = Number((latest - first).toFixed(2));

  const chartData = {
    labels,
    datasets: [
      {
        label: "GitRank Score",
        data: scores,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4
      }
    ]
  };

  return (
    <div className="glass-panel" style={{ marginTop: "20px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Score Over Time</h3>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        Weekly snapshots — {snapshots.length} recorded
        {snapshots.length < 2 ? ". The trend line appears after next week's snapshot." : "."}
      </p>

      <div className="stats-grid" style={{ marginBottom: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <div className="stat-card" style={{ padding: "15px" }}>
          <div className="stat-info">
            <span className="stat-label">Latest Score</span>
            <span className="stat-value" style={{ fontSize: "16px" }}>{latest}</span>
          </div>
        </div>
        <div className="stat-card" style={{ padding: "15px" }}>
          <div className="stat-info">
            <span className="stat-label">Change Since First</span>
            <span className="stat-value" style={{ fontSize: "16px" }}>{change >= 0 ? `+${change}` : change}</span>
          </div>
        </div>
      </div>

      <div style={{ height: "250px" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                suggestedMin: 40,
                suggestedMax: 100,
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
  );
}

export default ScoreTrend;
