import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="page">
        <div className="spinner"></div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
