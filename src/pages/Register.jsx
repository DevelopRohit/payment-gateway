import { useState } from "react";
import API from "../api";

function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const register = async () => {

    try {

      await API.post("/register",{
        name:name,
        email:email,
        password:password
      });

      alert("Account Created");

    } catch (error) {

      console.log(error);
      alert("Error");

    }

  };

  return (

    <div className="form">

      <h2>Create Account</h2>

      <input
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={register}>
        Register
      </button>

    </div>

  );

}

export default Register;