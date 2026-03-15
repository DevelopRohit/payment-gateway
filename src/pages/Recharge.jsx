import { useState } from "react";
import API from "../api";

function Recharge() {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [popup, setPopup] = useState(false);

  async function createRecharge(params) {
    try {
      const res = await API.post("/recharge", {
        mobile: mobile,
        amount: amount,
      });

      if (res.data.message === "Payment Successful") {
        setPopup(true);

        // input clear
        setMobile("");
        setAmount("");
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed. Backend connection error.");
    }
  }

  return (
    <div className="form">
      <h2>Mobile Recharge</h2>

      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={createRecharge}>Recharge</button>
      {popup && (
        <div className="popup">
          <div className="popup-card">
            <h2>🎉 Recharge Successful</h2>

            <p>Recharge successfully</p>

            <button onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recharge;
