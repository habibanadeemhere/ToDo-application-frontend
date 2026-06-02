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
          <button onClick={() => onComment(task)} title="Comments" style={{ width: "26px", height: "26px", background: "rgba(101,84,192,0.1)", border: "1px solid rgba(101,84,192,0.2)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>💬</button>
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
export default function Dashboard() {
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
  const notifiedDeadlines = useRef(new Set());

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

  // ── Polling — replaces Socket.io ─────────────────────────────────────────────
  useEffect(() => {
    const myId = String(currentUser._id || currentUser.id || "");

    const poll = async () => {
      try {
        const res = await API.get("/tasks");
        const fresh = res.data.tasks || res.data;
        const prev = prevTasksRef.current;

        fresh.forEach((t) => {
          const creatorId = String(typeof t.user === "object" ? t.user?._id : t.user);
          const existed = prev.find((p) => p._id === t._id);

          if (!existed && creatorId !== myId) {
            addToast(`📌 ${t.user?.name || "Someone"} created "${t.title}"`);
            logActivity(`${t.user?.name || "Someone"} created "${t.title}"`);
          }

          if (existed && existed.status !== t.status && creatorId !== myId) {
            addToast(`🔄 "${t.title}" moved to ${t.status}`);
          }

          const oldCount = existed?.comments?.length || 0;
          const freshCount = t.comments?.length || 0;

          if (freshCount > oldCount) {
            const latest = t.comments?.[t.comments.length - 1];
            const commenterId = String(typeof latest?.user === "object" ? latest?.user?._id : latest?.user);
            if (commenterId !== myId) {
              addToast(`💬 New comment on "${t.title}"`);
            }
          }
        });

        const now = new Date();
        fresh.forEach((t) => {
          if (!t.dueDate || t.status === "done") return;
          const diff = (new Date(t.dueDate) - now) / (1000 * 60 * 60);

          if (diff > 0 && diff <= 24 && !notifiedDeadlines.current.has(`due-${t._id}`)) {
            addToast(`⏰ "${t.title}" due in < 24h`);
            notifiedDeadlines.current.add(`due-${t._id}`);
          }

          if (diff < 0 && !notifiedDeadlines.current.has(`overdue-${t._id}`)) {
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
  }, [currentUser._id, currentUser.id, addToast, logActivity]);

  useEffect(() => {
    refreshTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    prevTasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (activityRef.current && !activityRef.current.contains(e.target)) setShowActivity(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
      setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium"); setDueDate(""); setAssignedTo(""); setTaskImage(null); setTaskImagePreview(null);
      setShowAddForm(false);
      await refreshTasks();
      addToast("✅ Task created!");
      logActivity(`Created task "${title}"`);
    } catch (err) {
      addToast("❌ Failed to create task", "error");
    } {
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
      setEditingTask(null);
      await refreshTasks();
      addToast("✏️ Task updated!");
      logActivity(`Updated task "${t?.title}"`);
    } catch {
      addToast("❌ Update failed", "error");
    }
  };

  // ── Column Visual Configurations Matching Your Styling Theme ─────────────────
  const columnsConfig = {
    todo: { label: "To Do", accent: "#58a6ff", accentBg: "rgba(88,166,255,0.05)", accentBorder: "rgba(88,166,255,0.2)" },
    inprogress: { label: "In Progress", accent: "#ffab00", accentBg: "rgba(255,171,0,0.05)", accentBorder: "rgba(255,171,0,0.2)" },
    done: { label: "Done", accent: "#3fb950", accentBg: "rgba(63,185,80,0.05)", accentBorder: "rgba(63,185,80,0.2)" }
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Sora, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>📋 Project Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#7d8590" }}>Welcome back, {currentUser.name || "User"}</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#238636", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            {showAddForm ? "Close Form" : "➕ New Task"}
          </button>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input type="text" placeholder="🔍 Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "8px 12px", background: "#161b22", border: "1px solid #30363d", borderRadius: "6px", color: "#fff", width: "240px", outline: "none" }} />
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: "8px 12px", background: "#161b22", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9" }}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* CONDITIONAL TASK FORM */}
      {showAddForm && (
        <form onSubmit={createTask} style={{ background: "#161b22", border: "1px solid #30363d", padding: "20px", borderRadius: "12px", marginBottom: "24px", maxWidth: "500px" }}>
          <h3 style={{ marginBottom: "12px" }}>Create Task</h3>
          <input required type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#fff" }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#fff" }} />
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1, padding: "8px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#fff" }}>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ flex: 1, padding: "8px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#fff" }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" disabled={isAdding} style={{ width: "100%", padding: "10px", background: "#238636", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
            {isAdding ? "Saving..." : "Create"}
          </button>
        </form>
      )}

      {/* KANBAN BOARD SYSTEM WITH EXPLICIT FUNCTION RENDERING PROPERTIES */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "start" }}>
          
          {Object.keys(columnsConfig).map(colKey => {
            const col = columnsConfig[colKey];
            const colTasks = tasks.filter(t => t.status === colKey && (
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              (!filterPriority || t.priority === filterPriority)
            ));

            return (
              <div key={colKey} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", padding: "16px", minHeight: "500px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: col.accent }}>
                  <span>{col.label}</span>
                  <span style={{ fontSize: "12px", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "10px", color: "#7d8590" }}>{colTasks.length}</span>
                </h2>

                <Droppable droppableId={colKey}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: "450px" }}>
                      
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={String(task._id)} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              
                              {editingTask === task._id ? (
                                <EditCard 
                                  task={task} 
                                  col={col} 
                                  initialImagePreview={task.image} 
                                  allUsers={allUsers} 
                                  onCancel={() => setEditingTask(null)} 
                                  onSave={saveEdit} 
                                />
                              ) : (
                                <TaskCard
                                  task={task}
                                  col={col}
                                  canEdit={canEdit(task)}
                                  canDelete={canDelete(task)}
                                  onEdit={() => startEdit(task)}
                                  onDeleteConfirm={(id) => setDeleteConfirm(id)}
                                  deleteConfirm={deleteConfirm}
                                  onDeleteConfirmClose={() => setDeleteConfirm(null)}
                                  onDelete={handleDeleteTask}
                                  onMove={moveTask}
                                  onComment={(t) => setCommentTask(t)}
                                  onHistory={(t) => setHistoryTask(t)}
                                />
                              )}

                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

              </div>
            );
          })}

        </div>
      </DragDropContext>

      {/* FLOATING SYSTEM TOASTS */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: t.type === "error" ? "#f85149" : "#238636", color: "#fff", padding: "12px 24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", fontSize: "13px", fontWeight: "600" }}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* PORTALS & MODALS */}
      {commentTask && <CommentsPanel task={commentTask} currentUser={currentUser} onClose={() => setCommentTask(null)} />}
      {historyTask && <HistoryPanel task={historyTask} onClose={() => setHistoryTask(null)} />}

    </div>
  );
}