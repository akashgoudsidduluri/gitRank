import React from "react";
import { FaCalendarAlt, FaTrophy, FaShareAlt, FaSpinner } from "react-icons/fa";

function ProfileHeader({ profile, onShare, isGenerating }) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="glass-panel profile-header-card">
        <div className="user-info-group">
          <div className="user-avatar-wrapper">
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={profile.avatar}
                alt={profile.username}
                className="user-avatar"
                crossOrigin="anonymous" 
              />
            </a>
          </div>

          <div className="user-meta-details">
            <h2 className="user-username">
              {profile.username}

              {profile.archetype && (
                <span className="archetype-badge">
                  {profile.archetype}
                </span>
              )}
            </h2>

            <div className="user-subtext">
              <FaCalendarAlt />
              Member for {profile.accountAgeYears}{" "}
              {profile.accountAgeYears === 1
                ? "year"
                : "years"}
            </div>
          </div>
        </div>

        <div className="score-badge-container">
          <div className="score-text-block">
            <div className="score-label">
              Dev Score
            </div>

            <div className="score-value">
              {profile.devScore}/100
            </div>
          </div>

          <div className="score-gauge-ring">
            <FaTrophy
              size={28}
              className="logo-icon"
              style={{
                color:
                  profile.devScore >= 75
                    ? "var(--strength-color)"
                    : profile.devScore >= 45
                    ? "var(--weakness-color)"
                    : "var(--text-muted)"
              }}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={onShare} 
        disabled={isGenerating}
        className="share-btn"
        aria-label="Share GitRank Card"
        title="Download Social Card"
        data-html2canvas-ignore="true" /* Hide button in the screenshot! */
      >
        {isGenerating ? <FaSpinner className="spinner" /> : <FaShareAlt />} 
        <span className="share-text">{isGenerating ? 'Generating...' : 'Share Rank'}</span>
      </button>
    </div>
  );
}

export default ProfileHeader;