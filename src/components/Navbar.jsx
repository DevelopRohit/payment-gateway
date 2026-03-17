import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "../styles/navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className="navbar">
      <h2 className="logo">PayIndia</h2>

      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/payments?action=add-money" className="nav-add-money-link">
          Payments
        </Link>
        <Link to="/payments?action=send-money">Send</Link>
        <Link to="/qr">QR Pay</Link>
        <Link to="/payments?action=recharge">Recharge</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/profile">Profile</Link>
        {user?.id === "guest" && <span className="nav-guest-badge">Guest Mode</span>}
      </div>
    </div>
  );
}

export default Navbar;
