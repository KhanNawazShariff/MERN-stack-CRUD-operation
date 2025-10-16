import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";

const Users = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);

 const getUsers = async () => {
  try {
    const { data } = await axios.get("/api/auth/all-users", {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    if (data?.success) setUsers(data.users);
  } catch (err) {
    toast.error("Failed to load users");
  }
};

  const toggleUserStatus = async (id) => {
  try {
    const { data } = await axios.put(`/api/auth/toggle-user/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    toast.success(data.message);
    getUsers();
  } catch (err) {
    toast.error("Failed to update user status");
  }
};


  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title={"Manage Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card p-3">
              <h4>User Management</h4>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="d-flex justify-content-between align-items-center border p-2 rounded mb-2"
                  >
                    <div>
                      <strong>{user.name}</strong> - {user.email}
                      <br />
                      Status:{" "}
                      <b style={{ color: user.isActive ? "green" : "red" }}>
                        {user.isActive ? "Active" : "Deactivated"}
                      </b>
                    </div>
                    <button
                      className={`btn btn-sm ${
                        user.isActive ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() => toggleUserStatus(user._id)}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
