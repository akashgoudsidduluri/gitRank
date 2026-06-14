import { FaStar, FaExternalLinkAlt } from "react-icons/fa";

function SpotlightRepo({ profile }) {
  if (!profile.topRepo) return null;

  return (
    <div className="glass-panel spotlight-repo-card">
      <div className="spotlight-title-group">
        <span className="spotlight-badge">
          Top Project Spotlight
        </span>

        <span className="repo-stars-count">
          <FaStar className="repo-star-icon" />
          {profile.topRepoStars} Stars
        </span>
      </div>

      <a
        href={profile.topRepoUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="repo-link-element"
      >
        {profile.topRepo}
        <FaExternalLinkAlt size={14} />
      </a>

      <p
        style={{
          marginTop: "10px",
          color: "var(--text-secondary)",
          fontSize: "14px"
        }}
      >
        This repository has generated the highest level of
        community stars and serves as a core highlight.
      </p>
    </div>
  );
}

export default SpotlightRepo;