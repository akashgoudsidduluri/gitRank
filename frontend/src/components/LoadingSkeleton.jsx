function LoadingSkeleton() {
  return (
    <div className="glass-panel loading-skeleton">
      <div className="skeleton-item skeleton-header"></div>

      <div className="skeleton-grid">
        <div className="skeleton-item skeleton-card"></div>
        <div className="skeleton-item skeleton-card"></div>
        <div className="skeleton-item skeleton-card"></div>
        <div className="skeleton-item skeleton-card"></div>
        <div className="skeleton-item skeleton-card"></div>
        <div className="skeleton-item skeleton-card"></div>
      </div>

      <div
        className="skeleton-item skeleton-body"
        style={{ height: "120px" }}
      ></div>

      <div
        className="skeleton-item skeleton-body"
        style={{ height: "180px" }}
      ></div>
    </div>
  );
}

export default LoadingSkeleton;