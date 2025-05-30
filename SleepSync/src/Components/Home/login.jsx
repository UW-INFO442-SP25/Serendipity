import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import landingImg from "../../assets/landing.jpg";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login later
    navigate("/home");
  };

  const handleGuest = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="login-header">
        <div className="login-logo-wrapper">
          <h2 className="login-logo">SleepSync</h2>
        </div>
      </div>

      <div className="login-container">
        <div className="login-content">
          {/* Login form */}
          <div className="login-card">
            <h1>Welcome back!</h1>
            <p className="login-note">
              Don’t want to log in? You can <strong>continue as a guest</strong> below to explore the app, 
              but some features may be limited.
            </p>

            <form onSubmit={handleLogin}>
              <label className="login-label" htmlFor="email">Email or username</label>
              <input type="text" id="email" required />

              <label className="login-label" htmlFor="password">Password</label>
              <input type="password" id="password" required />

              <a href="#" className="login-forgot-link">Forgot password?</a>

              <button type="submit" className="login-btn">Log In</button>

              <p className="login-signup-text">
                Don’t have an account? <a href="#">Sign up!</a>
              </p>

              <button
                type="button"
                className="login-guest-btn"
                onClick={handleGuest}
              >
                Continue as Guest
              </button>
            </form>
          </div>

          <div className="login-image-card">
            <img src={landingImg} alt="Person sleeping with data charts" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
