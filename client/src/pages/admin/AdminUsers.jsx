import { useEffect, useState } from "react";
import { Link } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import { getAdminUsers, updateUserRole } from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      setUsers(data);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(user) {
    const newRole = user.role === "STUDENT" ? "ORGANIZER" : "STUDENT";

    const action = newRole === "ORGANIZER" ? "promote" : "revoke";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(user.id);

      const updatedUser = await updateUserRole(user.id, newRole);

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role: updatedUser.role,
                updatedAt: updatedUser.updatedAt,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);

      alert(err.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

        <main className="dashboard-content">
          <p className="p-4">Loading users...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <Link to="/admin" className="btn btn-outline-secondary mb-3">
            ← Back to Dashboard
          </Link>

          <h1>User Management</h1>

          <p>Manage users and organizer permissions.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dashboard-section">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={
                          user.role === "ADMIN"
                            ? "badge text-bg-danger"
                            : user.role === "ORGANIZER"
                              ? "badge text-bg-primary"
                              : "badge text-bg-secondary"
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                    <td>
                      {user.role === "ADMIN" ? (
                        <span className="text-muted">Protected</span>
                      ) : (
                        <button
                          type="button"
                          className={
                            user.role === "STUDENT"
                              ? "btn btn-sm btn-primary"
                              : "btn btn-sm btn-outline-danger"
                          }
                          disabled={updatingId === user.id}
                          onClick={() => handleRoleChange(user)}
                        >
                          {updatingId === user.id
                            ? "Updating..."
                            : user.role === "STUDENT"
                              ? "Make Organizer"
                              : "Revoke Organizer"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
