import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    handle: '',
    country: '',
    state: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.handle,
          formData.name
        );
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="logo-emoji">🍕</span>
          <h1>FoodSocial</h1>
          <p>{isLogin ? 'Welcome back, foodie!' : 'Join the club.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="handle"
                  placeholder="@handle"
                  value={formData.handle}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 20px;
        }
        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 24px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo-emoji {
          font-size: 3rem;
          display: block;
          margin-bottom: 10px;
        }
        .auth-header h1 {
          font-size: 2rem;
          margin-bottom: 5px;
          background: linear-gradient(45deg, #FF4757, #FF6B81);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-header p {
          color: var(--text-secondary);
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-row {
          display: flex;
          gap: 10px;
        }
        .form-row .form-group {
          flex: 1;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }
        input:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: rgba(0, 0, 0, 0.4);
        }
        .btn-auth {
          width: 100%;
          padding: 12px;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          margin-top: 10px;
        }
        .btn-auth:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .auth-footer button {
          background: none;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .auth-footer button:hover {
          text-decoration: underline;
        }
        .auth-error {
            background-color: rgba(255, 71, 87, 0.1);
            color: #ff4757;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 0.9rem;
            border: 1px solid rgba(255, 71, 87, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Auth;
