import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

function Profile() {
  const navigate = useNavigate();

  // Profile state

  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Registration state

  const [registrations, setRegistrations] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [registrationError, setRegistrationError] = useState("");

  // Created Events state

  const [createdEvents, setCreatedEvents] = useState([]);
  const [createdEventsLoading, setCreatedEventsLoading] = useState(true);
  const [createdEventsError, setCreatedEventsError] = useState("");

  // Fetch profile

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch profile");
        }

        setUser(result.data);
      } catch (err) {
        console.error(err);

        setProfileError(err.message || "Unable to load profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch registrations

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/me/registrations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch registrations");
        }

        setRegistrations(result.data || []);
      } catch (err) {
        console.error(err);

        setRegistrationError(err.message || "Unable to load your events");
      } finally {
        setRegistrationLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate]);

  // Fetch created events

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/me/organizer-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch created events");
        }

        setCreatedEvents(result.data || []);
      } catch (err) {
        console.error(err);

        setCreatedEventsError(err.message || "Unable to load created events");
      } finally {
        setCreatedEventsLoading(false);
      }
    };

    fetchCreatedEvents();
  }, [navigate]);

  // Logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Loading profile

  if (profileLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  // Profile error

  if (profileError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{profileError}</div>

        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Profile Information */}

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-3">My Profile</h2>

              <p className="mb-2">
                <strong>Name:</strong> {user?.name}
              </p>

              <p className="mb-2">
                <strong>Email:</strong> {user?.email}
              </p>

              <p className="mb-0">
                <strong>Role:</strong>{" "}
                <span className="badge bg-primary">{user?.role}</span>
              </p>
            </div>

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Registered Events */}

      <div>
        <h2 className="mb-4">My Registered Events</h2>

        {/* Loading */}

        {registrationLoading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-3">Loading your events...</p>
          </div>
        )}

        {/* Error */}

        {registrationError && (
          <div className="alert alert-danger">{registrationError}</div>
        )}

        {/* Empty */}

        {!registrationLoading &&
          !registrationError &&
          registrations.length === 0 && (
            <div className="alert alert-info">
              You haven't registered for any events yet.
              <div className="mt-3">
                <Link to="/events" className="btn btn-primary">
                  Browse Events
                </Link>
              </div>
            </div>
          )}

        {/* Registration Cards */}

        {!registrationLoading && registrations.length > 0 && (
          <div>
            {registrations.map((registration) => {
              const event = registration.event;

              const eventEnded = new Date(event.endDateTime) < new Date();

              return (
                <div
                  key={registration.registrationId}
                  className="card shadow-sm mb-4"
                >
                  <div className="row g-0">
                    {/* Event Image */}

                    {event.imageUrl && (
                      <div className="col-md-4">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="img-fluid rounded-start h-100"
                          style={{
                            objectFit: "cover",
                            minHeight: "220px",
                          }}
                        />
                      </div>
                    )}

                    {/* Event Information */}

                    <div className={event.imageUrl ? "col-md-8" : "col-12"}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <h4 className="card-title">{event.title}</h4>

                          <span
                            className={
                              registration.status === "CONFIRMED"
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {registration.status}
                          </span>
                        </div>

                        {/* Date */}

                        <p className="text-muted mb-2">
                          <strong>Date:</strong>{" "}
                          {new Date(event.startDateTime).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>

                        {/* Time */}

                        <p className="text-muted mb-2">
                          <strong>Time:</strong>{" "}
                          {new Date(event.startDateTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                          {" - "}
                          {new Date(event.endDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Venue */}

                        <p className="mb-2">
                          <strong>Venue:</strong> {event.venue?.name}
                        </p>

                        <p className="mb-3">
                          <strong>Location:</strong> {event.venue?.location}
                        </p>

                        {/* Attendance */}

                        <p className="mb-3">
                          <strong>Attendance:</strong>{" "}
                          {registration.attended ? (
                            <span className="badge bg-success">Attended</span>
                          ) : eventEnded ? (
                            <span className="badge bg-warning text-dark">
                              Not Attended
                            </span>
                          ) : (
                            <span className="badge bg-secondary">Upcoming</span>
                          )}
                        </p>

                        {/* Companions */}

                        <h6 className="mt-4">Companions</h6>

                        {registration.companions &&
                        registration.companions.length > 0 ? (
                          <ul className="mb-3">
                            {registration.companions.map((companion) => (
                              <li key={companion.id}>{companion.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No companions</p>
                        )}

                        {/* Actions */}

                        <div className="d-flex flex-wrap gap-2 mt-3">
                          <Link
                            to={`/events/${event.id}`}
                            className="btn btn-outline-primary"
                          >
                            View Event
                          </Link>

                          {/* Only allow
                                  companion management
                                  for confirmed
                                  registrations */}

                          {registration.status === "CONFIRMED" && (
                            <Link
                              to={`/registrations/${registration.registrationId}/companions`}
                              className="btn btn-outline-success"
                            >
                              Manage Companions
                            </Link>
                          )}

                          {/* Review button will
                                  be connected later */}

                          {registration.attended &&
                            eventEnded &&
                            registration.status === "CONFIRMED" &&
                            (registration.review ? (
                              <span className="btn btn-outline-success disabled">
                                ✓ Review Submitted
                              </span>
                            ) : (
                              <Link
                                to={`/events/${event.id}/review`}
                                className="btn btn-outline-warning"
                              >
                                Write Review
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Events you Created  */}

      <div className="mt-5">
        <h2 className="mb-4">Events You Created</h2>

        {/* Loading */}

        {createdEventsLoading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-3">Loading your created events...</p>
          </div>
        )}

        {/* Error */}

        {createdEventsError && (
          <div className="alert alert-danger">{createdEventsError}</div>
        )}

        {/* Empty */}

        {!createdEventsLoading &&
          !createdEventsError &&
          createdEvents.length === 0 && (
            <div className="alert alert-info">
              You haven't created any events.
            </div>
          )}

        {/* Events */}

        {!createdEventsLoading &&
          !createdEventsError &&
          createdEvents.length > 0 && (
            <div className="row g-4">
              {createdEvents.map((event) => {
                const eventEnded = new Date(event.endDateTime) < new Date();

                return (
                  <div className="col-12 col-md-6" key={event.id}>
                    <div className="card h-100 shadow-sm">
                      {/* Image */}

                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="card-img-top"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="card-body">
                        {/* Title */}

                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <h5 className="card-title mb-2">{event.title}</h5>

                          <span
                            className={
                              eventEnded
                                ? "badge bg-secondary"
                                : "badge bg-success"
                            }
                          >
                            {eventEnded ? "Completed" : "Upcoming"}
                          </span>
                        </div>

                        {/* Category */}

                        <p className="text-muted mb-2">
                          <strong>Category:</strong> {event.category?.name}
                        </p>

                        {/* Date */}

                        <p className="text-muted mb-2">
                          <strong>Date:</strong>{" "}
                          {new Date(event.startDateTime).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>

                        {/* Venue */}

                        <p className="text-muted mb-2">
                          <strong>Venue:</strong> {event.venue?.name}
                        </p>

                        {/* Seats */}

                        <p className="mb-3">
                          <strong>Seats:</strong> {event.occupiedSeats} /{" "}
                          {event.capacity}
                        </p>

                        {/* Actions */}

                        <div className="d-flex flex-wrap gap-2">
                          <Link
                            to={`/events/${event.id}`}
                            className="btn btn-outline-primary"
                          >
                            View Event
                          </Link>

                          <Link
                            to={`/events/${event.id}/edit`}
                            className="btn btn-outline-secondary"
                          >
                            Edit Event
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}

export default Profile;
