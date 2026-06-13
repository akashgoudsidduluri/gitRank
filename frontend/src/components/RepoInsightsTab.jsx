import "./RepoInsightsTab.css";

function RepoInsightsTab({ repoInsights }) {
  if (!repoInsights) return null;

  return (
    <div className="repo-insights-container">
      <h2>Repository Insights</h2>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Most Used Language</h3>
          <p>{repoInsights.mostUsedLanguage}</p>
        </div>

        <div className="insight-card">
          <h3>Original Repositories</h3>
          <p>{repoInsights.originalRepoCount}</p>
        </div>

        <div className="insight-card">
          <h3>Starred Repositories</h3>
          <p>
            {repoInsights.reposWithStars} (
            {repoInsights.starredRepoPercentage}%)
          </p>
        </div>

        <div className="insight-card">
          <h3>Average Forks / Repo</h3>
          <p>{repoInsights.averageForksPerRepo}</p>
        </div>
      </div>

      <div className="language-section">
        <h3>Language Breakdown</h3>

        {repoInsights.languageBreakdown && repoInsights.languageBreakdown.length > 0 ? (
          repoInsights.languageBreakdown.map((lang, index) => (
            <div key={index} className="language-row">
              <span className="language-name">
                {lang.language}
              </span>

              <div className="language-bar-container">
                <div
                  className="language-bar"
                  style={{
                    width: `${lang.percentage}%`
                  }}
                ></div>
              </div>

              <span className="language-percent">
                {lang.percentage}%
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No language data available for these repositories.</p>
        )}
      </div>

      <div className="repo-highlights">
        <div className="highlight-card">
          <h3>🍴 Most Forked Repo</h3>

          <a
            href={repoInsights.mostForkedRepo?.url}
            target="_blank"
            rel="noreferrer"
          >
            {repoInsights.mostForkedRepo?.name}
          </a>

          <div className="highlight-meta">
            {repoInsights.mostForkedRepo?.forks} forks
          </div>
        </div>

        <div className="highlight-card">
          <h3>🆕 Newest Repo</h3>

          <a
            href={repoInsights.newestRepo?.url}
            target="_blank"
            rel="noreferrer"
          >
            {repoInsights.newestRepo?.name}
          </a>

          <div className="highlight-meta">
            {new Date(
              repoInsights.newestRepo?.createdAt
            ).toLocaleDateString()}
          </div>
        </div>

        <div className="highlight-card">
          <h3>📜 Oldest Repo</h3>

          <a
            href={repoInsights.oldestRepo?.url}
            target="_blank"
            rel="noreferrer"
          >
            {repoInsights.oldestRepo?.name}
          </a>

          <div className="highlight-meta">
            {new Date(
              repoInsights.oldestRepo?.createdAt
            ).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoInsightsTab;