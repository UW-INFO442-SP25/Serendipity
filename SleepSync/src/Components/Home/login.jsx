import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./login.css";
import landingImg from "../../assets/landing.jpg";
import TranslateToggle from "./TranslateToggle";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: username });
        await setDoc(doc(db, 'profiles', user.uid), {
          username: username,
          bio: '',
          createdAt: new Date().toISOString()
        });
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGuest = async () => {
    try {
      await signInAnonymously(auth);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Floating Google Translate */}
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
        <TranslateToggle />
      </div>

      {/* Logo Header */}
      <div className="login-header">
        <h2 className="login-logo">SleepSync</h2>
      </div>

      {/* Main Card Layout */}
      <div className="login-page-wrapper">
        <div className="login-card-wrapper">
          <div className="login-content">
            {/* Form Section */}
            <div className="login-form">
              <h1>{isLogin ? "Welcome back!" : "Create an Account"}</h1>
              {isLogin && (
                <p className="login-note">
                  Don’t want to log in? You can <strong>continue as a guest</strong> below to explore the app, 
                  but some features may be limited.
                </p>
              )}
              <form onSubmit={handleSubmit} aria-label="Login Form">
                <label className="login-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />

                {!isLogin && (
                  <>
                    <label className="login-label" htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      aria-required="true"
                    />
                  </>
                )}

                <label className="login-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />

                {error && <p className="error-msg" role="alert">{error}</p>}

                {isLogin && (
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={handleResetPassword}
                  >
                    Forgot password?
                  </button>
                )}

                <button type="submit" className="login-btn">
                  {isLogin ? "Log In" : "Sign Up"}
                </button>

                <p className="login-signup-text">
                  {isLogin ? (
                    <>Don’t have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign up!</a></>
                  ) : (
                    <>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Log in</a></>
                  )}
                </p>

                <button type="button" className="login-guest-btn" onClick={handleGuest}>
                  Continue as Guest
                </button>
              </form>
            </div>

            {/* Image Section */}
            <div className="login-image">
              <img src={landingImg} alt="Person sleeping with data charts" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
