import { useEffect, useState } from "react";
import { getAdminEvents } from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getAdminEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  function handleCancel(id) {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === id
          ? {
              ...event,
              status: "CANCELLED",
            }
          : event,
      ),
    );
  }

  if (loading) {
    return <p className="p-4">Loading events...</p>;
  }

  if (error) {
    return <p className="p-4">Error: {error}</p>;
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Manage Events</h1>

          <p>Monitor and manage events across CampusConnect.</p>
        </div>

        <div className="dashboard-section">
          <div className="table-responsive">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.title}</strong>
                    </td>

                    <td>{event.organizer}</td>

                    <td>{event.category}</td>

                    <td>{event.date}</td>

                    <td>
                      {event.registrations} / {event.capacity}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          event.status === "APPROVED"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td>
                      {event.status === "APPROVED" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancel(event.id)}
                        >
                          Cancel
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

export default ManageEvents;
