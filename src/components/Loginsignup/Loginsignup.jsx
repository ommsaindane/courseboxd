import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loginsignup.css';

const Loginsignup = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = action === "Login" ? '/api/login' : '/api/signup';

    const payload = {
      email,
      password,
      ...(action === "Sign Up" && { username })
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({
        token: data.token,
        user: data.user
        }));
        setResponseMsg(data.message);
        navigate('/home');
      } else {
        setResponseMsg(data.error || "Something went wrong");
      }
    } catch (err) {
      setResponseMsg("Server error");
    }
  };

  const handleActionClick = (selectedAction) => {
    if (selectedAction === action) {
      handleSubmit();
    } else {
      setAction(selectedAction);
      setResponseMsg('');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return setResetMsg("Please enter your email");

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      setResetMsg(res.ok ? data.message : data.error || "Something went wrong");
    } catch (err) {
      setResetMsg("Server error");
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>

      <div className='inputs'>
        {action === "Sign Up" && (
          <div className='input'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div className='input'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='input'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {action === "Login" && (
        <div className="forgot-password">
          <span onClick={() => setShowForgotPopup(true)}>Forgot password?</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => handleActionClick("Sign Up")}
        >
          Sign up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => handleActionClick("Login")}
        >
          Login
        </div>
      </div>

      {responseMsg && (
        <p style={{ marginTop: '10px', color: 'white' }}>{responseMsg}</p>
      )}

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Send Reset Link</button>
            <button className="close-btn" onClick={() => {
              setShowForgotPopup(false);
              setResetMsg('');
              setResetEmail('');
            }}>Close</button>
            {resetMsg && <p className="popup-message">{resetMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Loginsignup;