import { useEffect, useState } from "react";
import { getPendingEvents } from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getPendingEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  function handleApprove(id) {
    setEvents((previous) => previous.filter((event) => event.id !== id));
  }

  function handleReject(id) {
    setEvents((previous) => previous.filter((event) => event.id !== id));
  }

  if (loading) {
    return <p className="p-4">Loading pending events...</p>;
  }

  if (error) {
    return <p className="p-4">Error: {error}</p>;
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="h2">Pending Approvals</h1>

          <p>Review events submitted by organizers.</p>
        </div>

        {events.length === 0 ? (
          <div className="dashboard-section text-center">
            <h4>All caught up!</h4>

            <p className="text-muted">
              There are no events waiting for approval.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {events.map((event) => (
              <div className="col-lg-6" key={event.id}>
                <div className="card management-card h-100">
                  <img
                    src={event.image}
                    className="card-img-top event-image"
                    alt={event.title}
                  />

                  <div className="card-body">
                    <div className="mb-2">
                      <span className="badge text-bg-primary">
                        {event.category.name}
                      </span>

                      <span className="badge text-bg-warning ms-2">
                        Pending Review
                      </span>
                    </div>

                    <h4>{event.title}</h4>

                    <p className="text-muted">{event.description}</p>

                    <hr />

                    <div className="small">
                      <p className="mb-1">
                        <strong>Organizer:</strong> {event.organizer.name}
                      </p>

                      <p className="mb-1">
                        <strong>Venue:</strong> {event.venue.name}
                      </p>

                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {new Date(event.startDate).toLocaleString()}
                      </p>

                      <p className="mb-1">
                        <strong>Capacity:</strong> {event.capacity}
                      </p>

                      <p>
                        <strong>Visibility:</strong> {event.visibility}
                      </p>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => handleApprove(event.id)}
                      >
                        ✓ Approve
                      </button>

                      <button
                        className="btn btn-outline-danger flex-grow-1"
                        onClick={() => handleReject(event.id)}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PendingEvents;
