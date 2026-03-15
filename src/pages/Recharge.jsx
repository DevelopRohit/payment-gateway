// import { useState } from "react";
// import API from "../api";

// function Recharge() {
//   const [mobile, setMobile] = useState("");
//   const [amount, setAmount] = useState("");
//   const [popup, setPopup] = useState(false);

//   async function createRecharge(params) {
//     try {
//       const res = await API.post("/recharge", {
//         mobile: mobile,
//         amount: amount,
//       });

//       if (res.data.message === "Payment Successful") {
//         setPopup(true);

//         // input clear
//         setMobile("");
//         setAmount("");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Payment failed. Backend connection error.");
//     }
//   }

//   return (
//     <div className="form">
//       <h2>Mobile Recharge</h2>

//       <input
//         type="text"
//         placeholder="Enter Mobile Number"
//         value={mobile}
//         onChange={(e) => setMobile(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Enter Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <button onClick={createRecharge}>Recharge</button>
//       {popup && (
//         <div className="popup">
//           <div className="popup-card">
//             <h2>🎉 Recharge Successful</h2>

//             <p>Recharge successfully</p>

//             <button onClick={() => setPopup(false)}>OK</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Recharge;

import { useState } from "react";
import API from "../api";
import Toast from "../components/Toast";
function Recharge() {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (parseFloat(amount) > 50000) {
      newErrors.amount = "Amount cannot exceed Rs. 50,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const recharge = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/recharge", {
        mobile: mobile.trim(),
        amount: parseFloat(amount),
      });

      if (res.data.message === "Recharge Successful") {
        setPopup(true);
        setToast({ message: "Recharge completed!", type: "success" });

        setTimeout(() => {
          setMobile("");
          setAmount("");
        }, 500);

        setTimeout(() => {
          setPopup(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.error || "Recharge failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      recharge();
    }
  };

  return (
    <div className="send-container">
      <div className="send-card">
        <h2>📲 Mobile Recharge</h2>
        <p style={{ color: "#999", marginBottom: "30px" }}>
          Top up your mobile balance instantly
        </p>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              if (errors.mobile) setErrors({ ...errors, mobile: "" });
            }}
            onKeyPress={handleKeyPress}
            maxLength="10"
            style={{ borderColor: errors.mobile ? "#f44336" : "#e0e0e0" }}
          />
          {errors.mobile && (
            <p style={{ color: "#f44336", fontSize: "0.9rem" }}>
              ✗ {errors.mobile}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Amount (Rs.)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors({ ...errors, amount: "" });
            }}
            onKeyPress={handleKeyPress}
            min="1"
            max="50000"
            style={{ borderColor: errors.amount ? "#f44336" : "#e0e0e0" }}
          />
          {errors.amount && (
            <p style={{ color: "#f44336", fontSize: "0.9rem" }}>
              ✗ {errors.amount}
            </p>
          )}
        </div>

        <button
          onClick={recharge}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Recharge Now"}
        </button>
      </div>

      {popup && (
        <div className="popup">
          <div className="popup-card">
            <h2 style={{ color: "#4caf50" }}>✓ Recharge Successful</h2>
            <p style={{ color: "#333", marginBottom: "20px" }}>
              Rs. {amount} added to {mobile}
            </p>
            <p style={{ color: "#999", fontSize: "0.9rem" }}>
              Your mobile has been recharged successfully.
            </p>
            <button
              onClick={() => setPopup(false)}
              style={{ marginTop: "20px" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Recharge;
