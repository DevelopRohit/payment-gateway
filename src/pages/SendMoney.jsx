import { useState } from "react";
import API from "../api";
import "./sendmoney.css";

function SendMoney(){

const [mobile,setMobile] = useState("");
const [amount,setAmount] = useState("");
const [popup,setPopup] = useState(false);

const sendMoney = async () => {

  // Empty input validation
  if (!mobile || !amount) {
    alert("Please enter mobile number and amount");
    return;
  }

  try {

    const res = await API.post("/send-money", {
      mobile: mobile,
      amount: amount
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

};

return(

<div className="send-container">

<div className="send-card">

<h2>Send Money</h2>

<input
type="text"
placeholder="Enter Mobile Number"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<input
type="number"
placeholder="Enter Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button onClick={sendMoney}>
Pay Now
</button>

</div>


{popup && (

<div className="popup">

<div className="popup-card">

<h2>🎉 Payment Successful</h2>

<p>Money sent successfully</p>

<button onClick={()=>setPopup(false)}>
OK
</button>

</div>

</div>

)}

</div>

);

}

export default SendMoney;