import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "Too short", color: "#ff5630" },
      { label: "Weak",      color: "#ff7452" },
      { label: "Fair",      color: "#ffab00" },
      { label: "Good",      color: "#36b37e" },
      { label: "Strong",    color: "#00b8d9" },
    ];
    return { score, ...map[score] };
  };

  const strength = getPasswordStrength(form.password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Send as JSON (no avatar) or multipart if avatar present
      if (avatar) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("avatar", avatar);
        await API.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/auth/register", form);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .su-root {
          min-height: 100vh; background: #0d1117;
          display: flex; font-family: 'Sora', sans-serif;
          overflow: hidden; position: relative;
        }

        /* ── animated background ── */
        .su-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(88,166,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,166,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove { 0%{background-position:0 0;} 100%{background-position:40px 40px;} }

        .su-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .su-orb-1 { width: 500px; height: 500px; background: #6554c0; opacity: 0.12; top: -160px; right: -120px; animation: o1 9s ease-in-out infinite; }
        .su-orb-2 { width: 420px; height: 420px; background: #0052cc; opacity: 0.12; bottom: -120px; left: -120px; animation: o2 11s ease-in-out infinite; }
        .su-orb-3 { width: 280px; height: 280px; background: #00b8d9; opacity: 0.10; top: 45%; left: 38%; animation: o3 7s ease-in-out infinite; }
        @keyframes o1 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-28px,36px);} }
        @keyframes o2 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(36px,-28px);} }
        @keyframes o3 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-18px,18px);} }

        /* ── left panel ── */
        .su-left {
          display: none; flex: 1; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 64px; position: relative; z-index: 1;
        }
        @media (min-width: 1024px) { .su-left { display: flex; } }

        .su-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 56px; }
        .su-logo {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(0,82,204,0.5);
        }
        .su-brand-name { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .su-brand-name span { color: #58a6ff; }

        .su-heading {
          font-size: clamp(34px, 3.2vw, 50px); font-weight: 800;
          color: #fff; line-height: 1.08; letter-spacing: -2px; margin-bottom: 18px;
        }
        .su-heading .ac { color: #00b8d9; }
        .su-sub { font-size: 15px; color: #7d8590; line-height: 1.75; max-width: 360px; margin-bottom: 44px; font-weight: 300; }

        .su-perks { display: flex; flex-direction: column; gap: 14px; }
        .su-perk {
          display: flex; align-items: center; gap: 14px;
          background: rgba(22,27,34,0.65); border: 1px solid rgba(88,166,255,0.1);
          border-radius: 14px; padding: 14px 18px;
          backdrop-filter: blur(10px); transition: border-color 0.2s;
        }
        .su-perk:hover { border-color: rgba(88,166,255,0.22); }
        .su-perk-icon {
          width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .pi-1 { background: rgba(0,82,204,0.18); }
        .pi-2 { background: rgba(101,84,192,0.18); }
        .pi-3 { background: rgba(0,184,217,0.18); }
        .pi-4 { background: rgba(63,185,80,0.18); }
        .su-perk-title { font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 1px; }
        .su-perk-sub   { font-size: 11px; color: #7d8590; }

        /* ── right / form ── */
        .su-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 36px 24px; position: relative; z-index: 1;
        }

        .su-card {
          width: 100%; max-width: 476px;
          background: rgba(22,27,34,0.88);
          border: 1px solid rgba(88,166,255,0.12);
          border-radius: 24px; padding: 42px 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03);
          animation: cardUp 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }

        /* avatar drop zone */
        .su-av-label {
          display: block; font-size: 10px; font-weight: 700; color: #7d8590;
          text-transform: uppercase; letter-spacing: 0.9px; margin-bottom: 9px;
        }
        .su-drop {
          border: 1.5px dashed rgba(88,166,255,0.2); border-radius: 14px;
          padding: 18px 16px; display: flex; align-items: center; gap: 14px;
          cursor: pointer; transition: all 0.22s; background: rgba(88,166,255,0.02);
          margin-bottom: 26px;
        }
        .su-drop:hover, .su-drop.drag { border-color: rgba(88,166,255,0.42); background: rgba(88,166,255,0.05); }
        .su-thumb {
          width: 54px; height: 54px; border-radius: 13px; flex-shrink: 0;
          background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.14);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .su-thumb-ring {
          position: absolute; inset: -2px; border-radius: 13px;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          opacity: 0; transition: opacity 0.2s;
        }
        .su-drop:hover .su-thumb-ring { opacity: 1; }
        .su-thumb-inner {
          position: absolute; inset: 2px; border-radius: 11px;
          background: #161b22; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .su-thumb-inner img { width: 100%; height: 100%; object-fit: cover; }
        .su-thumb-inner svg { width: 22px; height: 22px; color: #484f58; }
        .su-drop-info-title { font-size: 13px; font-weight: 600; color: #c9d1d9; margin-bottom: 2px; }
        .su-drop-info-sub   { font-size: 11px; color: #7d8590; }
        .su-drop-info-sub span { color: #58a6ff; }

        /* heading */
        .su-title { font-size: 25px; font-weight: 800; color: #e6edf3; letter-spacing: -0.9px; margin-bottom: 3px; }
        .su-subtitle { font-size: 13px; color: #7d8590; margin-bottom: 26px; }

        /* inputs */
        .su-group { margin-bottom: 14px; }
        .su-inp-label {
          display: block; font-size: 10px; font-weight: 700; color: #7d8590;
          text-transform: uppercase; letter-spacing: 0.9px; margin-bottom: 7px;
        }
        .su-inp-wrap { position: relative; display: flex; align-items: center; }
        .su-icon { position: absolute; left: 15px; color: #7d8590; pointer-events: none; transition: color 0.2s; }
        .su-icon svg { width: 15px; height: 15px; display: block; }
        .su-inp {
          width: 100%; padding: 13px 15px 13px 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(88,166,255,0.1);
          border-radius: 11px; color: #e6edf3; font-size: 13.5px;
          font-family: 'Sora', sans-serif; outline: none; transition: all 0.22s;
        }
        .su-inp::placeholder { color: #3d444d; }
        .su-inp:focus { border-color: rgba(88,166,255,0.48); background: rgba(88,166,255,0.05); box-shadow: 0 0 0 3px rgba(88,166,255,0.08); }
        .su-inp-wrap:focus-within .su-icon { color: #58a6ff; }

        .su-eye {
          position: absolute; right: 13px; background: none; border: none;
          color: #7d8590; cursor: pointer; padding: 4px; transition: color 0.2s;
          display: flex; align-items: center;
        }
        .su-eye:hover { color: #58a6ff; }
        .su-eye svg { width: 15px; height: 15px; }

        /* password strength */
        .su-pw-str { margin-top: 9px; }
        .su-pw-bars { display: flex; gap: 4px; margin-bottom: 5px; }
        .su-pw-bar { flex: 1; height: 3px; border-radius: 10px; background: rgba(255,255,255,0.06); transition: background 0.28s; }
        .su-pw-lbl { font-size: 10px; font-family: 'JetBrains Mono', monospace; }

        /* error banner */
        .su-error {
          background: rgba(255,86,48,0.1); border: 1px solid rgba(255,86,48,0.2);
          border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #ff7452;
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }
        .su-error svg { width: 14px; height: 14px; flex-shrink: 0; }

        /* terms */
        .su-terms { font-size: 11.5px; color: #7d8590; margin-bottom: 20px; line-height: 1.65; }
        .su-terms a { color: #58a6ff; text-decoration: none; }
        .su-terms a:hover { text-decoration: underline; }

        /* submit */
        .su-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #0052cc, #0065ff);
          border: none; border-radius: 11px; color: #fff;
          font-size: 14.5px; font-weight: 700; font-family: 'Sora', sans-serif;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.28s; letter-spacing: -0.2px;
          box-shadow: 0 4px 18px rgba(0,82,204,0.38);
        }
        .su-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #0065ff, #00b8d9);
          opacity: 0; transition: opacity 0.28s;
        }
        .su-btn:hover::before { opacity: 1; }
        .su-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,82,204,0.48); }
        .su-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .su-btn span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .su-spin {
          width: 17px; height: 17px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: suSpin 0.7s linear infinite; display: inline-block;
        }
        @keyframes suSpin { to { transform: rotate(360deg); } }

        .su-footer { text-align: center; margin-top: 22px; font-size: 13px; color: #7d8590; }
        .su-footer a { color: #58a6ff; font-weight: 600; text-decoration: none; margin-left: 5px; }
        .su-footer a:hover { opacity: 0.75; }

        /* divider */
        .su-divider {
          display: flex; align-items: center; gap: 10px; margin: 18px 0;
        }
        .su-div-line { flex: 1; height: 1px; background: rgba(88,166,255,0.08); }
        .su-div-txt { font-size: 10px; color: #484f58; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

        @media (max-width: 480px) { .su-card { padding: 30px 22px; } }
      `}</style>

      <div className="su-root">
        <div className="su-grid" />
        <div className="su-orb su-orb-1" />
        <div className="su-orb su-orb-2" />
        <div className="su-orb su-orb-3" />

        {/* ── Left panel ── */}
        <div className="su-left">
          <div className="su-brand">
            <div className="su-logo">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <rect x="3" y="3" width="7" height="14" rx="2" fill="white" opacity="0.9"/>
                <rect x="14" y="3" width="7" height="9" rx="2" fill="white" opacity="0.55"/>
              </svg>
            </div>
            <span className="su-brand-name">Task<span>Flow</span></span>
          </div>

          <h1 className="su-heading">
            Your team's<br />work in<br /><span className="ac">one place.</span>
          </h1>
          <p className="su-sub">
            Join thousands of teams using TaskFlow to ship faster and stay organized. Free forever — no card required.
          </p>

          <div className="su-perks">
            {[
              { icon: "⚡", cls: "pi-1", title: "Unlimited Boards", sub: "Create as many boards as you need" },
              { icon: "👥", cls: "pi-2", title: "Team Collaboration", sub: "Invite members and work together" },
              { icon: "🔔", cls: "pi-3", title: "Smart Notifications", sub: "Never miss a deadline again" },
              { icon: "✅", cls: "pi-4", title: "Owner-only Controls", sub: "Only you can edit your own tasks" },
            ].map(p => (
              <div className="su-perk" key={p.title}>
                <div className={`su-perk-icon ${p.cls}`}>{p.icon}</div>
                <div>
                  <div className="su-perk-title">{p.title}</div>
                  <div className="su-perk-sub">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right / Form ── */}
        <div className="su-right">
          <div className="su-card">
            <h2 className="su-title">Create account</h2>
            <p className="su-subtitle">Join TaskFlow — it's completely free</p>

            {/* Avatar upload */}
            <span className="su-av-label">Profile picture (optional)</span>
            <div
              className={`su-drop ${dragOver ? "drag" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleAvatarChange(e.dataTransfer.files[0]); }}
            >
              <div className="su-thumb">
                <div className="su-thumb-ring" />
                <div className="su-thumb-inner">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="preview" />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                  }
                </div>
              </div>
              <div>
                <div className="su-drop-info-title">
                  {avatarPreview ? "Photo selected ✓" : "Upload your photo"}
                </div>
                <div className="su-drop-info-sub">
                  <span>Click to browse</span> or drag & drop · PNG, JPG, max 5 MB
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => handleAvatarChange(e.target.files[0])} />
            </div>

            <form onSubmit={handleSignup}>
              {/* Full name */}
              <div className="su-group">
                <label className="su-inp-label">Full name</label>
                <div className="su-inp-wrap">
                  <span className="su-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input type="text" placeholder="Your full name" className="su-inp"
                    value={form.name} required
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              {/* Email */}
              <div className="su-group">
                <label className="su-inp-label">Email address</label>
                <div className="su-inp-wrap">
                  <span className="su-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input type="email" placeholder="you@example.com" className="su-inp"
                    value={form.email} required
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              {/* Password */}
              <div className="su-group">
                <label className="su-inp-label">Password</label>
                <div className="su-inp-wrap">
                  <span className="su-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                    className="su-inp" value={form.password} required
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="su-eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
                        </svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                    }
                  </button>
                </div>

                {form.password && (
                  <div className="su-pw-str">
                    <div className="su-pw-bars">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="su-pw-bar"
                          style={{ background: i <= strength.score ? strength.color : undefined }} />
                      ))}
                    </div>
                    <span className="su-pw-lbl" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="su-error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <p className="su-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>

              <button type="submit" className="su-btn" disabled={isLoading}>
                <span>
                  {isLoading
                    ? <><span className="su-spin" />Creating account…</>
                    : "Create my account"
                  }
                </span>
              </button>
            </form>

            <div className="su-divider">
              <div className="su-div-line" /><span className="su-div-txt">already a member?</span><div className="su-div-line" />
            </div>

            <div className="su-footer">
              Have an account?
              <Link to="/">Sign in instead</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;