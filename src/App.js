import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Inventory from "./components/Inventory";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/dropdown.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sales from "./components/Sales";
import Suppliers from "./components/Suppliers";
import SaleHistory from "./components/SaleHistory";
import Dashboard from "./components/Dashboard";
import Layout from "./Layout";
import Purchase from "./components/Purchase";
import Login from "./components/Login";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On component mount, check if the user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Function to handle login success and update state
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Save login state
  };

  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            {/* Redirect any unknown path to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchases" element={<Purchase />} />
              <Route path="/sales-history" element={<SaleHistory />} />
            </Route>
            {/* Redirect unknown paths to dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
