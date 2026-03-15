import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

import "../styles/auth.css";

function Login({ setUser }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

    try {

      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(res.user);

    } catch (err) {

      alert("Login Failed");

    }

  };

  const googleLogin = async () => {

    try {

      const res = await signInWithPopup(
        auth,
        googleProvider
      );

      setUser(res.user);

    } catch (err) {

      alert("Google Login Failed");

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={login}>
          Login
        </button>

        <button
          className="google-btn"
          onClick={googleLogin}
        >
          Sign in with Google
        </button>

      </div>

    </div>

  );

}

export default Login;