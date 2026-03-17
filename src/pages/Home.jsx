import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "UPI",
      title: "Add Money",
      path: "/payments?action=add-money",
      description: "Load wallet balance using card or UPI apps",
    },
    {
      icon: "PAY",
      title: "Send Money",
      path: "/payments?action=send-money",
      description: "Transfer funds using debit, credit or UPI",
    },
    {
      icon: "QR",
      title: "QR Payment",
      path: "/qr",
      description: "Scan QR codes for quick payments",
    },
    {
      icon: "TOP",
      title: "Recharge",
      path: "/payments?action=recharge",
      description: "Recharge any number with card or UPI checkout",
    },
    {
      icon: "LOG",
      title: "Transactions",
      path: "/transactions",
      description: "View all transaction history",
    },
  ];

  return (
    <div className="page">
      <div className="home-header">
        <h1>Digital Payment Gateway</h1>
        <p className="subtitle">
          Fast, secure and flexible payments with card and UPI checkout
        </p>
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
