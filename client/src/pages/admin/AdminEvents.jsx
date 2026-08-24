import { useEffect, useState } from "react";
import { Link } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import { getAdminEvents } from "../../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminEvents();

        setEvents(data);
        console.log("Fetched Admin Events:", data); // Log the data for debugging
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

        <main className="dashboard-content">
          <p className="p-4">Loading events...</p>
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

          <h1>Event Management</h1>

          <p>View all events created on CampusConnect.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dashboard-section">
          {events.length === 0 ? (
            <div className="alert alert-info">No events found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Organizer</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Capacity</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <strong>{event.title}</strong>
                      </td>

                      <td>{event.organizer.name}</td>

                      <td>{event.category.name}</td>

                      <td>{event.venue.name}</td>

                      <td>{new Date(event.startDateTime).toLocaleString()}</td>

                      <td>{event.capacity}</td>

                      <td>
                        <span
                          className={
                            event.isPublic
                              ? "badge text-bg-success"
                              : "badge text-bg-secondary"
                          }
                        >
                          {event.isPublic ? "Public" : "College Only"}
                        </span>
                      </td>

                      <td>
                        <Link
                          className="btn btn-outline-primary"
                          to={`/events/${event.id}/edit`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminEvents;
