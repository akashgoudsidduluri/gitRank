import {
  FaStar,
  FaUsers,
  FaUserFriends,
  FaCodeBranch,
  FaChartLine,
  FaCalendarAlt
} from "react-icons/fa";

function StatsGrid({ profile }) {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaStar />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Total Stars
          </div>
          <div className="stat-value">
            {profile.totalStars}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaUsers />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Followers
          </div>
          <div className="stat-value">
            {profile.followers}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaUserFriends />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Following
          </div>
          <div className="stat-value">
            {profile.following}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaCodeBranch />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Public Repos
          </div>
          <div className="stat-value">
            {profile.publicRepos}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaChartLine />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Avg Stars / Repo
          </div>
          <div className="stat-value">
            {profile.averageStarsPerRepo}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <FaCalendarAlt />
        </div>
        <div className="stat-info">
          <div className="stat-label">
            Account Age
          </div>
          <div className="stat-value">
            {profile.accountAgeYears} Years
          </div>
        </div>
      </div>

    </div>
  );
}

export default StatsGrid;