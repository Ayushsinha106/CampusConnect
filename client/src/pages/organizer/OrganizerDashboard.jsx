import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getOrganizerDashboard, getOrganizerEvents } from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

function OrganizerDashboard() {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboard = await getOrganizerDashboard();

        const organizerEvents = await getOrganizerEvents();

        setData(dashboard);
        setEvents(organizerEvents);
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
      <DashboardSidebar role="ORGANIZER" />

      <main className="dashboard-content">
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Welcome back, {data.organizer.name}</p>
          </div>

          <Link to="/organizer/events/create" className="btn btn-primary">
            + Create Event
          </Link>
        </div>

        {/* Statistics */}

        <div className="row g-4 mb-4">
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
                <div className="stat-label">Upcoming Events</div>

                <p className="stat-value">{data.statistics.upcomingEvents}</p>
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

          <div className="col-sm-6 col-xl-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">Avg. Attendance</div>

                <p className="stat-value">
                  {data.statistics.averageAttendance}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}

        <div className="dashboard-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Upcoming Events</h2>

            <Link
              to="/organizer/events"
              className="btn btn-outline-primary btn-sm"
            >
              View All
            </Link>
          </div>

          <div className="row g-3">
            {events.slice(0, 3).map((event) => {
              const percentage =
                event.capacity > 0
                  ? (event.occupiedSeats / event.capacity) * 100
                  : 0;

              return (
                <div className="col-12" key={event.id}>
                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="mb-1">{event.title}</h5>

                        <div className="event-meta">
                          {event.category.name}
                          {" • "}
                          {new Date(event.startDateTime).toLocaleDateString()}
                        </div>
                      </div>

                      <span
                        className={`badge ${
                          event.status === "APPROVED"
                            ? "text-bg-success"
                            : "text-bg-warning"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Registrations</small>

                        <small>
                          {event.occupiedSeats} / {event.capacity}
                        </small>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerDashboard;
