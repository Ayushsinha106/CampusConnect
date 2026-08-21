import { Link } from "react-router";

function EventCard({ event }) {
  const availableSeats = event.capacity - event.registeredCount;

  return (
    <div className="col">
      <div className="card event-card shadow-sm">
        <img
          src={event.image}
          className="card-img-top event-image"
          alt={event.title}
        />

        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <span className="badge text-bg-primary">{event.category.name}</span>{" "}
            <span
              className={`badge ${
                event.visibility === "PUBLIC"
                  ? "text-bg-success"
                  : "text-bg-secondary"
              }`}
            >
              {event.visibility === "PUBLIC" ? "Public" : "College Only"}
            </span>
          </div>

          <h5 className="card-title">{event.title}</h5>

          <p className="card-text text-muted">{event.description}</p>

          <p className="mb-1">
            <strong>Venue:</strong> {event.venue.name}
          </p>

          <p className="mb-1">
            <strong>Date:</strong>{" "}
            {new Date(event.startDate).toLocaleDateString()}
          </p>

          <p className="mb-3">
            <strong>Seats:</strong> {availableSeats} available
          </p>

          <div className="mt-auto">
            <Link className="btn btn-primary w-100" to={`/events/${event.id}`}>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
