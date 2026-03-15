import { useState } from "react";
import API from "../api";
import Toast from "../components/Toast";

function SendMoney() {
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
    } else if (parseFloat(amount) > 100000) {
      newErrors.amount = "Amount cannot exceed Rs. 100,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendMoney = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/send-money", {
        mobile: mobile.trim(),
        amount: parseFloat(amount),
      });

      if (res.data.message === "Payment Successful") {
        setPopup(true);
        setToast({ message: "Money sent successfully!", type: "success" });

        // Clear inputs after 1 second
        setTimeout(() => {
          setMobile("");
          setAmount("");
        }, 500);

        // Close popup after 3 seconds
        setTimeout(() => {
          setPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setToast({
        message:
          error.response?.data?.error || "Payment failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMoney();
    }
  };

  return (
    <div className="send-container">
      <div className="send-card">
        <h2>💸 Send Money</h2>
        <p style={{ color: "#999", marginBottom: "30px" }}>
          Transfer funds to any mobile number instantly
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
            max="100000"
            style={{ borderColor: errors.amount ? "#f44336" : "#e0e0e0" }}
          />
          {errors.amount && (
            <p style={{ color: "#f44336", fontSize: "0.9rem" }}>
              ✗ {errors.amount}
            </p>
          )}
        </div>

        <button
          onClick={sendMoney}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>
      </div>

      {popup && (
        <div className="popup">
          <div className="popup-card">
            <h2 style={{ color: "#4caf50" }}>✓ Payment Successful</h2>
            <p style={{ color: "#333", marginBottom: "20px" }}>
              Rs. {amount} sent to {mobile}
            </p>
            <p style={{ color: "#999", fontSize: "0.9rem" }}>
              Your transaction has been completed successfully.
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

export default SendMoney;

// import { useState } from "react";
// import API from "../api";
// // import "./sendmoney.css";

// function SendMoney(){

// const [mobile,setMobile] = useState("");
// const [amount,setAmount] = useState("");
// const [popup,setPopup] = useState(false);

// const sendMoney = async () => {

//   if (!mobile || !amount) {
//     alert("Please enter mobile number and amount");
//     return;
//   }

//   try {

//     const res = await API.post("/send-money",{
//       mobile: mobile,
//       amount: amount
//     });

//     if(res.data.message === "Payment Successful"){

//       setPopup(true);

//       setMobile("");
//       setAmount("");

//     }

//   } catch(error){

//     console.error(error);

//     alert("Backend connection error");

//   }

// };

// return(

// <div className="send-container">

// <div className="send-card">

// <h2>Send Money</h2>

// <input
// type="text"
// placeholder="Enter Mobile Number"
// value={mobile}
// onChange={(e)=>setMobile(e.target.value)}
// />

// <input
// type="number"
// placeholder="Enter Amount"
// value={amount}
// onChange={(e)=>setAmount(e.target.value)}
// />

// <button onClick={sendMoney}>
// Pay Now
// </button>

// </div>

// {popup && (

// <div className="popup">

// <div className="popup-card">

// <h2>🎉 Payment Successful</h2>

// <p>Money Sent Successfully</p>

// <button onClick={()=>setPopup(false)}>
// OK
// </button>

// </div>

// </div>

// )}

// </div>

// );

// }

// export default SendMoney;
