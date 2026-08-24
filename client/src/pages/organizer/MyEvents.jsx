import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getOrganizerEvents } from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getOrganizerEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <p className="p-4">Loading events...</p>;
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
            <h1>My Events</h1>
            <p>Create and manage your events.</p>
          </div>

          <Link to="/organizer/events/create" className="btn btn-primary">
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="dashboard-section text-center">
            <h4>No events yet</h4>
            <p className="text-muted">
              Create your first event to get started.
            </p>
          </div>
        ) : (
          events.map((event) => {
            const availableSeats = event.availableSeats;

            const percentage = (event.occupiedSeats / event.capacity) * 100;

            return (
              <div className="card management-card" key={event.id}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2 mb-3 mb-md-0">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="img-fluid rounded"
                      />
                    </div>

                    <div className="col-md-7">
                      <div className="mb-2">
                        <span className="badge text-bg-primary me-2">
                          {event.category.name}
                        </span>

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

                      <h4>{event.title}</h4>

                      <p className="event-meta mb-1">
                        {new Date(event.startDate).toLocaleDateString()}
                        {" • "}
                        {event.venue.name}
                      </p>

                      <div className="mt-3">
                        <div className="d-flex justify-content-between">
                          <small>Registrations</small>

                          <small>
                            {event.occupiedSeats} / {event.capacity}
                          </small>
                        </div>

                        <div className="progress mt-1">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <small className="text-muted">
                        {availableSeats} seats remaining
                      </small>
                    </div>

                    <div className="col-md-3">
                      <div className="d-grid gap-2">
                        <Link
                          className="btn btn-outline-primary"
                          to={`/events/${event.id}/edit`}
                        >
                          Edit Event
                        </Link>

                        <Link
                          className="btn btn-outline-dark"
                          to={`/organizer/events/${event.id}/registrations`}
                        >
                          Registrations
                        </Link>
                        <Link
                          to={`/organizer/events/${event.id}/reviews`}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Reviews
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default MyEvents;
