import React, { createContext, useState } from "react";

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, handleLoginSuccess, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
