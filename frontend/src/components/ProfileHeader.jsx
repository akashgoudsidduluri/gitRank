import { FaCalendarAlt, FaTrophy, FaShareAlt, FaSpinner, FaDownload } from "react-icons/fa";

function ProfileHeader({ profile, onShare, isGenerating }) {
  const handleNativeShare = async () => {
    // If archetype isn't set, try to infer a tier
    let tierText = profile.archetype || "Developer";
    if (!profile.archetype) {
      if (profile.devScore >= 75) tierText = "Gold";
      else if (profile.devScore >= 45) tierText = "Silver";
      else tierText = "Bronze";
    }

    const shareData = {
      title: "My GitRank Profile",
      text: `Check out my GitRank profile!\n\nGitRank Score: ${profile.devScore}\nTier: ${tierText}\n\n`,
      url: `https://gitrank.app/profile/${profile.username}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}${shareData.url}`);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      // AbortError is expected if user cancels the native share
      if (err.name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

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

      <div className="action-btn-group" data-html2canvas-ignore="true">
        <button 
          onClick={handleNativeShare} 
          className="icon-action-btn"
          aria-label="Share GitRank Profile"
          title="Share via Native App"
        >
          <FaShareAlt />
        </button>

        <button 
          onClick={onShare} 
          disabled={isGenerating}
          className="icon-action-btn"
          aria-label="Download GitRank Card"
          title="Download Social Card"
        >
          {isGenerating ? <FaSpinner className="spinner" /> : <FaDownload />}
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;