import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2>Page Not Found</h2>
      <p style={{ color: "white", marginBottom: "20px" }}>
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
