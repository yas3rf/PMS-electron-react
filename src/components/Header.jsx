import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const goto = useNavigate();
  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    window.location.reload();
    // goto("/login");
  };

  return (
    <>
      <footer className="bg-body-tertiary d-flex justify-content-between align-items-center px-3 py-2">
        <div></div>
        <div style={{ height: "55px" }}>
          <button onClick={logout} className="btn btn-secondary">
            <i class="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </footer>
    </>
  );
};

export default Header;
