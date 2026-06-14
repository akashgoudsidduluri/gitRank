import { FaExclamationCircle } from "react-icons/fa";

function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <FaExclamationCircle size={20} />
      <span>{error}</span>
    </div>
  );
}

export default ErrorBanner;