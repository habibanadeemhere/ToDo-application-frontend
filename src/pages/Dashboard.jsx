import { useEffect, useState, useRef, useCallback } from "react";
import API from "../services/api";


const EditCard = ({ task, col, initialImagePreview, onSave, onCancel }) => {
  const titleRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(initialImagePreview || null);

  const [localForm, setLocalForm] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  useEffect(() => {
    
    const t = setTimeout(() => titleRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);


  const handleSave = () => onSave(task._id, localForm, editImage);

  return (
    <div style={{
      background: "rgba(30,36,46,0.98)",
      border: `1px solid ${col.accentBorder}`,
      borderRadius: "14px",
      padding: "16px",
      marginBottom: "12px",
      boxShadow: `0 0 0 2px ${col.accent}22`,
    }}>
      <input
        ref={titleRef}
        value={localForm.title}
        onChange={(e) => setLocalForm({ ...localForm, title: e.target.value })}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)",
          border: `1px solid ${col.accentBorder}`, borderRadius: "8px",
          padding: "8px 12px", color: "#e6edf3", fontSize: "13px",
          fontFamily: "Sora, sans-serif", outline: "none", marginBottom: "8px",
        }}
        placeholder="Task title"
      />
      <textarea
        value={localForm.description}
        onChange={(e) => setLocalForm({ ...localForm, description: e.target.value })}
        rows={2}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)",
          border: `1px solid ${col.accentBorder}`, borderRadius: "8px",
          padding: "8px 12px", color: "#7d8590", fontSize: "12px",
          fontFamily: "Sora, sans-serif", outline: "none", resize: "none", marginBottom: "8px",
        }}
        placeholder="Description"
      />
      <select
        value={localForm.status}
        onChange={(e) => setLocalForm({ ...localForm, status: e.target.value })}
        style={{
          width: "100%", background: "#161b22", border: `1px solid ${col.accentBorder}`,
          borderRadius: "8px", padding: "7px 12px", color: "#c9d1d9",
          fontSize: "12px", fontFamily: "Sora, sans-serif", outline: "none", marginBottom: "10px",
        }}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <div
        onClick={() => editFileInputRef.current?.click()}
        style={{
          border: "1.5px dashed rgba(88,166,255,0.2)", borderRadius: "10px",
          padding: "10px", textAlign: "center", cursor: "pointer",
          marginBottom: "10px", background: "rgba(88,166,255,0.03)",
          fontSize: "11px", color: "#7d8590",
        }}
      >
        {editImagePreview
          ? <div>
              <img src={editImagePreview} alt="preview" style={{ width: "100%", maxHeight: "80px", objectFit: "cover", borderRadius: "6px", marginBottom: "4px" }} />
              <span style={{ color: "#58a6ff" }}>Change image</span>
            </div>
          : <span><span style={{ color: "#58a6ff" }}>Upload</span> task image (optional)</span>
        }
        <input ref={editFileInputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              setEditImage(f);
              const r = new FileReader();
              r.onloadend = () => setEditImagePreview(r.result);
              r.readAsDataURL(f);
            }
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: "8px", background: "linear-gradient(135deg, #0052cc, #0065ff)",
          border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px",
          fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif",
        }}>Save</button>
        <button onClick={onCancel} style={{
          flex: 1, padding: "8px", background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
          color: "#7d8590", fontSize: "12px", cursor: "pointer", fontFamily: "Sora, sans-serif",
        }}>Cancel</button>
      </div>
    </div>
  );
};

// ─── Task View Card (also outside Dashboard) ───────────────────────────────────
const TaskCard = ({ task, col, isOwner, onEdit, onDeleteConfirm, deleteConfirm, onDeleteConfirmClose, onDelete }) => {
  if (deleteConfirm === task._id) {
    return (
      <div style={{
        background: "rgba(22,27,34,0.9)", border: "1px solid rgba(255,86,48,0.2)",
        borderRadius: "14px", padding: "20px 16px", marginBottom: "10px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5630" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style={{ fontSize: "13px", color: "#e6edf3", fontWeight: "600", textAlign: "center" }}>Delete this task?</p>
        <p style={{ fontSize: "11px", color: "#7d8590", textAlign: "center" }}>This can't be undone.</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => onDelete(task._id)} style={{
            padding: "8px 16px", background: "#ff5630", border: "none", borderRadius: "8px",
            color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif",
          }}>Delete</button>
          <button onClick={onDeleteConfirmClose} style={{
            padding: "8px 16px", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
            color: "#c9d1d9", fontSize: "12px", cursor: "pointer", fontFamily: "Sora, sans-serif",
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(22,27,34,0.9)", border: "1px solid rgba(88,166,255,0.08)",
        borderRadius: "14px", padding: "14px 16px", marginBottom: "10px",
        transition: "all 0.2s ease", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${col.accentBorder}`;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(88,166,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: col.accent, borderRadius: "14px 0 0 14px" }} />

      {task.image && (
        <img src={task.image} alt="task" style={{ width: "calc(100% - 6px)", marginLeft: "6px", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px", display: "block" }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#e6edf3", lineHeight: "1.4", flex: 1 }}>
          {task.title}
        </h3>
        {isOwner && (
          <div style={{ display: "flex", gap: "6px", marginLeft: "10px", flexShrink: 0 }}>
            <button onClick={() => onEdit(task)} title="Edit" style={{
              width: "28px", height: "28px", background: "rgba(88,166,255,0.1)",
              border: "1px solid rgba(88,166,255,0.15)", borderRadius: "7px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(88,166,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(88,166,255,0.1)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button onClick={() => onDeleteConfirm(task._id)} title="Delete" style={{
              width: "28px", height: "28px", background: "rgba(255,86,48,0.1)",
              border: "1px solid rgba(255,86,48,0.15)", borderRadius: "7px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,86,48,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,86,48,0.1)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff5630" strokeWidth="2.5">
                <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p style={{ fontSize: "12px", color: "#7d8590", lineHeight: "1.6", marginBottom: "10px" }}>
          {task.description}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "10px", fontWeight: "600", color: col.accent, background: col.accentBg,
          border: `1px solid ${col.accentBorder}`, padding: "3px 8px",
          borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px",
        }}>{col.label}</span>
        {task.user?.name && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {task.user?.avatar && (
              <img src={task.user.avatar} alt={task.user.name} style={{
                width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover",
                border: "1px solid rgba(88,166,255,0.2)",
              }} />
            )}
            <span style={{ fontSize: "10px", color: "#484f58" }}>by {task.user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [taskImage, setTaskImage] = useState(null);
  const [taskImagePreview, setTaskImagePreview] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toasts, setToasts] = useState([]);
  const fileInputRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setNotifications(prev => [{ id, msg, type, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...prev.slice(0, 19)]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

const unreadCount = notifications.length;

const checkOwner = useCallback((task) => {
const taskUserId =
  typeof task.user === "object"
    ? task.user?._id
    : task.user || task.userId;
  return String(taskUserId) === String(currentUser._id || currentUser.id);
}, [currentUser._id, currentUser.id]);

  const refreshTasks = useCallback(async () => {
    const res = await API.get("/tasks");
    setTasks(res.data.tasks || res.data);
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      if (taskImage) formData.append("image", taskImage);

 await API.post("/tasks", formData);

      setTitle(""); setDescription(""); setStatus("todo");
      setTaskImage(null); setTaskImagePreview(null);
      setShowAddForm(false);
      await refreshTasks();
      addToast("✅ Task created successfully!");
    } catch (err) {
      console.log("create task error:", err);
      addToast("❌ Failed to create task", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setDeleteConfirm(null);
      await refreshTasks();
      addToast("🗑️ Task deleted");
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
  };

  // ✅ FIX: receives localForm & editImage directly from EditCard — no stale closure
  const saveEdit = async (taskId, localForm, editImage) => {
    try {
      const formData = new FormData();
      formData.append("title", localForm.title);
      formData.append("description", localForm.description);
      formData.append("status", localForm.status);
      if (editImage) formData.append("image", editImage);

  await API.put(`/tasks/${taskId}`, formData);

      setEditingTask(null);
      await refreshTasks();
      addToast("✏️ Task updated!");
    } catch (err) {
      console.log("save edit error:", err);
      addToast("❌ Failed to update task", "error");
    }
  };

  useEffect(() => { refreshTasks(); }, []);

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const progressTasks = tasks.filter((t) => t.status === "inprogress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const colConfig = [
    { key: "todo", label: "To Do", tasks: todoTasks, accent: "#ffab00", accentBg: "rgba(255,171,0,0.08)", accentBorder: "rgba(255,171,0,0.2)" },
    { key: "inprogress", label: "In Progress", tasks: progressTasks, accent: "#58a6ff", accentBg: "rgba(88,166,255,0.08)", accentBorder: "rgba(88,166,255,0.2)" },
    { key: "done", label: "Done", tasks: doneTasks, accent: "#3fb950", accentBg: "rgba(63,185,80,0.08)", accentBorder: "rgba(63,185,80,0.2)" },
  ];

  const notifRef = useRef(null);
  useEffect(() => {
    if (!showNotifs) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  const userInitial = (currentUser.name || currentUser.email || "U")[0].toUpperCase();
  // ✅ Support both URL string and base64 avatar from localStorage
  const userAvatar = currentUser.avatar || currentUser.profilePic || currentUser.profileImage || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      - *import { multer } from 'multer';
- , *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
+ *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }

        .dash-root { min-height: 100vh; background: #0d1117; color: #e6edf3; font-family: 'Sora', sans-serif; position: relative; }

        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(13,17,23,0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(88,166,255,0.08);
          padding: 0 32px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .nav-logo {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px rgba(0,82,204,0.4);
        }
        .nav-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .nav-title span { color: #58a6ff; }

        .nav-right { display: flex; align-items: center; gap: 12px; }

        /* ── User chip with avatar ── */
        .user-chip {
          display: flex; align-items: center; gap: 10px;
          background: rgba(88,166,255,0.06);
          border: 1px solid rgba(88,166,255,0.12);
          border-radius: 30px; padding: 4px 14px 4px 4px;
          transition: border-color 0.2s;
        }
        .user-chip:hover { border-color: rgba(88,166,255,0.25); }

        .user-avatar-wrap {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0052cc, #00b8d9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 2px rgba(88,166,255,0.3);
        }
        .user-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .user-avatar-initial { font-size: 13px; font-weight: 700; color: #fff; }

        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 12px; font-weight: 600; color: #e6edf3; line-height: 1.2; }
        .user-role { font-size: 10px; color: #7d8590; }

        .logout-btn {
          padding: 7px 16px; background: rgba(255,86,48,0.1);
          border: 1px solid rgba(255,86,48,0.2); border-radius: 8px;
          color: #ff7452; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .logout-btn:hover { background: rgba(255,86,48,0.18); border-color: rgba(255,86,48,0.35); }

        .main-content { position: relative; z-index: 1; padding: 28px; }

        .add-task-bar {
          background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1);
          border-radius: 16px; padding: 0; margin-bottom: 28px;
          overflow: hidden; backdrop-filter: blur(16px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .add-task-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; cursor: pointer; transition: background 0.2s;
        }
        .add-task-header:hover { background: rgba(88,166,255,0.04); }
        .add-task-header-left { display: flex; align-items: center; gap: 10px; }
        .add-icon {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #0052cc, #0065ff);
          border-radius: 7px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,82,204,0.4);
        }
        .add-task-label { font-size: 13px; font-weight: 600; color: #c9d1d9; }
        .chevron { transition: transform 0.25s ease; color: #484f58; }
        .chevron.open { transform: rotate(180deg); }

        .add-form-body { padding: 0 20px 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 700px) { .form-grid { grid-template-columns: 1fr; } }

        .form-field label { display: block; font-size: 10px; font-weight: 600; color: #7d8590; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .form-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(88,166,255,0.1); border-radius: 10px;
          padding: 10px 14px; color: #e6edf3; font-size: 13px;
          font-family: 'Sora', sans-serif; outline: none; transition: all 0.2s;
        }
        .form-input::placeholder { color: #484f58; }
        .form-input:focus { border-color: rgba(88,166,255,0.4); background: rgba(88,166,255,0.04); box-shadow: 0 0 0 3px rgba(88,166,255,0.07); }

        .form-row { display: flex; gap: 12px; align-items: flex-end; }
        .img-drop {
          flex: 1; border: 1.5px dashed rgba(88,166,255,0.15); border-radius: 10px;
          padding: 10px 14px; cursor: pointer; font-size: 12px; color: #7d8590;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s; background: rgba(88,166,255,0.02);
        }
        .img-drop:hover { border-color: rgba(88,166,255,0.3); background: rgba(88,166,255,0.05); }
        .img-drop span { color: #58a6ff; }

        .submit-btn {
          padding: 10px 24px; background: linear-gradient(135deg, #0052cc, #0065ff);
          border: none; border-radius: 10px; color: #fff;
          font-size: 13px; font-weight: 700; font-family: 'Sora', sans-serif;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 12px rgba(0,82,204,0.35);
          white-space: nowrap; display: flex; align-items: center; justify-content: center;
        }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,82,204,0.5); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .board { grid-template-columns: 1fr; } }

        .column {
          background: rgba(22,27,34,0.7); border-radius: 16px; padding: 0;
          border: 1px solid rgba(88,166,255,0.07); backdrop-filter: blur(12px);
          overflow: hidden; min-height: 500px;
        }
        .col-header {
          padding: 16px 18px 14px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(88,166,255,0.07);
          position: sticky; top: 64px; background: rgba(22,27,34,0.95);
          backdrop-filter: blur(12px); z-index: 10;
        }
        .col-header-left { display: flex; align-items: center; gap: 8px; }
        .col-dot { width: 8px; height: 8px; border-radius: 50%; }
        .col-title { font-size: 13px; font-weight: 700; letter-spacing: -0.2px; }
        .col-count { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
        .col-body { padding: 70px 20px 20px; }

        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 40px 20px; color: #484f58; text-align: center;
        }
        .empty-state svg { margin-bottom: 10px; opacity: 0.4; }
        .empty-state p { font-size: 12px; }

        .img-preview-thumb { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid rgba(88,166,255,0.2); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

        /* ── Notifications ── */
        .notif-btn {
          position: relative; width: 36px; height: 36px;
          background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.12);
          border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; color: #7d8590;
        }
        .notif-btn:hover { background: rgba(88,166,255,0.12); color: #58a6ff; border-color: rgba(88,166,255,0.25); }
        .notif-badge {
          position: absolute; top: -4px; right: -4px;
          min-width: 16px; height: 16px; border-radius: 8px;
          background: linear-gradient(135deg, #ff5630, #ff7452);
          font-size: 9px; font-weight: 700; color: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px; border: 2px solid #0d1117;
          animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badgePop { from { transform: scale(0); } to { transform: scale(1); } }

        .notif-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 320px; background: rgba(22,27,34,0.97);
          border: 1px solid rgba(88,166,255,0.15); border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          backdrop-filter: blur(20px); z-index: 200;
          overflow: hidden;
          animation: panelDrop 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes panelDrop { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        .notif-header {
          padding: 14px 16px 12px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(88,166,255,0.08);
        }
        .notif-title { font-size: 13px; font-weight: 700; color: #e6edf3; }
        .notif-clear { font-size: 11px; color: #58a6ff; cursor: pointer; background: none; border: none; font-family: 'Sora', sans-serif; }
        .notif-clear:hover { opacity: 0.7; }

        .notif-list { max-height: 320px; overflow-y: auto; }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-track { background: transparent; }
        .notif-list::-webkit-scrollbar-thumb { background: rgba(88,166,255,0.2); border-radius: 2px; }

        .notif-item {
          padding: 12px 16px; border-bottom: 1px solid rgba(88,166,255,0.05);
          display: flex; gap: 10px; align-items: flex-start; transition: background 0.15s;
        }
        .notif-item:hover { background: rgba(88,166,255,0.04); }
        .notif-item:last-child { border-bottom: none; }
        .notif-dot { width: 7px; height: 7px; border-radius: 50%; background: #58a6ff; flex-shrink: 0; margin-top: 5px; }
        .notif-dot.error { background: #ff5630; }
        .notif-text { font-size: 12px; color: #c9d1d9; line-height: 1.5; flex: 1; }
        .notif-time { font-size: 10px; color: #484f58; white-space: nowrap; margin-top: 2px; }

        .notif-empty { padding: 32px 16px; text-align: center; color: #484f58; font-size: 12px; }

        /* ── Toasts ── */
        .toast-container {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          display: flex; flex-direction: column; gap: 8px; pointer-events: none;
        }
        .toast {
          padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500;
          color: #e6edf3; backdrop-filter: blur(20px);
          border: 1px solid rgba(88,166,255,0.15);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1);
          background: rgba(22,27,34,0.97);
          display: flex; align-items: center; gap: 8px;
          min-width: 220px; max-width: 340px;
        }
        .toast.error { border-color: rgba(255,86,48,0.25); }
        @keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }

        /* ── notif wrapper needs position:relative ── */
        .notif-wrap { position: relative; }
      `}</style>

      <div className="dash-root">
        <div className="bg-grid" />

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="14" rx="2" fill="white" opacity="0.9"/>
                <rect x="14" y="3" width="7" height="9" rx="2" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="nav-title">Task<span>Flow</span></span>
          </div>

          <div className="nav-right">
            {/* ── Notification bell ── */}
            <div className="notif-wrap" ref={notifRef}>
              <button className="notif-btn" onClick={() => setShowNotifs(p => !p)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>

              {showNotifs && (
                <div className="notif-panel">
                  <div className="notif-header">
                    <span className="notif-title">Notifications</span>
                    {notifications.length > 0 && (
                      <button className="notif-clear" onClick={() => { setNotifications([]); setShowNotifs(false); }}>
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0
                      ? <div className="notif-empty">No notifications yet</div>
                      : notifications.map(n => (
                          <div className="notif-item" key={n.id}>
                            <div className={`notif-dot ${n.type === "error" ? "error" : ""}`} />
                            <div style={{ flex: 1 }}>
                              <div className="notif-text">{n.msg}</div>
                              <div className="notif-time">{n.time}</div>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>
            {/* ── User chip with profile picture ── */}
            <div className="user-chip">
              <div className="user-avatar-wrap">
                {userAvatar
                  ? <img src={userAvatar} alt={currentUser.name} />
                  : <span className="user-avatar-initial">{userInitial}</span>
                }
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.name || "User"}</span>
                <span className="user-role">{currentUser.email || "Member"}</span>
              </div>
            </div>

            <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="main-content">

          {/* ── Add Task Bar ── */}
          <div className="add-task-bar">
            <div className="add-task-header" onClick={() => setShowAddForm(!showAddForm)}>
              <div className="add-task-header-left">
                <div className="add-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <span className="add-task-label">Add new task</span>
              </div>
              <svg className={`chevron ${showAddForm ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </div>

            {showAddForm && (
              <div className="add-form-body">
                <div style={{ height: "1px", background: "rgba(88,166,255,0.07)", marginBottom: "16px" }} />
                <form onSubmit={createTask}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Task title</label>
                      <input type="text" placeholder="What needs to be done?" className="form-input"
                        value={title} required onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label>Description</label>
                      <input type="text" placeholder="Add details..." className="form-input"
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field" style={{ minWidth: "140px" }}>
                      <label>Status</label>
                      <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Image (optional)</label>
                      <div className="img-drop" onClick={() => fileInputRef.current?.click()}>
                        {taskImagePreview
                          ? <><img src={taskImagePreview} className="img-preview-thumb" alt="preview" /><span style={{ color: "#58a6ff" }}>Change image</span></>
                          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>Click to <span>upload</span></span></>
                        }
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              setTaskImage(f);
                              const r = new FileReader();
                              r.onloadend = () => setTaskImagePreview(r.result);
                              r.readAsDataURL(f);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isAdding}>
                      {isAdding ? <span className="spin" /> : "Add Task"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── Board ── */}
          <div className="board">
            {colConfig.map((col) => (
              <div className="column" key={col.key}>
                <div className="col-header">
                  <div className="col-header-left">
                    <div className="col-dot" style={{ background: col.accent, boxShadow: `0 0 6px ${col.accent}` }} />
                    <span className="col-title" style={{ color: col.accent }}>{col.label}</span>
                  </div>
                  <span className="col-count" style={{ color: col.accent, background: col.accentBg, border: `1px solid ${col.accentBorder}` }}>
                    {col.tasks.length}
                  </span>
                </div>

                <div className="col-body">
                  {col.tasks.length === 0 ? (
                    <div className="empty-state">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="1.5">
                        <rect x="5" y="2" width="14" height="20" rx="2"/>
                        <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>
                      </svg>
                      <p>No {col.label.toLowerCase()} tasks yet</p>
                    </div>
                  ) : (
                    col.tasks.map((task) =>
                      editingTask === task._id ? (
                        // ✅ EditCard is a stable external component — no focus loss
                        <EditCard
                          key={task._id}
                          task={task}
                          col={col}
                          initialImagePreview={task.image || null}
                          onSave={saveEdit}
                          onCancel={() => setEditingTask(null)}
                        />
                      ) : (
                        <TaskCard
                          key={task._id}
                          task={task}
                          col={col}
                          isOwner={checkOwner(task)}
                          onEdit={startEdit}
                          onDeleteConfirm={setDeleteConfirm}
                          deleteConfirm={deleteConfirm}
                          onDeleteConfirmClose={() => setDeleteConfirm(null)}
                          onDelete={handleDeleteTask}
                        />
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Toast notifications ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;