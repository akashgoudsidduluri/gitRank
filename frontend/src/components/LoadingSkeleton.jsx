function LoadingSkeleton({ message }) {
  return (
    <div className="loading-container" style={{ textAlign: 'center', width: '100%', margin: '24px 0', animation: 'fade-in 0.3s ease' }}>
      {message && (
        <p style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: 'var(--accent-primary)', 
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span className="spinner" style={{ 
            display: 'inline-block', 
            width: '20px', 
            height: '20px', 
            border: '3px solid var(--glass-border)', 
            borderTopColor: 'var(--accent-primary)', 
            borderRadius: '50%' 
          }}></span>
          {message}
        </p>
      )}
      <div className="glass-panel loading-skeleton">
        <div className="skeleton-item skeleton-header"></div>
        <div className="skeleton-grid">
          <div className="skeleton-item skeleton-card"></div>
          <div className="skeleton-item skeleton-card"></div>
          <div className="skeleton-item skeleton-card"></div>
          <div className="skeleton-item skeleton-card"></div>
        </div>
        <div className="skeleton-item skeleton-body" style={{ height: "140px" }}></div>
        <div className="skeleton-item skeleton-body" style={{ height: "180px" }}></div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;