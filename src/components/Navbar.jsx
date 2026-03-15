import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <h2 className="logo">💳 PayIndia</h2>

      <div className="menu">
        <Link to="/">🏠 Home</Link>

        {user && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>

            <Link to="/add-money" className="nav-add-money-link">
              💰 Add Money
            </Link>

            <Link to="/send">💸 Send</Link>

            <Link to="/qr">📱 QR Pay</Link>

            <Link to="/recharge">📲 Recharge</Link>

            <Link to="/transactions">📋 Transactions</Link>

            <Link to="/profile">👤 Profile</Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" className="nav-auth-link">
              🔓 Login
            </Link>
            <Link to="/register" className="nav-auth-link register">
              📝 Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className="nav-logout-btn">
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
