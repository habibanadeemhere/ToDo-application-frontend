import { useEffect, useState, useRef, useCallback } from "react";
import API from "../services/api";

// ─── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, sub }) => (
  <div style={{
    background: "rgba(22,27,34,0.85)", border: `1px solid ${accent}22`,
    borderRadius: "16px", padding: "20px 24px", backdropFilter: "blur(16px)",
    display: "flex", alignItems: "center", gap: "16px",
    boxShadow: `0 4px 24px rgba(0,0,0,0.2)`, transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${accent}33`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.2)`; }}
  >
    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${accent}18`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: "#e6edf3", lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#7d8590", marginTop: "4px", fontWeight: "500" }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: accent, marginTop: "2px", fontWeight: "600" }}>{sub}</div>}
    </div>
  </div>
);

// ─── Confirm Modal ───────────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel, danger }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
    <div style={{ width: "100%", maxWidth: "380px", background: "rgba(22,27,34,0.98)", border: `1px solid ${danger ? "rgba(255,86,48,0.2)" : "rgba(88,166,255,0.15)"}`, borderRadius: "20px", padding: "32px 28px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", textAlign: "center" }}>
      <div style={{ fontSize: "36px", marginBottom: "16px" }}>{danger ? "⚠️" : "❓"}</div>
      <p style={{ fontSize: "14px", color: "#e6edf3", fontWeight: "600", marginBottom: "8px", lineHeight: "1.5" }}>{message}</p>
      <p style={{ fontSize: "12px", color: "#7d8590", marginBottom: "24px" }}>This action cannot be undone.</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#c9d1d9", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: danger ? "linear-gradient(135deg,#ff5630,#ff3010)" : "linear-gradient(135deg,#0052cc,#0065ff)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Confirm</button>
      </div>
    </div>
  </div>
);

// ─── Edit User Modal ─────────────────────────────────────────────────────────────
const EditUserModal = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "rgba(22,27,34,0.98)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "20px", padding: "32px 28px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
        <div style={{ fontSize: "18px", fontWeight: "800", color: "#e6edf3", marginBottom: "6px" }}>✏️ Edit User</div>
        <div style={{ fontSize: "12px", color: "#7d8590", marginBottom: "24px" }}>Update details for {user.name}</div>
        {[["Full name", "name", "text"], ["Email address", "email", "email"]].map(([lbl, key, type]) => (
          <div key={key} style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{lbl}</label>
            <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "10px", padding: "10px 14px", color: "#e6edf3", fontSize: "13px", fontFamily: "Sora, sans-serif", outline: "none" }} />
          </div>
        ))}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{ width: "100%", background: "#161b22", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "10px", padding: "10px 14px", color: "#c9d1d9", fontSize: "13px", fontFamily: "Sora, sans-serif", outline: "none" }}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#c9d1d9", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Cancel</button>
          <button onClick={() => onSave(user._id, form)} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#0052cc,#0065ff)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── User Detail Drawer ──────────────────────────────────────────────────────────
const UserDrawer = ({ user, tasks, onClose, onMakeAdmin, onDelete }) => {
  const userTasks = tasks.filter(t => {
    const tid = typeof t.user === "object" ? t.user?._id : t.user;
    const aid = typeof t.assignedTo === "object" ? t.assignedTo?._id : t.assignedTo;
    return String(tid) === String(user._id) || String(aid) === String(user._id);
  });
  const todo = userTasks.filter(t => t.status === "todo").length;
  const inprog = userTasks.filter(t => t.status === "inprogress").length;
  const done = userTasks.filter(t => t.status === "done").length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "420px", height: "100%", background: "rgba(13,17,23,0.98)", borderLeft: "1px solid rgba(88,166,255,0.12)", overflowY: "auto", animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}`}</style>

        {/* header */}
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(88,166,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#0052cc,#00b8d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", color: "#fff", boxShadow: "0 0 0 3px rgba(88,166,255,0.2)", flexShrink: 0 }}>
              {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#e6edf3" }}>{user.name}</div>
              <div style={{ fontSize: "12px", color: "#7d8590", marginTop: "2px" }}>{user.email}</div>
              <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", marginTop: "6px", display: "inline-block", background: user.role === "admin" ? "rgba(255,171,0,0.12)" : "rgba(88,166,255,0.1)", color: user.role === "admin" ? "#ffab00" : "#58a6ff", border: `1px solid ${user.role === "admin" ? "rgba(255,171,0,0.2)" : "rgba(88,166,255,0.2)"}` }}>{user.role?.toUpperCase()}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "4px" }}>×</button>
        </div>

        {/* stats */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(88,166,255,0.08)" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>Task Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[["To Do", todo, "#ffab00"], ["In Progress", inprog, "#58a6ff"], ["Done", done, "#3fb950"]].map(([label, count, color]) => (
              <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color, letterSpacing: "-1px" }}>{count}</div>
                <div style={{ fontSize: "10px", color: "#7d8590", marginTop: "2px", fontWeight: "500" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* tasks list */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(88,166,255,0.08)" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>Recent Tasks ({userTasks.length})</div>
          {userTasks.length === 0
            ? <div style={{ fontSize: "12px", color: "#484f58", textAlign: "center", padding: "20px 0" }}>No tasks yet</div>
            : userTasks.slice(0, 6).map(t => {
                const statusColor = t.status === "done" ? "#3fb950" : t.status === "inprogress" ? "#58a6ff" : "#ffab00";
                return (
                  <div key={t._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: "1px solid rgba(88,166,255,0.05)" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "#c9d1d9", flex: 1 }}>{t.title}</span>
                    {t.priority && <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "10px", background: t.priority === "high" ? "rgba(255,86,48,0.1)" : t.priority === "medium" ? "rgba(255,171,0,0.1)" : "rgba(63,185,80,0.1)", color: t.priority === "high" ? "#ff5630" : t.priority === "medium" ? "#ffab00" : "#3fb950" }}>{t.priority}</span>}
                  </div>
                );
              })
          }
        </div>

        {/* meta */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(88,166,255,0.08)" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>Account Info</div>
          {[["Member since", user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"], ["User ID", user._id?.slice(-8) + "…"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#7d8590" }}>{k}</span>
              <span style={{ fontSize: "12px", color: "#c9d1d9", fontWeight: "500" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {user.role !== "admin" && (
            <button onClick={() => onMakeAdmin(user._id)} style={{ width: "100%", padding: "12px", background: "rgba(255,171,0,0.1)", border: "1px solid rgba(255,171,0,0.2)", borderRadius: "10px", color: "#ffab00", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>⭐ Promote to Admin</button>
          )}
          <button onClick={() => onDelete(user._id)} style={{ width: "100%", padding: "12px", background: "rgba(255,86,48,0.1)", border: "1px solid rgba(255,86,48,0.2)", borderRadius: "10px", color: "#ff7452", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>🗑️ Delete User</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin ──────────────────────────────────────────────────────────────────
function Admin() {
  const [users, setUsers]           = useState([]);
  const [tasks, setTasks]           = useState([]);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy]         = useState("name");
  const [toasts, setToasts]         = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editUser, setEditUser]     = useState(null);
  const [drawerUser, setDrawerUser] = useState(null);
  const [activeTab, setActiveTab]   = useState("users"); // users | tasks | overview
  const [loading, setLoading]       = useState(true);
  const searchRef = useRef(null);

  const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchUsers = useCallback(async () => {
    try { const res = await API.get("/admin/users"); setUsers(res.data); } catch { addToast("Failed to load users", "error"); }
  }, []);

  const fetchTasks = useCallback(async () => {
    try { const res = await API.get("/tasks"); setTasks(res.data.tasks || res.data); } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchTasks()]).finally(() => setLoading(false));
  }, []);

  // ── actions ──────────────────────────────────────────────────────────────────
  const deleteUser = (id) => {
    setConfirmModal({ message: "Are you sure you want to delete this user? All their data will be removed.", danger: true, onConfirm: async () => {
      try { await API.delete(`/admin/users/${id}`); await fetchUsers(); setDrawerUser(null); setConfirmModal(null); addToast("🗑️ User deleted"); } catch { addToast("Failed to delete user", "error"); setConfirmModal(null); }
    }});
  };

  const makeAdmin = async (id) => {
    try { await API.put(`/admin/make-admin/${id}`); await fetchUsers(); addToast("⭐ User promoted to Admin"); if (drawerUser?._id === id) setDrawerUser(prev => ({ ...prev, role: "admin" })); } catch { addToast("Failed to update role", "error"); }
  };

  const demoteUser = async (id) => {
    try { await API.put(`/admin/demote/${id}`); await fetchUsers(); addToast("👤 Admin demoted to User"); } catch { addToast("Failed to demote", "error"); }
  };

  const saveUser = async (id, form) => {
    try { await API.put(`/admin/users/${id}`, form); await fetchUsers(); setEditUser(null); addToast("✅ User updated"); } catch { addToast("Failed to update", "error"); }
  };

  const deleteTask = (id) => {
    setConfirmModal({ message: "Delete this task permanently?", danger: true, onConfirm: async () => {
      try { await API.delete(`/tasks/${id}`); await fetchTasks(); setConfirmModal(null); addToast("🗑️ Task deleted"); } catch { addToast("Failed", "error"); setConfirmModal(null); }
    }});
  };

  // ── filter / sort ─────────────────────────────────────────────────────────────
  const filteredUsers = users
    .filter(u => (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) && (!roleFilter || u.role === roleFilter))
    .sort((a, b) => sortBy === "name" ? a.name?.localeCompare(b.name) : new Date(b.createdAt) - new Date(a.createdAt));

  // ── stats ─────────────────────────────────────────────────────────────────────
  const totalUsers  = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalTasks  = tasks.length;
  const doneTasks   = tasks.filter(t => t.status === "done").length;
  const highPrio    = tasks.filter(t => t.priority === "high").length;
  const overdue     = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;

  const userInitial = (currentAdmin.name || "A")[0].toUpperCase();
  const userAvatar  = currentAdmin.avatar || null;

  const tabStyle = (tab) => ({
    padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontFamily: "Sora, sans-serif",
    fontSize: "13px", fontWeight: "600", border: "none", transition: "all 0.2s",
    background: activeTab === tab ? "linear-gradient(135deg, #0052cc, #0065ff)" : "rgba(255,255,255,0.04)",
    color: activeTab === tab ? "#fff" : "#7d8590",
    boxShadow: activeTab === tab ? "0 2px 12px rgba(0,82,204,0.35)" : "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #0d1117; }
        .dash-root { min-height: 100vh; background: #0d1117; color: #e6edf3; font-family: 'Sora', sans-serif; }
        .bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }

        .navbar { position: sticky; top: 0; z-index: 100; height: 64px; background: rgba(13,17,23,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(88,166,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .nav-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #0052cc, #00b8d9); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(0,82,204,0.4); }
        .nav-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .nav-title span { color: #58a6ff; }
        .nav-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; background: rgba(255,171,0,0.12); color: #ffab00; border: 1px solid rgba(255,171,0,0.2); margin-left: 4px; }

        .uav { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #0052cc, #00b8d9); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; box-shadow: 0 0 0 2px rgba(88,166,255,0.3); }
        .uav img { width: 100%; height: 100%; object-fit: cover; }
        .logout-btn { padding: 7px 16px; background: rgba(255,86,48,0.1); border: 1px solid rgba(255,86,48,0.2); border-radius: 8px; color: #ff7452; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .logout-btn:hover { background: rgba(255,86,48,0.18); }

        .main-content { position: relative; z-index: 1; padding: 28px 32px; }

        /* stats grid */
        .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 28px; }
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

        /* tabs */
        .tabs { display: flex; gap: 8px; margin-bottom: 24px; }

        /* filter row */
        .filter-row { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 220px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #7d8590; pointer-events: none; }
        .search-input { width: 100%; background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1); border-radius: 10px; padding: 10px 12px 10px 36px; color: #e6edf3; font-size: 13px; font-family: 'Sora', sans-serif; outline: none; transition: all 0.2s; }
        .search-input::placeholder { color: #484f58; }
        .search-input:focus { border-color: rgba(88,166,255,0.35); background: rgba(88,166,255,0.04); }
        .filter-sel { background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1); border-radius: 10px; padding: 10px 12px; color: #c9d1d9; font-size: 12px; font-family: 'Sora', sans-serif; outline: none; cursor: pointer; }
        .count-badge { font-size: 11px; color: "#7d8590"; background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.12); border-radius: 20px; padding: "3px 10px"; }

        /* table */
        .table-card { background: rgba(22,27,34,0.75); border: 1px solid rgba(88,166,255,0.08); border-radius: 18px; overflow: hidden; backdrop-filter: blur(16px); }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: rgba(88,166,255,0.04); }
        th { text-align: left; padding: 14px 18px; font-size: 11px; color: "#7d8590"; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; white-space: nowrap; }
        td { padding: 14px 18px; border-top: 1px solid rgba(88,166,255,0.05); font-size: 13px; vertical-align: middle; }
        tr:hover td { background: rgba(88,166,255,0.025); }
        .role-badge { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .role-admin { background: rgba(255,171,0,0.12); color: #ffab00; border: 1px solid rgba(255,171,0,0.2); }
        .role-user  { background: rgba(88,166,255,0.1);  color: #58a6ff;  border: 1px solid rgba(88,166,255,0.2); }
        .priority-badge { padding: 2px 7px; border-radius: 20px; font-size: 10px; font-weight: 600; }

        /* action buttons */
        .act-btn { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 700; font-family: 'Sora', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .act-btn:hover { transform: translateY(-1px); }
        .btn-view   { background: rgba(88,166,255,0.1);  color: #58a6ff;  border: 1px solid rgba(88,166,255,0.2); }
        .btn-edit   { background: rgba(101,84,192,0.1);  color: #8777d9;  border: 1px solid rgba(101,84,192,0.2); }
        .btn-admin  { background: rgba(255,171,0,0.1);   color: #ffab00;  border: 1px solid rgba(255,171,0,0.2); }
        .btn-demote { background: rgba(255,171,0,0.08);  color: "#7d8590"; border: 1px solid rgba(255,255,255,0.08); }
        .btn-delete { background: rgba(255,86,48,0.1);   color: #ff7452;  border: 1px solid rgba(255,86,48,0.2); }

        /* overview chart-like bars */
        .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bar-label { font-size: 12px; color: "#7d8590"; width: 100px; flex-shrink: 0; }
        .bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 20px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
        .bar-val { font-size: 12px; color: "#e6edf3"; font-weight: "600"; width: 30px; text-align: right; flex-shrink: 0; }

        /* loading */
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

        /* toasts */
        .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
        .toast { padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; color: #e6edf3; backdrop-filter: blur(20px); border: 1px solid rgba(88,166,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1); background: rgba(22,27,34,0.97); min-width: 220px; }
        .toast.error { border-color: rgba(255,86,48,0.25); }
        @keyframes toastIn { from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);} }

        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state { text-align: center; padding: 60px 20px; color: #484f58; font-size: 13px; }
        .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
      `}</style>

      <div className="dash-root">
        <div className="bg-grid" />

        {/* modals */}
        {confirmModal && <ConfirmModal message={confirmModal.message} danger={confirmModal.danger} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(null)} />}
        {editUser && <EditUserModal user={editUser} onSave={saveUser} onCancel={() => setEditUser(null)} />}
        {drawerUser && <UserDrawer user={drawerUser} tasks={tasks} onClose={() => setDrawerUser(null)} onMakeAdmin={(id) => { makeAdmin(id); setDrawerUser(null); }} onDelete={(id) => { setDrawerUser(null); deleteUser(id); }} />}

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="14" rx="2" fill="white" opacity="0.9"/><rect x="14" y="3" width="7" height="9" rx="2" fill="white" opacity="0.6"/></svg>
            </div>
            <span className="nav-title">Task<span>Flow</span></span>
            <span className="nav-badge">ADMIN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="uav">{userAvatar ? <img src={userAvatar} alt="" /> : userInitial}</div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#c9d1d9" }}>{currentAdmin.name}</span>
            </div>
            <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="main-content">

          {/* ── Page heading ── */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#e6edf3", letterSpacing: "-1px" }}>Admin <span style={{ color: "#58a6ff" }}>Dashboard</span></h1>
              <p style={{ fontSize: "13px", color: "#7d8590", marginTop: "4px" }}>Manage users, tasks, and workspace settings</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { fetchUsers(); fetchTasks(); addToast("🔄 Refreshed"); }} style={{ padding: "8px 16px", background: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "10px", color: "#58a6ff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>↻ Refresh</button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            <StatCard icon="👥" label="Total Users" value={totalUsers} accent="#58a6ff" sub={`${totalAdmins} admin${totalAdmins !== 1 ? "s" : ""}`} />
            <StatCard icon="⭐" label="Admins" value={totalAdmins} accent="#ffab00" />
            <StatCard icon="📋" label="Total Tasks" value={totalTasks} accent="#6554c0" />
            <StatCard icon="✅" label="Completed" value={doneTasks} accent="#3fb950" sub={totalTasks ? `${Math.round(doneTasks / totalTasks * 100)}% done` : "—"} />
            <StatCard icon="🔴" label="High Priority" value={highPrio} accent="#ff5630" />
            <StatCard icon="⚠️" label="Overdue" value={overdue} accent="#ff7452" sub={overdue > 0 ? "needs attention" : "all on track"} />
          </div>

          {/* ── Tabs ── */}
          <div className="tabs">
            {[["users", "👥 Users"], ["tasks", "📋 Tasks"], ["overview", "📊 Overview"]].map(([key, label]) => (
              <button key={key} style={tabStyle(key)} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
          </div>

          {/* ═══════════ USERS TAB ═══════════ */}
          {activeTab === "users" && (
            <>
              <div className="filter-row">
                <div className="search-wrap">
                  <span className="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                  <input ref={searchRef} className="search-input" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="filter-sel" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <select className="filter-sel" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort: Name</option>
                  <option value="date">Sort: Newest</option>
                </select>
                <span style={{ fontSize: "12px", color: "#7d8590", padding: "10px 12px", background: "rgba(88,166,255,0.06)", border: "1px solid rgba(88,166,255,0.1)", borderRadius: "10px" }}>
                  {filteredUsers.length} of {users.length}
                </span>
              </div>

              <div className="table-card">
                <div className="table-scroll">
                  {loading ? (
                    <div style={{ padding: "20px" }}>
                      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "52px", marginBottom: "8px" }} />)}
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="empty-state"><div className="icon">🔍</div><div>No users match your search</div></div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ color: "#7d8590" }}>User</th>
                          <th style={{ color: "#7d8590" }}>Role</th>
                          <th style={{ color: "#7d8590" }}>Tasks</th>
                          <th style={{ color: "#7d8590" }}>Joined</th>
                          <th style={{ color: "#7d8590" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => {
                          const utasks = tasks.filter(t => {
                            const tid = typeof t.user === "object" ? t.user?._id : t.user;
                            const aid = typeof t.assignedTo === "object" ? t.assignedTo?._id : t.assignedTo;
                            return String(tid) === String(user._id) || String(aid) === String(user._id);
                          });
                          const isSelf = String(user._id) === String(currentAdmin._id || currentAdmin.id);
                          return (
                            <tr key={user._id} onClick={() => setDrawerUser(user)} style={{ cursor: "pointer" }}>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#0052cc,#00b8d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                                    {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: "600", color: "#e6edf3", fontSize: "13px" }}>{user.name} {isSelf && <span style={{ fontSize: "10px", color: "#58a6ff" }}>(you)</span>}</div>
                                    <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "1px" }}>{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                              <td>
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#e6edf3" }}>{utasks.length}</span>
                                  {utasks.length > 0 && <span style={{ fontSize: "11px", color: "#7d8590" }}>({utasks.filter(t => t.status === "done").length} done)</span>}
                                </div>
                              </td>
                              <td style={{ fontSize: "12px", color: "#7d8590" }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                              <td onClick={e => e.stopPropagation()}>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <button className="act-btn btn-view" onClick={() => setDrawerUser(user)}>View</button>
                                  <button className="act-btn btn-edit" onClick={() => setEditUser(user)}>Edit</button>
                                  {user.role !== "admin" ? (
                                    <button className="act-btn btn-admin" onClick={() => makeAdmin(user._id)}>⭐ Admin</button>
                                  ) : !isSelf && (
                                    <button className="act-btn btn-demote" style={{ color: "#7d8590", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => demoteUser(user._id)}>Demote</button>
                                  )}
                                  {!isSelf && <button className="act-btn btn-delete" onClick={() => deleteUser(user._id)}>Delete</button>}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ═══════════ TASKS TAB ═══════════ */}
          {activeTab === "tasks" && (
            <>
              <div className="filter-row">
                <div className="search-wrap">
                  <span className="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                  <input className="search-input" placeholder="Search tasks…" onChange={(e) => setSearch(e.target.value)} />
                </div>
                <span style={{ fontSize: "12px", color: "#7d8590", padding: "10px 12px", background: "rgba(88,166,255,0.06)", border: "1px solid rgba(88,166,255,0.1)", borderRadius: "10px" }}>
                  {tasks.filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase())).length} tasks
                </span>
              </div>

              <div className="table-card">
                <div className="table-scroll">
                  {loading ? (
                    <div style={{ padding: "20px" }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "52px", marginBottom: "8px" }} />)}</div>
                  ) : tasks.filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                    <div className="empty-state"><div className="icon">📋</div><div>No tasks found</div></div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ color: "#7d8590" }}>Task</th>
                          <th style={{ color: "#7d8590" }}>Status</th>
                          <th style={{ color: "#7d8590" }}>Priority</th>
                          <th style={{ color: "#7d8590" }}>Created By</th>
                          <th style={{ color: "#7d8590" }}>Assigned To</th>
                          <th style={{ color: "#7d8590" }}>Due Date</th>
                          <th style={{ color: "#7d8590" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase())).map(task => {
                          const statusMap = { todo: { color: "#ffab00", bg: "rgba(255,171,0,0.1)", border: "rgba(255,171,0,0.2)", label: "To Do" }, inprogress: { color: "#58a6ff", bg: "rgba(88,166,255,0.1)", border: "rgba(88,166,255,0.2)", label: "In Progress" }, done: { color: "#3fb950", bg: "rgba(63,185,80,0.1)", border: "rgba(63,185,80,0.2)", label: "Done" } };
                          const prioMap = { high: { color: "#ff5630", bg: "rgba(255,86,48,0.1)" }, medium: { color: "#ffab00", bg: "rgba(255,171,0,0.1)" }, low: { color: "#3fb950", bg: "rgba(63,185,80,0.1)" } };
                          const s = statusMap[task.status] || statusMap.todo;
                          const p = prioMap[task.priority] || prioMap.medium;
                          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
                          return (
                            <tr key={task._id}>
                              <td>
                                <div style={{ fontWeight: "600", color: "#e6edf3", fontSize: "13px", maxWidth: "200px" }}>{task.title}</div>
                                {task.description && <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{task.description}</div>}
                              </td>
                              <td><span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 9px", borderRadius: "20px", color: s.color, background: s.bg, border: `1px solid ${s.border}`, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</span></td>
                              <td><span className="priority-badge" style={{ color: p.color, background: p.bg }}>{task.priority || "medium"}</span></td>
                              <td style={{ fontSize: "12px", color: "#c9d1d9" }}>{task.user?.name || "—"}</td>
                              <td style={{ fontSize: "12px", color: "#c9d1d9" }}>{task.assignedTo?.name || <span style={{ color: "#484f58" }}>Unassigned</span>}</td>
                              <td style={{ fontSize: "12px", color: isOverdue ? "#ff5630" : "#7d8590", fontWeight: isOverdue ? "600" : "400" }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}{isOverdue && " ⚠"}</td>
                              <td><button className="act-btn btn-delete" onClick={() => deleteTask(task._id)}>Delete</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* task status distribution */}
              {[
                { title: "📊 Task Status Distribution", rows: [
                  ["To Do",      tasks.filter(t => t.status === "todo").length,      "#ffab00"],
                  ["In Progress",tasks.filter(t => t.status === "inprogress").length,"#58a6ff"],
                  ["Done",       tasks.filter(t => t.status === "done").length,      "#3fb950"],
                ]},
                { title: "🔥 Priority Breakdown", rows: [
                  ["High",   tasks.filter(t => t.priority === "high").length,   "#ff5630"],
                  ["Medium", tasks.filter(t => t.priority === "medium").length, "#ffab00"],
                  ["Low",    tasks.filter(t => t.priority === "low").length,    "#3fb950"],
                ]},
                { title: "👥 User Distribution", rows: [
                  ["Admin users", users.filter(u => u.role === "admin").length, "#ffab00"],
                  ["Regular users", users.filter(u => u.role === "user").length, "#58a6ff"],
                ]},
                { title: "⏰ Deadline Health", rows: [
                  ["Overdue",    tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length, "#ff5630"],
                  ["Due < 3d",   tasks.filter(t => { if (!t.dueDate || t.status === "done") return false; const d = Math.ceil((new Date(t.dueDate)-new Date())/(1000*60*60*24)); return d >= 0 && d <= 3; }).length, "#ffab00"],
                  ["On track",   tasks.filter(t => { if (!t.dueDate || t.status === "done") return false; const d = Math.ceil((new Date(t.dueDate)-new Date())/(1000*60*60*24)); return d > 3; }).length, "#3fb950"],
                  ["No due date",tasks.filter(t => !t.dueDate).length, "#484f58"],
                ]},
              ].map(card => {
                const max = Math.max(...card.rows.map(r => r[1]), 1);
                return (
                  <div key={card.title} style={{ background: "rgba(22,27,34,0.75)", border: "1px solid rgba(88,166,255,0.08)", borderRadius: "18px", padding: "24px", backdropFilter: "blur(16px)" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3", marginBottom: "20px" }}>{card.title}</div>
                    {card.rows.map(([label, count, color]) => (
                      <div key={label} className="bar-row">
                        <div className="bar-label" style={{ fontSize: "12px", color: "#7d8590", width: "110px" }}>{label}</div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${(count / max) * 100}%`, background: color }} />
                        </div>
                        <div className="bar-val" style={{ fontSize: "13px", color: "#e6edf3", fontWeight: "700", width: "30px", textAlign: "right" }}>{count}</div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* top contributors */}
              <div style={{ background: "rgba(22,27,34,0.75)", border: "1px solid rgba(88,166,255,0.08)", borderRadius: "18px", padding: "24px", backdropFilter: "blur(16px)", gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3", marginBottom: "20px" }}>🏆 Top Contributors</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                  {users.sort((a, b) => {
                    const ta = tasks.filter(t => { const tid = typeof t.user === "object" ? t.user?._id : t.user; return String(tid) === String(a._id); }).length;
                    const tb = tasks.filter(t => { const tid = typeof t.user === "object" ? t.user?._id : t.user; return String(tid) === String(b._id); }).length;
                    return tb - ta;
                  }).slice(0, 6).map((user, i) => {
                    const utasks = tasks.filter(t => { const tid = typeof t.user === "object" ? t.user?._id : t.user; return String(tid) === String(user._id); });
                    const medals = ["🥇","🥈","🥉"];
                    return (
                      <div key={user._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(88,166,255,0.08)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => setDrawerUser(user)}>
                        <div style={{ fontSize: "18px" }}>{medals[i] || "👤"}</div>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#0052cc,#00b8d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#fff" }}>
                          {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: "#e6edf3" }}>{user.name}</div>
                          <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "2px" }}>{utasks.length} tasks</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* toasts */}
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>{t.msg}</div>)}
        </div>
      </div>
    </>
  );
}

export default Admin;