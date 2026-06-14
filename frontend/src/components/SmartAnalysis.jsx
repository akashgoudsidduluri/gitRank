function SmartAnalysis({ profile }) {
  return (
    <div className="insights-container">

      <div className="glass-panel insight-card strengths-card">
        <h3 className="strengths-title">Strengths</h3>

        <ul className="insights-list">
          {profile.strengths?.map((strength, index) => (
            <li
              key={index}
              className="insights-item insights-item-strength"
            >
              {strength}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel insight-card weaknesses-card">
        <h3 className="weaknesses-title">Weaknesses</h3>

        <ul className="insights-list">
          {profile.weaknesses?.map((weakness, index) => (
            <li
              key={index}
              className="insights-item insights-item-weakness"
            >
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel insight-card recommendations-card">
        <h3 className="recommendations-title">
          Recommendations
        </h3>

        <ul className="insights-list">
          {profile.recommendations?.map((recommendation, index) => (
            <li
              key={index}
              className="insights-item insights-item-recommendation"
            >
              {recommendation}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default SmartAnalysis;