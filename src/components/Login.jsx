import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  // const { handleLoginSuccess } = useContext(UserContext);

  const register = async () => {
    try {
      const user = { username, password };
      await window.electronAPI.userRegister(user);
    } catch (error) {
      console.log("error registring");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { username, password };
    try {
      const result = await window.electronAPI.login(user);
      console.log(result);
      if (result.success) {
        onLoginSuccess();
        alert(result.message);
      } else {
        setErr(result.message);
        alert(err);
      }
    } catch (error) {
      console.error("login error", error);
      setErr("Error during login");
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mx-auto text-primary mt-5" style={{ width: "200px" }}>
        LOGIN
      </h2>
      <div className="form-section mx-auto mt-5 w-75">
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group w-100">
            <label htmlFor="userid">UserName</label>
            <input
              type="text"
              id="userid"
              value={username}
              className="form-control mb-2"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter User Name"
            />
          </div>
          <div className="form-group w-100">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              className="form-control mb-2"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter Password"
            />
          </div>
          <button type="submit" className="btn btn-secondary form-control">
            LOGIN
          </button>
        </form>
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
};

export default Login;
