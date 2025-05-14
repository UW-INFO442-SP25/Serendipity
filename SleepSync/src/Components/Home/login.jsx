import React from "react";
import "./login.css";
import landingImg from "../../assets/landing.jpg";

const Login = () => {
  return (
    <>
      {/* Full-width header with logo */}
      <div className="login-header">
        <div className="login-logo-wrapper">
        <h2 className="login-logo">SleepSync</h2>
        </div>
      </div>

      {/* Page content */}
      <div className="login-container">
        {/* Form and image section */}
        <div className="login-content">
          {/* Login form */}
          <div className="login-card">
            <h1>Welcome back!</h1>
            <p>Please enter your details here</p>

            <form>
              <label className="login-label" htmlFor="email">Email or username</label>
              <input type="text" id="email" required />

              <label className="login-label" htmlFor="password">Password</label>
              <input type="password" id="password" required />

              <a href="#" className="login-forgot-link">Forgot password?</a>

              <button type="submit" className="login-btn">Log In</button>

              <p className="login-signup-text">
                Don’t have an account? <a href="#">Sign up!</a>
              </p>

              <button type="button" className="login-guest-btn">Continue as Guest</button>
            </form>
          </div>

          {/* Image section */}
          <div className="login-image-card">
            <img src={landingImg} alt="Person sleeping with data charts" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
