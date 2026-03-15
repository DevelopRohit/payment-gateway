// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";

// import Navbar from "./components/Navbar";

// import Home from "./pages/Home";
// import SendMoney from "./pages/SendMoney";
// import QRPayment from "./pages/QRPayment";
// import Recharge from "./pages/Recharge";
// import Transactions from "./pages/Transactions";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Admin from "./pages/Admin";

// function App() {
//   const [user, setUser] = useState(null);

//   return (
//     <BrowserRouter>
//       {/* Navbar sirf login hone ke baad dikhega */}

//       {user && <Navbar />}

//       <Routes>
//         {/* agar login nahi hai to login page */}

//         <Route path="/login" element={<Login setUser={setUser} />} />

//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes */}

//         <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />

//         <Route
//           path="/send"
//           element={user ? <SendMoney /> : <Navigate to="/login" />}
//         />

//         <Route
//           path="/qr"
//           element={user ? <QRPayment /> : <Navigate to="/login" />}
//         />

//         <Route
//           path="/recharge"
//           element={user ? <Recharge /> : <Navigate to="/login" />}
//         />

//         <Route
//           path="/transactions"
//           element={user ? <Transactions /> : <Navigate to="/login" />}
//         />

//         <Route path="/profile" element={<Profile user={user} />} />
//         <Route
//           path="/admin"
//           element={user ? <Admin /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SendMoney from "./pages/SendMoney";
import QRPayment from "./pages/QRPayment";
import Recharge from "./pages/Recharge";
import AddMoney from "./pages/AddMoney";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/send"
            element={
              <ProtectedRoute>
                <SendMoney />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qr"
            element={
              <ProtectedRoute>
                <QRPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recharge"
            element={
              <ProtectedRoute>
                <Recharge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-money"
            element={
              <ProtectedRoute>
                <AddMoney />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
