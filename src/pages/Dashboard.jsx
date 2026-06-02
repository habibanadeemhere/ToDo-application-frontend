import { useEffect, useState, useRef, useCallback } from "react";
import API from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ─── Edit Card ─────────────────────────────────────────────────────────────────
const EditCard = ({ task, col, initialImagePreview, onSave, onCancel, allUsers }) => {
  const titleRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(initialImagePreview || null);
  const [localForm, setLocalForm] = useState({
    title: task.title, description: task.description, status: task.status,
    assignedTo: task.assignedTo?._id || task.assignedTo || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    priority: task.priority || "medium",
  });

  const prevTasksRef = useRef([]);
const notifiedDeadlines = useRef(new Set());


  useEffect(() => { const t = setTimeout(() => titleRef.current?.focus(), 50); return () => clearTimeout(t); }, []);
  const handleSave = () => onSave(task._id, localForm, editImage);
  const inp = { width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${col.accentBorder}`, borderRadius: "8px", padding: "8px 12px", color: "#e6edf3", fontSize: "13px", fontFamily: "Sora, sans-serif", outline: "none", marginBottom: "8px" };

  return (
    <div style={{ background: "rgba(30,36,46,0.98)", border: `1px solid ${col.accentBorder}`, borderRadius: "14px", padding: "16px", marginBottom: "12px", boxShadow: `0 0 0 2px ${col.accent}22` }}>
      <input ref={titleRef} value={localForm.title} style={inp} placeholder="Task title" onChange={(e) => setLocalForm({ ...localForm, title: e.target.value })} />
      <textarea value={localForm.description} rows={2} placeholder="Description" onChange={(e) => setLocalForm({ ...localForm, description: e.target.value })} style={{ ...inp, resize: "none", color: "#7d8590", fontSize: "12px" }} />
      <select value={localForm.assignedTo} onChange={(e) => setLocalForm({ ...localForm, assignedTo: e.target.value })} style={{ ...inp, background: "#161b22", color: "#c9d1d9" }}>
        <option value="">— Assign to user —</option>
        {allUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
      </select>
      <select value={localForm.status} onChange={(e) => setLocalForm({ ...localForm, status: e.target.value })} style={{ ...inp, background: "#161b22", color: "#c9d1d9" }}>
        <option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option>
      </select>
      <select value={localForm.priority} onChange={(e) => setLocalForm({ ...localForm, priority: e.target.value })} style={{ ...inp, background: "#161b22", color: "#c9d1d9" }}>
        <option value="low">🟢 Low</option><option value="medium">🟡 Medium</option><option value="high">🔴 High</option>
      </select>
      <input type="date" value={localForm.dueDate} onChange={(e) => setLocalForm({ ...localForm, dueDate: e.target.value })} style={{ ...inp, colorScheme: "dark" }} />
      <div onClick={() => editFileInputRef.current?.click()} style={{ border: "1.5px dashed rgba(88,166,255,0.2)", borderRadius: "10px", padding: "10px", textAlign: "center", cursor: "pointer", marginBottom: "10px", background: "rgba(88,166,255,0.03)", fontSize: "11px", color: "#7d8590" }}>
        {editImagePreview ? <div><img src={editImagePreview} alt="preview" style={{ width: "100%", maxHeight: "80px", objectFit: "cover", borderRadius: "6px", marginBottom: "4px" }} /><span style={{ color: "#58a6ff" }}>Change image</span></div> : <span><span style={{ color: "#58a6ff" }}>Upload</span> task image (optional)</span>}
        <input ref={editFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) { setEditImage(f); const r = new FileReader(); r.onloadend = () => setEditImagePreview(r.result); r.readAsDataURL(f); } }} />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSave} style={{ flex: 1, padding: "8px", background: "linear-gradient(135deg, #0052cc, #0065ff)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Save</button>
        <button onClick={onCancel} style={{ flex: 1, padding: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#7d8590", fontSize: "12px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Cancel</button>
      </div>
    </div>
  );
};

// ─── Comments Panel ─────────────────────────────────────────────────────────────
const CommentsPanel = ({ task, currentUser, onClose }) => {
  const [comments, setComments] = useState(task.comments || []);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [comments]);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await API.post(`/tasks/${task._id}/comments`, { text });
      setComments(res.data.comments || []);
      setText("");
    } catch { } finally { setLoading(false); }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await API.delete(`/tasks/${task._id}/comments/${commentId}`);
      setComments(res.data.comments || []);
    } catch { }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "520px", background: "rgba(22,27,34,0.98)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(88,166,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3" }}>💬 Comments</div>
            <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "2px" }}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {comments.length === 0
            ? <div style={{ textAlign: "center", color: "#484f58", fontSize: "12px", padding: "30px 0" }}>No comments yet. Be the first!</div>
            : comments.map(c => {
                const isMe = String(c.user?._id || c.user) === String(currentUser._id || currentUser.id);
                return (
                  <div key={c._id} style={{ marginBottom: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #0052cc, #00b8d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                      {c.user?.avatar ? <img src={c.user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (c.user?.name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(88,166,255,0.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#c9d1d9" }}>{c.user?.name || "User"}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "10px", color: "#484f58" }}>{new Date(c.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          {isMe && <button onClick={() => deleteComment(c._id)} style={{ background: "none", border: "none", color: "#ff5630", cursor: "pointer", fontSize: "11px" }}>✕</button>}
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "#7d8590", lineHeight: "1.5" }}>{c.text}</p>
                    </div>
                  </div>
                );
              })
          }
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(88,166,255,0.08)", display: "flex", gap: "10px" }}>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()} placeholder="Write a comment…" style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(88,166,255,0.12)", borderRadius: "10px", padding: "10px 14px", color: "#e6edf3", fontSize: "13px", fontFamily: "Sora, sans-serif", outline: "none" }} />
          <button onClick={submit} disabled={loading || !text.trim()} style={{ padding: "10px 18px", background: "linear-gradient(135deg, #0052cc, #0065ff)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif", opacity: loading || !text.trim() ? 0.5 : 1 }}>Send</button>
        </div>
      </div>
    </div>
  );
};

// ─── Task History Panel ──────────────────────────────────────────────────────────
const HistoryPanel = ({ task, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
    <div style={{ width: "100%", maxWidth: "480px", background: "rgba(22,27,34,0.98)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(88,166,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: "14px", fontWeight: "700", color: "#e6edf3" }}>📋 Task History</div><div style={{ fontSize: "11px", color: "#7d8590", marginTop: "2px" }}>{task.title}</div></div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: "18px" }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {(!task.history || task.history.length === 0)
          ? <div style={{ textAlign: "center", color: "#484f58", fontSize: "12px", padding: "30px 0" }}>No history yet</div>
          : [...task.history].reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6554c0", flexShrink: 0, marginTop: "6px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#c9d1d9" }}><strong>{h.changedBy?.name || "Someone"}</strong> {h.action}</div>
                  {h.oldValue && h.newValue && <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "3px" }}>{h.field}: <span style={{ color: "#ff5630" }}>{h.oldValue}</span> → <span style={{ color: "#3fb950" }}>{h.newValue}</span></div>}
                  <div style={{ fontSize: "10px", color: "#484f58", marginTop: "3px" }}>{new Date(h.changedAt).toLocaleString()}</div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  </div>
);

// ─── Priority + Due date badges ──────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const map = { high: { color: "#ff5630", bg: "rgba(255,86,48,0.1)", border: "rgba(255,86,48,0.2)", label: "🔴 High" }, medium: { color: "#ffab00", bg: "rgba(255,171,0,0.1)", border: "rgba(255,171,0,0.2)", label: "🟡 Medium" }, low: { color: "#3fb950", bg: "rgba(63,185,80,0.1)", border: "rgba(63,185,80,0.2)", label: "🟢 Low" } };
  const p = map[priority] || map.medium;
  return <span style={{ fontSize: "10px", fontWeight: "600", color: p.color, background: p.bg, border: `1px solid ${p.border}`, padding: "2px 7px", borderRadius: "20px" }}>{p.label}</span>;
};

const DueDateBadge = ({ dueDate }) => {
  if (!dueDate) return null;
  const due = new Date(dueDate); const now = new Date();
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  const overdue = diff < 0; const soon = diff >= 0 && diff <= 2;
  const color = overdue ? "#ff5630" : soon ? "#ffab00" : "#7d8590";
  const label = overdue ? `⚠ Overdue ${Math.abs(diff)}d` : diff === 0 ? "⚠ Due today" : `📅 ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  return <span style={{ fontSize: "10px", color, fontWeight: overdue || soon ? "600" : "400" }}>{label}</span>;
};

// ─── Task Card ──────────────────────────────────────────────────────────────────
const TaskCard = ({ task, col, isOwner, canEdit, canDelete, onEdit, onDeleteConfirm, deleteConfirm, onDeleteConfirmClose, onDelete, onMove, onComment, onHistory }) => {
  if (deleteConfirm === task._id) {
    return (
      <div style={{ background: "rgba(22,27,34,0.9)", border: "1px solid rgba(255,86,48,0.2)", borderRadius: "14px", padding: "20px 16px", marginBottom: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5630" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style={{ fontSize: "13px", color: "#e6edf3", fontWeight: "600", textAlign: "center" }}>Delete this task?</p>
        <p style={{ fontSize: "11px", color: "#7d8590", textAlign: "center" }}>This can't be undone.</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => onDelete(task._id)} style={{ padding: "8px 16px", background: "#ff5630", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Delete</button>
          <button onClick={onDeleteConfirmClose} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#c9d1d9", fontSize: "12px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(22,27,34,0.9)", border: "1px solid rgba(88,166,255,0.08)", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${col.accentBorder}`; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(88,166,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: col.accent, borderRadius: "14px 0 0 14px" }} />

      {task.image && <img src={task.image} alt="task" style={{ width: "calc(100% - 6px)", marginLeft: "6px", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px", display: "block" }} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#e6edf3", lineHeight: "1.4", flex: 1 }}>{task.title}</h3>
        <div style={{ display: "flex", gap: "5px", marginLeft: "8px", flexShrink: 0 }}>
          {/* comment btn — always visible */}
          <button onClick={() => onComment(task)} title="Comments" style={{ width: "26px", height: "26px", background: "rgba(101,84,192,0.1)", border: "1px solid rgba(101,84,192,0.2)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>💬</button>
          {/* history btn */}
          <button onClick={() => onHistory(task)} title="History" style={{ width: "26px", height: "26px", background: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>📋</button>
         
          {canEdit && (
  <button onClick={() => onEdit(task)} title="Edit" style={{ width: "26px", height: "26px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(88,166,255,0.2)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(88,166,255,0.1)"}>

    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2.5">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>

  </button>
)}

{canDelete && (
  <button onClick={() => onDeleteConfirm(task._id)} title="Delete" style={{ width: "26px", height: "26px", background: "rgba(255,86,48,0.1)", border: "1px solid rgba(255,86,48,0.15)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,86,48,0.2)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,86,48,0.1)"}>

    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ff5630" strokeWidth="2.5">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>

  </button>
)}
        </div>
      </div>

      {task.description && <p style={{ fontSize: "12px", color: "#7d8590", lineHeight: "1.6", marginBottom: "8px" }}>{task.description}</p>}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
        {task.priority && <PriorityBadge priority={task.priority} />}
        <DueDateBadge dueDate={task.dueDate} />
        {task.comments?.length > 0 && <span style={{ fontSize: "10px", color: "#6554c0" }}>💬 {task.comments.length}</span>}
      </div>

      {task.assignedTo?.name && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", padding: "5px 8px", background: "rgba(88,166,255,0.05)", borderRadius: "8px", border: "1px solid rgba(88,166,255,0.1)" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg, #0052cc, #00b8d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff", flexShrink: 0, overflow: "hidden" }}>
            {task.assignedTo.avatar ? <img src={task.assignedTo.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : task.assignedTo.name[0].toUpperCase()}
          </div>
          <span style={{ fontSize: "11px", color: "#7d8590" }}>Assigned: <span style={{ color: "#c9d1d9", fontWeight: "600" }}>{task.assignedTo.name}</span></span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "10px", fontWeight: "600", color: col.accent, background: col.accentBg, border: `1px solid ${col.accentBorder}`, padding: "3px 8px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col.label}</span>
        {task.user?.name && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {task.user?.avatar && <img src={task.user.avatar} alt="" style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }} />}
            <span style={{ fontSize: "10px", color: "#484f58" }}>by {task.user.name}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {task.status === "todo" && <button onClick={() => onMove(task._id, "inprogress")} style={{ padding: "5px 9px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: "6px", color: "#58a6ff", fontSize: "11px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>→ In Progress</button>}
        {task.status === "inprogress" && <>
          <button onClick={() => onMove(task._id, "todo")} style={{ padding: "5px 9px", background: "rgba(255,171,0,0.1)", border: "1px solid rgba(255,171,0,0.2)", borderRadius: "6px", color: "#ffab00", fontSize: "11px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>← To Do</button>
          <button onClick={() => onMove(task._id, "done")} style={{ padding: "5px 9px", background: "rgba(63,185,80,0.1)", border: "1px solid rgba(63,185,80,0.2)", borderRadius: "6px", color: "#3fb950", fontSize: "11px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>→ Done</button>
        </>}
        {task.status === "done" && <button onClick={() => onMove(task._id, "inprogress")} style={{ padding: "5px 9px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: "6px", color: "#58a6ff", fontSize: "11px", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>← In Progress</button>}
      </div>
    </div>
  );
};



// ─── Main Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
  const [tasks, setTasks]                 = useState([]);
  const [allUsers, setAllUsers]           = useState([]);
  const [activityLog, setActivityLog]     = useState([]);
  const [title, setTitle]                 = useState("");
  const [description, setDescription]     = useState("");
  const [status, setStatus]               = useState("todo");
  const [priority, setPriority]           = useState("medium");
  const [dueDate, setDueDate]             = useState("");
  const [assignedTo, setAssignedTo]       = useState("");
  const [taskImage, setTaskImage]         = useState(null);
  const [taskImagePreview, setTaskImagePreview] = useState(null);
  const [isAdding, setIsAdding]           = useState(false);
  const [editingTask, setEditingTask]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm]     = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs]       = useState(false);
  const [showActivity, setShowActivity]   = useState(false);
  const [toasts, setToasts]               = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");
  const [filterUser, setFilterUser]       = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [commentTask, setCommentTask]     = useState(null);
  const [historyTask, setHistoryTask]     = useState(null);
  const fileInputRef = useRef(null);
  const notifRef     = useRef(null);
  const activityRef  = useRef(null);
  const prevTasksRef = useRef([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  // ── helpers ──────────────────────────────────────────────────────────────────
  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setNotifications(prev => [{ id, msg, type, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...prev.slice(0, 49)]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const logActivity = useCallback((msg) => {
    setActivityLog(prev => [{ id: Date.now(), msg, user: currentUser.name || "You", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString() }, ...prev.slice(0, 49)]);
  }, [currentUser.name]);

  const checkOwner = useCallback((task) => {
    const tid = typeof task.user === "object" ? task.user?._id : task.user || task.userId;
    return String(tid) === String(currentUser._id || currentUser.id);
  }, [currentUser._id, currentUser.id]);

  const canEdit   = useCallback((task) => isAdmin || checkOwner(task), [isAdmin, checkOwner]);
  const canDelete = useCallback((task) => isAdmin || checkOwner(task), [isAdmin, checkOwner]);

  const refreshTasks = useCallback(async () => {
    const res = await API.get("/tasks");
    setTasks(res.data.tasks || res.data);
  }, []);

  const fetchUsers = useCallback(async () => {
    try { const res = await API.get("/auth/users"); setAllUsers(res.data || []); } catch {}
  }, []);

  // ── Polling — replaces Socket.io (Vercel serverless = no WebSockets) ─────────
  // Silently fetches every 4s, diffs against previous state, notifies on changes.
 useEffect(() => {
  const myId = String(currentUser._id || currentUser.id || "");

  const poll = async () => {
    try {
      const res = await API.get("/tasks");
      const fresh = res.data.tasks || res.data;
      const prev = prevTasksRef.current;

      fresh.forEach((t) => {
        const creatorId = String(
          typeof t.user === "object" ? t.user?._id : t.user
        );

        const existed = prev.find((p) => p._id === t._id);

        // New task by someone else
        if (!existed && creatorId !== myId) {
          addToast(`📌 ${t.user?.name || "Someone"} created "${t.title}"`);
          logActivity(
            `${t.user?.name || "Someone"} created "${t.title}"`
          );
        }

        // Status changed by someone else
        if (
          existed &&
          existed.status !== t.status &&
          creatorId !== myId
        ) {
          addToast(`🔄 "${t.title}" moved to ${t.status}`);
        }

        // New comment by someone else
        const oldCount = existed?.comments?.length || 0;
        const freshCount = t.comments?.length || 0;

        if (freshCount > oldCount) {
          const latest = t.comments?.[t.comments.length - 1];

          const commenterId = String(
            typeof latest?.user === "object"
              ? latest?.user?._id
              : latest?.user
          );

          if (commenterId !== myId) {
            addToast(`💬 New comment on "${t.title}"`);
          }
        }
      });

      // Deadline notifications
      const now = new Date();

      fresh.forEach((t) => {
        if (!t.dueDate || t.status === "done") return;

        const diff =
          (new Date(t.dueDate) - now) / (1000 * 60 * 60);

        if (
          diff > 0 &&
          diff <= 24 &&
          !notifiedDeadlines.current.has(`due-${t._id}`)
        ) {
          addToast(`⏰ "${t.title}" due in < 24h`);
          notifiedDeadlines.current.add(`due-${t._id}`);
        }

        if (
          diff < 0 &&
          !notifiedDeadlines.current.has(`overdue-${t._id}`)
        ) {
          addToast(`⚠ "${t.title}" is overdue!`, "error");
          notifiedDeadlines.current.add(`overdue-${t._id}`);
        }
      });

      prevTasksRef.current = fresh;
      setTasks(fresh);
    } catch (err) {
      console.error(err);
    }
  };

  poll();
  const interval = setInterval(poll, 4000);

  return () => clearInterval(interval);
}, []);

// ───────────────── Initial Load ─────────────────
useEffect(() => {
  refreshTasks();
  fetchUsers();
}, []);

// ───────────────── Update Previous Tasks Ref ─────────────────
useEffect(() => {
  prevTasksRef.current = tasks;
}, [tasks]);

// ───────────────── Close Panels on Outside Click ─────────────────
useEffect(() => {
  const h = (e) => {
    if (
      notifRef.current &&
      !notifRef.current.contains(e.target)
    ) {
      setShowNotifs(false);
    }

    if (
      activityRef.current &&
      !activityRef.current.contains(e.target)
    ) {
      setShowActivity(false);
    }
  };

  document.addEventListener("mousedown", h);

  return () => {
    document.removeEventListener("mousedown", h);
  };
}, []);

  // ── CRUD ─────────────────────────────────────────────────────────────────────
const createTask = async (e) => {
  e.preventDefault();
  setIsAdding(true);

  try {
    const fd = new FormData();

    fd.append("title", title);
    fd.append("description", description);
    fd.append("status", status);
    fd.append("priority", priority);

    if (dueDate) fd.append("dueDate", dueDate);
    if (assignedTo) fd.append("assignedTo", assignedTo);
    if (taskImage) fd.append("image", taskImage);

    await API.post("/tasks", fd);

    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setDueDate("");
    setAssignedTo("");
    setTaskImage(null);
    setTaskImagePreview(null);

    setShowAddForm(false);

    await refreshTasks();
    addToast("✅ Task created!");
    logActivity(`Created task "${title}"`);
  } catch (err) {
    addToast("❌ Failed to create task", "error");
  } finally {
    setIsAdding(false);
  }
};




  const handleDeleteTask = async (taskId) => {
    const t = tasks.find(t => t._id === taskId);
    try {
      await API.delete(`/tasks/${taskId}`);
      setDeleteConfirm(null); await refreshTasks();
      addToast("🗑️ Task deleted"); logActivity(`Deleted "${t?.title}"`);
    } catch {}
  };

  const moveTask = async (taskId, newStatus) => {
    const t = tasks.find(t => t._id === taskId);
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      addToast("✅ Moved!"); logActivity(`Moved "${t?.title}" → ${newStatus}`);
    } catch { addToast("❌ Failed", "error"); refreshTasks(); }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    if (result.source.droppableId === newStatus) return;
    const t = tasks.find(t => String(t._id) === taskId);
    setTasks(prev => prev.map(t => String(t._id) === taskId ? { ...t, status: newStatus } : t));
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      addToast("✅ Task moved!"); logActivity(`Dragged "${t?.title}" → ${newStatus}`);
    } catch { addToast("❌ Move failed", "error"); refreshTasks(); }
  };

  const startEdit = (task) => setEditingTask(task._id);

  const saveEdit = async (taskId, localForm, editImage) => {
    const t = tasks.find(t => t._id === taskId);
    try {
      const fd = new FormData();
      fd.append("title", localForm.title); fd.append("description", localForm.description);
      fd.append("status", localForm.status); fd.append("priority", localForm.priority);
      if (localForm.dueDate) fd.append("dueDate", localForm.dueDate);
      if (localForm.assignedTo) fd.append("assignedTo", localForm.assignedTo);
      if (editImage) fd.append("image", editImage);
      await API.put(`/tasks/${taskId}`, fd);
      setEditingTask(null); await refreshTasks();
      addToast("✏️ Updated!"); logActivity(`Updated "${t?.title || localForm.title}"`);
    } catch { addToast("❌ Failed to update", "error"); }
  };

  // ── Filters ──────────────────────────────────────────────────────────────────
  const applyFilters = (list) => list.filter(task => {
    const q = searchQuery.toLowerCase();
    const ms = !q || task.title?.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q) || task.assignedTo?.name?.toLowerCase().includes(q) || task.user?.name?.toLowerCase().includes(q);
    const mu = !filterUser || task.assignedTo?._id === filterUser || task.user?._id === filterUser;
    const mp = !filterPriority || task.priority === filterPriority;
    return ms && mu && mp;
  });

  const todoTasks     = applyFilters(tasks.filter(t => t.status === "todo"));
  const progressTasks = applyFilters(tasks.filter(t => t.status === "inprogress"));
  const doneTasks     = applyFilters(tasks.filter(t => t.status === "done"));
  const colConfig = [
    { key: "todo",       label: "To Do",      tasks: todoTasks,     accent: "#ffab00", accentBg: "rgba(255,171,0,0.08)",  accentBorder: "rgba(255,171,0,0.2)" },
    { key: "inprogress", label: "In Progress", tasks: progressTasks, accent: "#58a6ff", accentBg: "rgba(88,166,255,0.08)", accentBorder: "rgba(88,166,255,0.2)" },
    { key: "done",       label: "Done",        tasks: doneTasks,     accent: "#3fb950", accentBg: "rgba(63,185,80,0.08)",  accentBorder: "rgba(63,185,80,0.2)" },
  ];

  const userInitial = (currentUser.name || "U")[0].toUpperCase();
  const userAvatar  = currentUser.avatar || currentUser.profilePic || null;
  const hasActiveFilter = searchQuery || filterUser || filterPriority;
  const unreadCount = notifications.length;


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }
        .dash-root { min-height: 100vh; background: #0d1117; color: #e6edf3; font-family: 'Sora', sans-serif; }
        .bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .navbar { position: sticky; top: 0; z-index: 100; background: rgba(13,17,23,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(88,166,255,0.08); padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .nav-logo { width: 32px; height: 32px; background: linear-gradient(135deg, #0052cc, #00b8d9); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(0,82,204,0.4); }
        .nav-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .nav-title span { color: #58a6ff; }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .icon-btn { position: relative; width: 36px; height: 36px; background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.12); border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: #7d8590; }
        .icon-btn:hover { background: rgba(88,166,255,0.12); color: #58a6ff; border-color: rgba(88,166,255,0.25); }
        .icon-badge { position: absolute; top: -4px; right: -4px; min-width: 16px; height: 16px; border-radius: 8px; background: linear-gradient(135deg, #ff5630, #ff7452); font-size: 9px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 3px; border: 2px solid #0d1117; animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes badgePop { from{transform:scale(0);}to{transform:scale(1);} }
        .drop-panel { position: absolute; top: calc(100% + 10px); right: 0; width: 320px; background: rgba(22,27,34,0.97); border: 1px solid rgba(88,166,255,0.15); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); backdrop-filter: blur(20px); z-index: 200; overflow: hidden; animation: panelDrop 0.2s cubic-bezier(0.16,1,0.3,1); }
        @keyframes panelDrop { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
        .drop-panel-header { padding: 14px 16px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(88,166,255,0.08); }
        .drop-panel-title { font-size: 13px; font-weight: 700; color: #e6edf3; }
        .drop-panel-action { font-size: 11px; color: #58a6ff; cursor: pointer; background: none; border: none; font-family: 'Sora', sans-serif; }
        .drop-panel-list { max-height: 320px; overflow-y: auto; }
        .drop-panel-list::-webkit-scrollbar { width: 4px; }
        .drop-panel-list::-webkit-scrollbar-thumb { background: rgba(88,166,255,0.2); border-radius: 2px; }
        .drop-panel-item { padding: 11px 16px; border-bottom: 1px solid rgba(88,166,255,0.05); display: flex; gap: 10px; align-items: flex-start; transition: background 0.15s; }
        .drop-panel-item:hover { background: rgba(88,166,255,0.04); }
        .drop-panel-item:last-child { border-bottom: none; }
        .dp-dot { width: 7px; height: 7px; border-radius: 50%; background: #58a6ff; flex-shrink: 0; margin-top: 5px; }
        .dp-dot.error { background: #ff5630; } .dp-dot.activity { background: #6554c0; }
        .dp-text { font-size: 12px; color: #c9d1d9; line-height: 1.5; flex: 1; }
        .dp-meta { font-size: 10px; color: #484f58; margin-top: 2px; }
        .drop-panel-empty { padding: 32px 16px; text-align: center; color: #484f58; font-size: 12px; }

        /* online users */
        .online-pill { display: flex; align-items: center; gap: 6px; background: rgba(63,185,80,0.08); border: 1px solid rgba(63,185,80,0.15); border-radius: 20px; padding: 4px 10px; }
        .online-dot { width: 7px; height: 7px; border-radius: 50%; background: #3fb950; box-shadow: 0 0 6px #3fb950; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.5;} }
        .online-text { font-size: 11px; color: "#3fb950"; font-weight: 600; }

        /* role badge */
        .role-badge { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
        .role-admin { background: rgba(255,171,0,0.12); color: #ffab00; border: 1px solid rgba(255,171,0,0.2); }
        .role-user  { background: rgba(88,166,255,0.1);  color: #58a6ff;  border: 1px solid rgba(88,166,255,0.2); }

        .user-chip { display: flex; align-items: center; gap: 10px; background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.12); border-radius: 30px; padding: 4px 14px 4px 4px; transition: border-color 0.2s; }
        .user-chip:hover { border-color: rgba(88,166,255,0.25); }
        .uav { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; overflow: hidden; background: linear-gradient(135deg, #0052cc, #00b8d9); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px rgba(88,166,255,0.3); }
        .uav img { width: 100%; height: 100%; object-fit: cover; }
        .uav-init { font-size: 13px; font-weight: 700; color: #fff; }
        .u-name { font-size: 12px; font-weight: 600; color: #e6edf3; line-height: 1.2; }
        .u-role { font-size: 10px; color: #7d8590; }
        .logout-btn { padding: 7px 16px; background: rgba(255,86,48,0.1); border: 1px solid rgba(255,86,48,0.2); border-radius: 8px; color: #ff7452; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .logout-btn:hover { background: rgba(255,86,48,0.18); }

        .filter-bar { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #7d8590; pointer-events: none; }
        .search-inp { width: 100%; background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1); border-radius: 10px; padding: 9px 12px 9px 36px; color: #e6edf3; font-size: 13px; font-family: 'Sora', sans-serif; outline: none; transition: all 0.2s; }
        .search-inp::placeholder { color: #484f58; }
        .search-inp:focus { border-color: rgba(88,166,255,0.35); background: rgba(88,166,255,0.04); }
        .filter-sel { background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1); border-radius: 10px; padding: 9px 12px; color: #c9d1d9; font-size: 12px; font-family: 'Sora', sans-serif; outline: none; cursor: pointer; }
        .clear-btn { padding: 9px 14px; background: rgba(255,86,48,0.1); border: 1px solid rgba(255,86,48,0.2); border-radius: 10px; color: #ff7452; font-size: 12px; cursor: pointer; font-family: 'Sora', sans-serif; white-space: nowrap; }
        .filter-active { display: inline-flex; align-items: center; gap: 4px; background: rgba(88,166,255,0.1); border: 1px solid rgba(88,166,255,0.2); border-radius: 20px; padding: 3px 10px; font-size: 11px; color: #58a6ff; }

        .main-content { position: relative; z-index: 1; padding: 28px; }
        .add-task-bar { background: rgba(22,27,34,0.85); border: 1px solid rgba(88,166,255,0.1); border-radius: 16px; padding: 0; margin-bottom: 20px; overflow: hidden; backdrop-filter: blur(16px); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .add-task-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; cursor: pointer; transition: background 0.2s; }
        .add-task-header:hover { background: rgba(88,166,255,0.04); }
        .add-task-header-left { display: flex; align-items: center; gap: 10px; }
        .add-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #0052cc, #0065ff); border-radius: 7px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,82,204,0.4); }
        .add-task-label { font-size: 13px; font-weight: 600; color: #c9d1d9; }
        .chevron { transition: transform 0.25s ease; color: #484f58; }
        .chevron.open { transform: rotate(180deg); }
        .add-form-body { padding: 0 20px 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 700px) { .form-grid { grid-template-columns: 1fr; } }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 800px) { .form-grid-3 { grid-template-columns: 1fr 1fr; } }
        .form-field label { display: block; font-size: 10px; font-weight: 600; color: #7d8590; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .form-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(88,166,255,0.1); border-radius: 10px; padding: 10px 14px; color: #e6edf3; font-size: 13px; font-family: 'Sora', sans-serif; outline: none; transition: all 0.2s; }
        .form-input::placeholder { color: #484f58; }
        .form-input:focus { border-color: rgba(88,166,255,0.4); background: rgba(88,166,255,0.04); box-shadow: 0 0 0 3px rgba(88,166,255,0.07); }
        .form-row { display: flex; gap: 12px; align-items: flex-end; }
        .img-drop { flex: 1; border: 1.5px dashed rgba(88,166,255,0.15); border-radius: 10px; padding: 10px 14px; cursor: pointer; font-size: 12px; color: #7d8590; display: flex; align-items: center; gap: 8px; transition: all 0.2s; background: rgba(88,166,255,0.02); }
        .img-drop:hover { border-color: rgba(88,166,255,0.3); background: rgba(88,166,255,0.05); }
        .img-drop span { color: #58a6ff; }
        .submit-btn { padding: 10px 24px; background: linear-gradient(135deg, #0052cc, #0065ff); border: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 700; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 12px rgba(0,82,204,0.35); white-space: nowrap; display: flex; align-items: center; justify-content: center; }
        .submit-btn:hover { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .board { grid-template-columns: 1fr; } }
        .column { background: rgba(22,27,34,0.7); border-radius: 16px; padding: 0; border: 1px solid rgba(88,166,255,0.07); backdrop-filter: blur(12px); overflow: hidden; min-height: 500px; }
        .col-header { padding: 16px 18px 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(88,166,255,0.07); position: sticky; top: 64px; background: rgba(22,27,34,0.95); backdrop-filter: blur(12px); z-index: 10; }
        .col-header-left { display: flex; align-items: center; gap: 8px; }
        .col-dot { width: 8px; height: 8px; border-radius: 50%; }
        .col-title { font-size: 13px; font-weight: 700; letter-spacing: -0.2px; }
        .col-count { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
        .col-body { padding: 70px 20px 20px; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; color: #484f58; text-align: center; }
        .empty-state svg { margin-bottom: 10px; opacity: 0.4; }
        .empty-state p { font-size: 12px; }
        .img-preview-thumb { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid rgba(88,166,255,0.2); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
        .toast { padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; color: #e6edf3; backdrop-filter: blur(20px); border: 1px solid rgba(88,166,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1); background: rgba(22,27,34,0.97); min-width: 220px; max-width: 340px; }
        .toast.error { border-color: rgba(255,86,48,0.25); }
        @keyframes toastIn { from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);} }
        .notif-wrap, .activity-wrap { position: relative; }
      `}</style>

      <div className="dash-root">
        <div className="bg-grid" />

        {/* modals */}
        {commentTask && <CommentsPanel task={commentTask} currentUser={currentUser} onClose={() => setCommentTask(null)} />}
        {historyTask && <HistoryPanel task={historyTask} onClose={() => setHistoryTask(null)} />}

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="14" rx="2" fill="white" opacity="0.9"/><rect x="14" y="3" width="7" height="9" rx="2" fill="white" opacity="0.6"/></svg>
            </div>
            <span className="nav-title">Task<span>Flow</span></span>
          </div>

          <div className="nav-right">

            {/* activity */}
            <div className="activity-wrap" ref={activityRef}>
              <button className="icon-btn" onClick={() => { setShowActivity(p => !p); setShowNotifs(false); }} title="Activity log">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                {activityLog.length > 0 && <span className="icon-badge">{activityLog.length > 9 ? "9+" : activityLog.length}</span>}
              </button>
              {showActivity && (
                <div className="drop-panel">
                  <div className="drop-panel-header">
                    <span className="drop-panel-title">Activity Log</span>
                    {activityLog.length > 0 && <button className="drop-panel-action" onClick={() => { setActivityLog([]); setShowActivity(false); }}>Clear</button>}
                  </div>
                  <div className="drop-panel-list">
                    {activityLog.length === 0 ? <div className="drop-panel-empty">No activity yet</div>
                      : activityLog.map(a => (
                          <div className="drop-panel-item" key={a.id}>
                            <div className="dp-dot activity" />
                            <div style={{ flex: 1 }}><div className="dp-text"><strong>{a.user}</strong> {a.msg}</div><div className="dp-meta">{a.date} · {a.time}</div></div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>

            {/* notifications */}
            <div className="notif-wrap" ref={notifRef}>
              <button className="icon-btn" onClick={() => { setShowNotifs(p => !p); setShowActivity(false); }} title="Notifications">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && <span className="icon-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="drop-panel">
                  <div className="drop-panel-header">
                    <span className="drop-panel-title">Notifications</span>
                    {notifications.length > 0 && <button className="drop-panel-action" onClick={() => { setNotifications([]); setShowNotifs(false); }}>Clear all</button>}
                  </div>
                  <div className="drop-panel-list">
                    {notifications.length === 0 ? <div className="drop-panel-empty">No notifications yet</div>
                      : notifications.map(n => (
                          <div className="drop-panel-item" key={n.id}>
                            <div className={`dp-dot ${n.type === "error" ? "error" : ""}`} />
                            <div style={{ flex: 1 }}><div className="dp-text">{n.msg}</div><div className="dp-meta">{n.time}</div></div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>

            {/* user chip */}
            <div className="user-chip">
              <div className="uav">{userAvatar ? <img src={userAvatar} alt="" /> : <span className="uav-init">{userInitial}</span>}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="u-name">{currentUser.name || "User"}</span>
                  <span className={`role-badge ${isAdmin ? "role-admin" : "role-user"}`}>{isAdmin ? "Admin" : "User"}</span>
                </div>
                <div className="u-role">{currentUser.email}</div>
              </div>
            </div>

            <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="main-content">
          {/* Add task */}
          <div className="add-task-bar">
            <div className="add-task-header" onClick={() => setShowAddForm(!showAddForm)}>
              <div className="add-task-header-left">
                <div className="add-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                <span className="add-task-label">Add new task</span>
              </div>
              <svg className={`chevron ${showAddForm ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6,9 12,15 18,9"/></svg>
            </div>
            {showAddForm && (
              <div className="add-form-body">
                <div style={{ height: "1px", background: "rgba(88,166,255,0.07)", marginBottom: "16px" }} />
                <form onSubmit={createTask}>
                  <div className="form-grid">
                    <div className="form-field"><label>Task title</label><input type="text" placeholder="What needs to be done?" className="form-input" value={title} required onChange={(e) => setTitle(e.target.value)} /></div>
                    <div className="form-field"><label>Description</label><input type="text" placeholder="Add details..." className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                  </div>
                  <div className="form-grid-3">
                    <div className="form-field"><label>Status</label><select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option></select></div>
                    <div className="form-field"><label>Priority</label><select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="low">🟢 Low</option><option value="medium">🟡 Medium</option><option value="high">🔴 High</option></select></div>
                    <div className="form-field"><label>Due Date</label><input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ colorScheme: "dark" }} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-field" style={{ minWidth: "180px" }}>
                      <label>Assign To</label>
                      <select className="form-input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                        <option value="">— Unassigned —</option>
                        {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Image (optional)</label>
                      <div className="img-drop" onClick={() => fileInputRef.current?.click()}>
                        {taskImagePreview ? <><img src={taskImagePreview} className="img-preview-thumb" alt="preview" /><span style={{ color: "#58a6ff" }}>Change</span></> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>Click to <span>upload</span></span></>}
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) { setTaskImage(f); const r = new FileReader(); r.onloadend = () => setTaskImagePreview(r.result); r.readAsDataURL(f); } }} />
                      </div>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isAdding}>{isAdding ? <span className="spin" /> : "Add Task"}</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Filter bar */}
          <div className="filter-bar">
            <div className="search-wrap">
              <span className="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
              <input className="search-inp" placeholder="Search by title, description, or user…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="filter-sel" value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
              <option value="">All users</option>
              {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <select className="filter-sel" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All priorities</option>
              <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select>
            {hasActiveFilter && <button className="clear-btn" onClick={() => { setSearchQuery(""); setFilterUser(""); setFilterPriority(""); }}>✕ Clear</button>}
            {hasActiveFilter && <span className="filter-active"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>Filtered</span>}
          </div>

          {/* Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="board">
              {colConfig.map((col) => (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided) => (
                    <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="col-header">
                        <div className="col-header-left">
                          <div className="col-dot" style={{ background: col.accent, boxShadow: `0 0 6px ${col.accent}` }} />
                          <span className="col-title" style={{ color: col.accent }}>{col.label}</span>
                        </div>
                        <span className="col-count" style={{ color: col.accent, background: col.accentBg, border: `1px solid ${col.accentBorder}` }}>{col.tasks.length}</span>
                      </div>
                      <div className="col-body">
                        {col.tasks.length === 0 ? (
                          <div className="empty-state">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                            <p>{hasActiveFilter ? "No matching tasks" : `No ${col.label.toLowerCase()} tasks yet`}</p>
                          </div>
                        ) : (
                          col.tasks.map((task, index) =>
                            editingTask === task._id ? (
                              <EditCard key={task._id} task={task} col={col} initialImagePreview={task.image || null} allUsers={allUsers} onSave={saveEdit} onCancel={() => setEditingTask(null)} />
                            ) : (
                              <Draggable draggableId={String(task._id)} index={index} key={String(task._id)}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <TaskCard task={task} col={col} isOwner={checkOwner(task)} canEdit={canEdit(task)} canDelete={canDelete(task)} onEdit={startEdit} onDeleteConfirm={setDeleteConfirm} deleteConfirm={deleteConfirm} onDeleteConfirmClose={() => setDeleteConfirm(null)} onDelete={handleDeleteTask} onMove={moveTask} onComment={setCommentTask} onHistory={setHistoryTask} />
                                  </div>
                                )}
                              </Draggable>
                            )
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>

        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>{t.msg}</div>)}
        </div>
      </div>
    </>
  );
}

export default Dashboard;