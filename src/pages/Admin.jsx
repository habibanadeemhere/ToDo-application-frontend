import { useEffect, useState } from "react";
import API from "../services/api";

function Admin() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // MAKE ADMIN
  const makeAdmin = async (id) => {
    try {
      await API.put(`/admin/make-admin/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`

      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      body{
        font-family:'Sora',sans-serif;
        background:#0d1117;
      }

      .dash-root{
        min-height:100vh;
        background:#0d1117;
        color:#e6edf3;
      }

      .bg-grid{
        position:fixed;
        inset:0;
        background-image:
        linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px);
        background-size:40px 40px;
        z-index:0;
      }

      /* NAVBAR */

      .navbar{
        position:sticky;
        top:0;
        z-index:100;
        height:70px;
        background:rgba(13,17,23,0.92);
        backdrop-filter:blur(20px);
        border-bottom:1px solid rgba(88,166,255,0.08);

        display:flex;
        align-items:center;
        justify-content:space-between;

        padding:0 30px;
      }

      .nav-brand{
        display:flex;
        align-items:center;
        gap:10px;
      }

      .nav-logo{
        width:34px;
        height:34px;
        border-radius:10px;
        background:linear-gradient(135deg,#0052cc,#00b8d9);

        display:flex;
        align-items:center;
        justify-content:center;

        font-weight:700;
        color:white;
      }

      .nav-title{
        font-size:20px;
        font-weight:800;
      }

      .nav-title span{
        color:#58a6ff;
      }

      .logout-btn{
        padding:10px 18px;
        border:none;
        border-radius:10px;
        background:rgba(255,86,48,0.1);
        border:1px solid rgba(255,86,48,0.2);
        color:#ff7452;
        cursor:pointer;
        font-weight:600;
      }

      .logout-btn:hover{
        background:rgba(255,86,48,0.18);
      }

      /* CONTENT */

      .main-content{
        position:relative;
        z-index:1;
        padding:30px;
      }

      .top-bar{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:25px;
        flex-wrap:wrap;
        gap:15px;
      }

      .page-title{
        font-size:30px;
        font-weight:800;
      }

      .page-title span{
        color:#58a6ff;
      }

      .search-wrap{
        position:relative;
        width:320px;
      }

      .search-input{
        width:100%;
        background:rgba(22,27,34,0.9);
        border:1px solid rgba(88,166,255,0.1);
        border-radius:12px;
        padding:12px 14px;
        color:white;
        outline:none;
        font-family:'Sora';
      }

      .search-input:focus{
        border-color:#58a6ff;
      }

      /* TABLE */

      .table-wrap{
        overflow-x:auto;
        background:rgba(22,27,34,0.75);
        border:1px solid rgba(88,166,255,0.08);
        border-radius:18px;
        backdrop-filter:blur(16px);
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      thead{
        background:rgba(88,166,255,0.04);
      }

      th{
        text-align:left;
        padding:18px;
        font-size:12px;
        color:#7d8590;
        text-transform:uppercase;
        letter-spacing:1px;
      }

      td{
        padding:18px;
        border-top:1px solid rgba(88,166,255,0.06);
        font-size:14px;
      }

      tr:hover{
        background:rgba(88,166,255,0.03);
      }

      .user-info{
        display:flex;
        align-items:center;
        gap:12px;
      }

      .avatar{
        width:42px;
        height:42px;
        border-radius:50%;
        background:linear-gradient(135deg,#0052cc,#00b8d9);

        display:flex;
        align-items:center;
        justify-content:center;

        font-weight:700;
        color:white;
      }

      .user-name{
        font-weight:600;
      }

      .user-email{
        font-size:12px;
        color:#7d8590;
        margin-top:2px;
      }

      .role-badge{
        padding:5px 12px;
        border-radius:30px;
        font-size:11px;
        font-weight:700;
      }

      .admin{
        background:rgba(255,171,0,0.12);
        color:#ffab00;
        border:1px solid rgba(255,171,0,0.2);
      }

      .user{
        background:rgba(88,166,255,0.1);
        color:#58a6ff;
        border:1px solid rgba(88,166,255,0.2);
      }

      .actions{
        display:flex;
        gap:10px;
      }

      .btn{
        border:none;
        padding:8px 14px;
        border-radius:10px;
        cursor:pointer;
        font-size:12px;
        font-weight:700;
        transition:0.2s;
      }

      .btn:hover{
        transform:translateY(-1px);
      }

      .delete-btn{
        background:rgba(255,86,48,0.12);
        color:#ff7452;
        border:1px solid rgba(255,86,48,0.2);
      }

      .admin-btn{
        background:rgba(0,82,204,0.15);
        color:#58a6ff;
        border:1px solid rgba(88,166,255,0.2);
      }

      `}</style>

      <div className="dash-root">

        <div className="bg-grid"></div>

        {/* NAVBAR */}

        <div className="navbar">

          <div className="nav-brand">
            <div className="nav-logo">T</div>

            <div className="nav-title">
              Task<span>Flow</span>
            </div>
          </div>

          <button className="logout-btn">
            Logout
          </button>

        </div>

        {/* CONTENT */}

        <div className="main-content">

          <div className="top-bar">

            <h1 className="page-title">
              Admin <span>Dashboard</span>
            </h1>

            <div className="search-wrap">
              <input
                type="text"
                placeholder="Search users..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          {/* TABLE */}

          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user._id}>

                    <td>
                      <div className="user-info">

                        <div className="avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="user-name">
                            {user.name}
                          </div>

                          <div className="user-email">
                            Joined TaskFlow
                          </div>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>{user.email}</td>

                    <td>

                      <div className="actions">

                        {user.role !== "admin" && (
                          <button
                            className="btn admin-btn"
                            onClick={() => makeAdmin(user._id)}
                          >
                            Make Admin
                          </button>
                        )}

                        <button
                          className="btn delete-btn"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

export default Admin;