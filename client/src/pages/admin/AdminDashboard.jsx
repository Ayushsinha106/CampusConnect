import { useEffect, useState } from "react";
import { Link } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import {
  getAdminStatistics,
  getAdminUsers,
  getAdminEvents,
} from "../../services/api";

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);

  const [users, setUsers] = useState([]);

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [statisticsData, usersData, eventsData] = await Promise.all([
          getAdminStatistics(),
          getAdminUsers(),
          getAdminEvents(),
        ]);

        setStatistics(statisticsData);

        setUsers(usersData);

        setEvents(eventsData);
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

        <main className="dashboard-content">
          <p className="p-4">Loading dashboard...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

        <main className="dashboard-content">
          <div className="alert alert-danger">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        {/* Header */}

        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>

          <p>Manage CampusConnect from here.</p>
        </div>

        {/* User Statistics */}

        <h2 className="mb-3">Users</h2>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Users</div>
                <p className="stat-value">{statistics.users.total}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Students</div>
                <p className="stat-value">{statistics.users.students}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Organizers</div>
                <p className="stat-value">{statistics.users.organizers}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Admins</div>
                <p className="stat-value">{statistics.users.admins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Statistics */}

        <h2 className="mb-3">Events</h2>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Events</div>
                <p className="stat-value">{statistics.events.total}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Upcoming</div>
                <p className="stat-value">{statistics.events.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Ongoing</div>
                <p className="stat-value">{statistics.events.ongoing}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Completed</div>
                <p className="stat-value">{statistics.events.completed}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Public Events</div>
                <p className="stat-value">{statistics.events.public}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Private Events</div>
                <p className="stat-value">{statistics.events.private}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Capacity</div>
                <p className="stat-value">{statistics.events.totalCapacity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Event Statistics */}

        <h2 className="mb-3">Event Approvals</h2>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Pending Events</div>

                <p className="stat-value">{statistics.pendingEvents.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Statistics */}

        <h2 className="mb-3">Registrations</h2>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total</div>

                <p className="stat-value">{statistics.registrations.total}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Confirmed</div>

                <p className="stat-value">
                  {statistics.registrations.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Cancelled</div>

                <p className="stat-value">
                  {statistics.registrations.cancelled}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Attended</div>

                <p className="stat-value">
                  {statistics.registrations.attended}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Attendance Rate</div>

                <p className="stat-value">
                  {statistics.registrations.attendanceRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Companion Statistics */}

        <h2 className="mb-3">Seats & Companions</h2>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Companions</div>

                <p className="stat-value">{statistics.companions.total}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Occupied Seats</div>

                <p className="stat-value">
                  {statistics.companions.occupiedSeats}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Available Seats</div>

                <p className="stat-value">
                  {statistics.companions.availableSeats}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Statistics */}

        <h2 className="mb-3">Reviews</h2>

        <div className="row g-4 mb-5">
          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Total Reviews</div>

                <p className="stat-value">{statistics.reviews.total}</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Average Rating</div>

                <p className="stat-value">
                  ★ {statistics.reviews.averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">5 Star Reviews</div>

                <p className="stat-value">
                  {statistics.reviews.distribution.fiveStars}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">4 Star Reviews</div>

                <p className="stat-value">
                  {statistics.reviews.distribution.fourStars}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">3 Star Reviews</div>

                <p className="stat-value">
                  {statistics.reviews.distribution.threeStars}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">2 Star Reviews</div>

                <p className="stat-value">
                  {statistics.reviews.distribution.twoStars}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">1 Star Reviews</div>

                <p className="stat-value">
                  {statistics.reviews.distribution.oneStar}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}

        <div className="dashboard-section mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Recent Users</h2>

            <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="badge text-bg-secondary">
                        {user.role}
                      </span>
                    </td>

                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}

        <div className="dashboard-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Recent Events</h2>

            <Link to="/admin/events" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Visibility</th>
                </tr>
              </thead>

              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>

                    <td>{event.organizer.name}</td>

                    <td>{event.category.name}</td>

                    <td>
                      {new Date(event.startDateTime).toLocaleDateString()}
                    </td>

                    <td>{event.isPublic ? "Public" : "College Only"}</td>
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

export default AdminDashboard;
