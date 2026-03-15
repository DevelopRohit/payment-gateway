import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "💸",
      title: "Send Money",
      path: "/send",
      description: "Transfer funds to any mobile number",
    },
    {
      icon: "📱",
      title: "QR Payment",
      path: "/qr",
      description: "Scan QR codes for quick payments",
    },
    {
      icon: "📲",
      title: "Recharge",
      path: "/recharge",
      description: "Top up mobile balance instantly",
    },
    {
      icon: "📊",
      title: "Transactions",
      path: "/transactions",
      description: "View all transaction history",
    },
  ];

  return (
    <div className="page">
      <div className="home-header">
        <h1>💳 Digital Payment Gateway</h1>
        <p className="subtitle">Fast, Secure & Reliable Payments</p>
      </div>

      <div className="cards">
        {features.map((feature) => (
          <div
            key={feature.path}
            className="card feature-card"
            onClick={() => navigate(feature.path)}
          >
            <div className="card-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
