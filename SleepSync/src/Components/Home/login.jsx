import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./login.css";
import landingImg from "../../assets/landing.jpg";

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

  return (
    <>
      <div className="login-header">
        <div className="login-logo-wrapper">
          <h2 className="login-logo">SleepSync</h2>
        </div>
      </div>

      <div className="login-container">
        <div className="login-content">
          {/* Form card */}
          <div className="login-card">
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

              {isLogin ? (
                <>
                  <a href="#" className="login-forgot-link">Forgot password?</a>
                  <button type="submit" className="login-btn">Log In</button>
                </>
              ) : (
                <button type="submit" className="login-btn">Sign Up</button>
              )}

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

          <div className="login-image-card">
            <img src={landingImg} alt="Person sleeping with data charts" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
