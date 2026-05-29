import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleAvatarChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleAvatarChange(file);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      if (res.data.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #0d1117;
          display: flex;
          font-family: 'Sora', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Animated background grid */
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(88, 166, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88, 166, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 20s linear infinite;
        }
        @keyframes gridPan {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        /* Glowing orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: #0052cc;
          top: -150px; left: -150px;
          animation: float1 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: #00b8d9;
          bottom: -100px; right: -100px;
          animation: float2 10s ease-in-out infinite;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: #6554c0;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: float3 12s ease-in-out infinite;
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.05); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-45%, -55%) scale(1.15); }
        }

        /* Left panel */
        .left-panel {
          display: none;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 60px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) { .left-panel { display: flex; } }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
        }
        .logo-mark {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 82, 204, 0.5);
        }
        .logo-mark svg { width: 24px; height: 24px; }
        .brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .brand-name span { color: #58a6ff; }

        .hero-heading {
          font-size: clamp(36px, 3.5vw, 52px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 20px;
        }
        .hero-heading .accent { color: #58a6ff; }

        .hero-sub {
          font-size: 16px;
          color: #7d8590;
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 48px;
          font-weight: 300;
        }

        .feature-list { display: flex; flex-direction: column; gap: 16px; }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #c9d1d9;
          font-size: 14px;
          font-weight: 500;
        }
        .feature-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(0, 82, 204, 0.6);
        }

        /* Floating card preview */
        .card-preview {
          position: absolute;
          bottom: 60px;
          right: -20px;
          background: rgba(22, 27, 34, 0.9);
          border: 1px solid rgba(88, 166, 255, 0.15);
          border-radius: 16px;
          padding: 16px;
          width: 240px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: cardFloat 6s ease-in-out infinite;
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .card-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .card-tag {
          background: rgba(0, 82, 204, 0.2);
          color: #58a6ff;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-dots { display: flex; gap: 4px; }
        .card-dot { width: 4px; height: 4px; border-radius: 50%; background: #7d8590; }
        .card-title { font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 8px; }
        .card-progress-bar { height: 4px; background: rgba(88,166,255,0.15); border-radius: 20px; overflow: hidden; }
        .card-progress-fill { height: 100%; width: 65%; background: linear-gradient(90deg, #0052cc, #58a6ff); border-radius: 20px; }
        .card-avatars { display: flex; margin-top: 12px; }
        .mini-avatar {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 2px solid #0d1117;
          margin-left: -6px;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
        }
        .mini-avatar:first-child { margin-left: 0; }
        .mini-a1 { background: linear-gradient(135deg, #0052cc, #00b8d9); }
        .mini-a2 { background: linear-gradient(135deg, #6554c0, #8777d9); }
        .mini-a3 { background: linear-gradient(135deg, #ff5630, #ff7452); }

        /* Right panel — Form */
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        .form-card {
          width: 100%;
          max-width: 460px;
          background: rgba(22, 27, 34, 0.85);
          border: 1px solid rgba(88, 166, 255, 0.12);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Avatar upload zone */
        .avatar-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }
        .avatar-ring {
          position: relative;
          width: 88px;
          height: 88px;
          margin-bottom: 12px;
          cursor: pointer;
        }
        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0052cc, #00b8d9, #6554c0);
          animation: spinGradient 4s linear infinite;
        }
        @keyframes spinGradient {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .avatar-inner {
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: #161b22;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .avatar-ring:hover .avatar-inner { opacity: 0.85; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #7d8590;
        }
        .avatar-placeholder svg { width: 28px; height: 28px; opacity: 0.6; }
        .avatar-edit-badge {
          position: absolute;
          bottom: 0; right: 0;
          width: 26px; height: 26px;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          border: 2px solid #0d1117;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,82,204,0.5);
          transition: transform 0.2s ease;
        }
        .avatar-ring:hover .avatar-edit-badge { transform: scale(1.15); }
        .avatar-edit-badge svg { width: 12px; height: 12px; color: #fff; }
        .avatar-label { font-size: 12px; color: #7d8590; font-weight: 500; }

        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #e6edf3;
          letter-spacing: -1px;
          margin-bottom: 4px;
          text-align: center;
        }
        .form-sub {
          text-align: center;
          font-size: 13px;
          color: #7d8590;
          margin-bottom: 32px;
          font-weight: 400;
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #7d8590;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          color: #7d8590;
          pointer-events: none;
          transition: color 0.2s;
        }
        .input-icon svg { width: 16px; height: 16px; }
        .auth-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(88, 166, 255, 0.1);
          border-radius: 12px;
          color: #e6edf3;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .auth-input::placeholder { color: #484f58; }
        .auth-input:focus {
          border-color: rgba(88, 166, 255, 0.5);
          background: rgba(88, 166, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.08);
        }
        .auth-input:focus + .input-focused-label,
        .input-wrap:focus-within .input-icon { color: #58a6ff; }

        .toggle-pw {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #7d8590;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .toggle-pw:hover { color: #58a6ff; }
        .toggle-pw svg { width: 16px; height: 16px; }

        .forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #58a6ff;
          text-decoration: none;
          margin-top: 6px;
          margin-bottom: 24px;
          transition: opacity 0.2s;
          font-family: 'JetBrains Mono', monospace;
        }
        .forgot-link:hover { opacity: 0.7; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0052cc, #0065ff);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          letter-spacing: -0.3px;
          box-shadow: 0 4px 20px rgba(0, 82, 204, 0.4);
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0065ff, #00b8d9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0, 82, 204, 0.5); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn span { position: relative; z-index: 1; }

        /* Loading spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(88,166,255,0.08); }
        .divider-text { font-size: 11px; color: #484f58; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

        .social-btn {
          width: 100%;
          padding: 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(88,166,255,0.1);
          border-radius: 12px;
          color: #c9d1d9;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .social-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(88,166,255,0.2); }
        .social-btn svg { width: 18px; height: 18px; }

        .bottom-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #7d8590;
        }
        .bottom-link a {
          color: #58a6ff;
          font-weight: 600;
          text-decoration: none;
          margin-left: 6px;
          transition: opacity 0.2s;
        }
        .bottom-link a:hover { opacity: 0.75; }

        /* Drag drop zone */
        .drop-zone {
          border: 1.5px dashed rgba(88,166,255,0.2);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 24px;
          background: rgba(88,166,255,0.02);
        }
        .drop-zone.drag-active { border-color: #58a6ff; background: rgba(88,166,255,0.06); }
        .drop-zone-text { font-size: 12px; color: #7d8590; }
        .drop-zone-text span { color: #58a6ff; cursor: pointer; }
      `}</style>

      <div className="auth-root">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left decorative panel */}
        <div className="left-panel">
          <div className="brand-logo">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="14" rx="2" fill="white" opacity="0.9"/>
                <rect x="14" y="3" width="7" height="9" rx="2" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="brand-name">Task<span>Flow</span></span>
          </div>

          <h1 className="hero-heading">
            Boards that<br />
            <span className="accent">move</span> your<br />
            work forward.
          </h1>
          <p className="hero-sub">
            Organize projects, track progress, and collaborate with your team — all in one beautifully simple workspace.
          </p>

          <div className="feature-list">
            {["Drag-and-drop Kanban boards", "Real-time team collaboration", "Custom workflows & automation", "Deadline tracking & reminders"].map(f => (
              <div className="feature-item" key={f}>
                <div className="feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* Floating card */}
          <div className="card-preview">
            <div className="card-header-row">
              <span className="card-tag">In Progress</span>
              <div className="card-dots"><div className="card-dot"/><div className="card-dot"/><div className="card-dot"/></div>
            </div>
            <div className="card-title">Redesign dashboard UI</div>
            <div className="card-progress-bar"><div className="card-progress-fill"/></div>
            <div className="card-avatars">
              <div className="mini-avatar mini-a1">A</div>
              <div className="mini-avatar mini-a2">B</div>
              <div className="mini-avatar mini-a3">C</div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="right-panel">
          <div className="form-card">

            {/* Avatar upload */}
            <div className="avatar-zone">
              <div className="avatar-ring" onClick={() => fileInputRef.current?.click()}>
                <div className="avatar-inner">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" className="avatar-img" />
                    : <div className="avatar-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                  }
                </div>
                <div className="avatar-edit-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15.232 5.232l3.536 3.536M9 13l-4 1 1-4 9.5-9.5a2 2 0 012.83 0l.67.67a2 2 0 010 2.83L9 13z"/>
                  </svg>
                </div>
              </div>
              <span className="avatar-label">{avatarPreview ? "Change photo" : "Upload photo"}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleAvatarChange(e.target.files[0])}
              />
            </div>

            <h2 className="form-title">Welcome back</h2>
            <p className="form-sub">Sign in to your TaskFlow workspace</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label className="input-label">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="auth-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="auth-input"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                <span>{isLoading ? <span className="spinner" /> : "Sign in to TaskFlow"}</span>
              </button>

              <div className="divider">
                <div className="divider-line"/>
                <span className="divider-text">or</span>
                <div className="divider-line"/>
              </div>

              <button type="button" className="social-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="bottom-link">
              Don't have an account?
              <Link to="/signup">Create one free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;