import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">

      <h2 className="logo">PayIndia</h2>

      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/send">Send Money</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </div>

    </div>
  );
}

export default Navbar;