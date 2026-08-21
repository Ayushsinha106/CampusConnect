import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAdminDashboard } from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await getAdminDashboard();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-4">Error: {error}</p>;
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>

          <p>System overview and administrative controls.</p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Users</div>

                <p className="stat-value">{data.statistics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Organizers</div>

                <p className="stat-value">{data.statistics.totalOrganizers}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Events</div>

                <p className="stat-value">{data.statistics.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Registrations</div>

                <p className="stat-value">
                  {data.statistics.totalRegistrations}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="dashboard-section">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Pending Approvals</h2>

                <Link
                  to="/admin/events/pending"
                  className="btn btn-sm btn-outline-primary"
                >
                  View All
                </Link>
              </div>

              <div className="list-group">
                {data.pendingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="list-group-item border-0 border-bottom px-0"
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1">{event.title}</h6>

                        <small className="text-muted">
                          {event.organizer.name}
                          {" • "}
                          {event.category.name}
                        </small>
                      </div>

                      <span className="badge text-bg-warning align-self-start">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="dashboard-section">
              <h2>Quick Actions</h2>

              <div className="d-grid gap-2 mt-3">
                <Link to="/admin/events/pending" className="btn btn-primary">
                  Review Events
                </Link>

                <Link to="/admin/events" className="btn btn-outline-secondary">
                  Manage Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
