import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const prefix = type === "error" ? "Error: " : "Success: ";

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span>{prefix}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
