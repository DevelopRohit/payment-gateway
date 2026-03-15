import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="home">

      <h1>India Digital Payment Gateway</h1>

      <p>Send Money Instantly Anywhere in India</p>

      <div className="cards">

        <div className="card" onClick={() => navigate("/send")}>
          <h3>Send Money</h3>
          <p>Transfer money via UPI</p>
        </div>

        <div className="card" onClick={() => navigate("/qr")}>
          <h3>QR Payment</h3>
          <p>Scan QR & Pay</p>
        </div>

        <div className="card" onClick={() => navigate("/recharge")}>
          <h3>Recharge</h3>
          <p>Mobile Recharge</p>
        </div>

      </div>

    </div>

  );
}

export default Home;