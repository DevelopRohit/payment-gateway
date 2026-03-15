import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAGfxrK8qoLex_03L-boqWTxdknuq-5zLw",
  authDomain: "payment-8fd95.firebaseapp.com",
  projectId: "payment-8fd95",
  storageBucket: "payment-8fd95.firebasestorage.app",
  messagingSenderId: "420327216729",
  appId: "1:420327216729:web:f60f6cb8172d6be4388348",
  measurementId: "G-74GLRX83FN"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };