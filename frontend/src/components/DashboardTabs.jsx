function DashboardTabs({
  activeTab,
  setActiveTab
}) {
  return (
    <div className="dashboard-tabs">
      <button
        className={
          activeTab === "overview"
            ? "tab-btn active-tab"
            : "tab-btn"
        }
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>

      <button
        className={
          activeTab === "repoInsights"
            ? "tab-btn active-tab"
            : "tab-btn"
        }
        onClick={() => setActiveTab("repoInsights")}
      >
        Repository Insights
      </button>
        <button
            className={
                activeTab === "repoExplorer"
                ? "tab-btn active-tab"
                : "tab-btn"
            }
            onClick={() =>
            setActiveTab("repoExplorer")
            }
        >
            Repository Explorer
        </button>
      <button className="tab-btn disabled-tab">
        Contributions
      </button>

      <button className="tab-btn disabled-tab">
        Compare Users
      </button>

      <button className="tab-btn disabled-tab">
        Leaderboard
      </button>
    </div>
  );
}

export default DashboardTabs;