import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEventById } from "../services/api";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registration, setRegistration] = useState(null);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");

    setRegistrationMessage("");
    setRegistrationError("");

    if (!token) {
      setRegistrationError("Please login before registering for an event.");

      return;
    }

    if (event.availableSeats <= 0) {
      setRegistrationError("This event is currently full.");

      return;
    }

    try {
      setRegistering(true);

      const response = await fetch(
        `http://localhost:5000/api/registrations/events/${event.id}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();
      console.log("Registration response:", result);
      setRegistration(result.data);

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setRegistrationMessage(
        "You have successfully registered for this event!",
      );

      // Update availability immediately
      setEvent((previousEvent) => ({
        ...previousEvent,

        registeredCount: previousEvent.registeredCount + 1,

        occupiedSeats: previousEvent.occupiedSeats + 1,

        availableSeats: Math.max(previousEvent.availableSeats - 1, 0),
      }));
    } catch (err) {
      console.error(err);

      setRegistrationError(err.message || "Unable to register for this event.");
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5000/api/events/${id}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch event");
        }

        setEvent(result.data);
        console.log("registration:", result.data);
      } catch (err) {
        console.error(err);

        setError(err.message || "Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>

        <Link to="/events" className="btn btn-secondary">
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">Event not found.</div>
      </div>
    );
  }
  console.log("Available Seats:", event);
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="img-fluid rounded mb-4"
          />

          <h1>{event.title}</h1>

          <p className="text-muted">{event.description}</p>

          <hr />

          <h5>Event Information</h5>

          <p>
            <strong>Category:</strong> {event.category?.name}
          </p>

          <p>
            <strong>Venue:</strong> {event.venue?.name}
          </p>

          <p>
            <strong>Location:</strong> {event.venue?.location}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.startDateTime).toLocaleDateString()}
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {new Date(event.startDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {new Date(event.endDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p>
            <strong>Organizer:</strong> {event.organizer?.name}
          </p>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Registration</h5>

              <p>
                <strong>{event.availableSeats}</strong> seats available
              </p>

              <p>Capacity: {event.capacity}</p>

              {event.isPublic && (
                <span className="badge bg-success mb-3">Public Event</span>
              )}

              {registrationMessage && (
                <div className="alert alert-success">
                  <div>{registrationMessage}</div>

                  {event.isPublic && registration && (
                    <Link
                      to={`/registrations/${registration.id}/companions`}
                      className="btn btn-outline-success mt-3"
                    >
                      Add Companions
                    </Link>
                  )}
                </div>
              )}

              {registrationError && (
                <div className="alert alert-danger">{registrationError}</div>
              )}

              <button
                className="btn btn-primary w-100"
                onClick={handleRegister}
                disabled={registering || event.availableSeats <= 0}
              >
                {registering
                  ? "Registering..."
                  : event.availableSeats <= 0
                    ? "Event Full"
                    : "Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
