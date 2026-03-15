import React from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import "./stripe.css";

const stripePromise = loadStripe("pk_test_51TB9He57ls4E8KJgdc8sE3UNP9ldyFIZRFhjXzzZyFNbPUlaFNkN9xOFO1TPcAFXHRkLiOnzLs3nhzfxXY3Wyg8q00cstzAPpQ");


function CheckoutForm(){

const stripe = useStripe();
const elements = useElements();

const handleSubmit = async(e)=>{

e.preventDefault();

const res = await axios.post("http://127.0.0.1:5000/create-payment-intent",{
amount:500
});

const clientSecret = res.data.clientSecret;

const result = await stripe.confirmCardPayment(clientSecret,{
payment_method:{
card:elements.getElement(CardElement)
}
});

if(result.paymentIntent.status === "succeeded"){
alert("Payment Successful 🎉");
}

};

return(

<div className="payment-container">

<div className="payment-card">

<h2>Secure Payment</h2>

<p className="amount">Pay ₹500</p>

<form onSubmit={handleSubmit}>

<div className="card-input">
<CardElement/>
</div>

<button className="pay-btn">
Pay Now
</button>

</form>

<div className="secure-text">
🔒 Secured by Stripe
</div>

</div>

</div>

);

}


export default function StripePayment(){

return(

<Elements stripe={stripePromise}>
<CheckoutForm/>
</Elements>

);

}