import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEventById } from "../services/api";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(id);

        if (!data) {
          throw new Error("Event not found");
        }

        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (error) {
    return (
      <main>
        <h1>Something went wrong</h1>
        <p>{error}</p>

        <Link to="/events">Back to Events</Link>
      </main>
    );
  }

  const availableSeats = event.capacity - event.registeredCount;

  return (
    <main>
      <Link to="/events">← Back to Events</Link>

      <img src={event.image} alt={event.title} width="600" />

      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <hr />

      <h3>Event Information</h3>

      <p>
        <strong>Category:</strong> {event.category.name}
      </p>

      <p>
        <strong>Venue:</strong> {event.venue.name}
      </p>

      <p>
        <strong>Organizer:</strong> {event.organizer.name}
      </p>

      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>

      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>

      <p>
        <strong>Registration Deadline:</strong>{" "}
        {new Date(event.registrationDeadline).toLocaleString()}
      </p>

      <p>
        <strong>Capacity:</strong> {event.capacity}
      </p>

      <p>
        <strong>Available Seats:</strong> {availableSeats}
      </p>

      <p>
        <strong>Event Type:</strong>{" "}
        {event.visibility === "PUBLIC" ? "Public Event" : "College Only"}
      </p>

      <button>Register for Event</button>
    </main>
  );
}

export default EventDetails;
