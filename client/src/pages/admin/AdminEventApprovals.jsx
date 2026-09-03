import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardSidebar from "../../components/DashboardSidebar";

import {
  getPendingEvents,
  approvePendingEvent,
  rejectPendingEvent,
} from "../../services/api";

export default function AdminEventApprovals() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPendingEvents();
  }, []);

  async function loadPendingEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingEvents();

      setPendingEvents(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load pending events");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(event) {
    const confirmed = window.confirm(
      `Are you sure you want to approve "${event.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(event.id);
      setError("");

      await approvePendingEvent(event.id);

      // Remove approved event from the list
      setPendingEvents((prev) =>
        prev.filter((pendingEvent) => pendingEvent.id !== event.id),
      );
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to approve event");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(event) {
    const confirmed = window.confirm(
      `Are you sure you want to reject "${event.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(event.id);
      setError("");

      await rejectPendingEvent(event.id);

      // Remove rejected event from the list
      setPendingEvents((prev) =>
        prev.filter((pendingEvent) => pendingEvent.id !== event.id),
      );
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to reject event");
    } finally {
      setProcessingId(null);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <DashboardSidebar role="ADMIN" />

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-1">Event Approvals</h1>

              <p className="text-muted mb-0">
                Review events submitted by organizers.
              </p>
            </div>

            <span className="badge bg-warning text-dark fs-6">
              {pendingEvents.length} Pending
            </span>
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" />

              <p className="mt-3 text-muted">Loading pending events...</p>
            </div>
          ) : pendingEvents.length === 0 ? (
            /* Empty state */
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <h4 className="mb-2">No pending events</h4>

                <p className="text-muted mb-0">
                  There are currently no events waiting for approval.
                </p>
              </div>
            </div>
          ) : (
            /* Pending events */
            <div className="row g-4">
              {pendingEvents.map((event) => (
                <div className="col-12" key={event.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="row">
                        {/* Image */}
                        <div className="col-md-3 mb-3 mb-md-0">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{
                                width: "100%",
                                height: "180px",
                              }}
                            >
                              <span className="text-muted">No image</span>
                            </div>
                          )}
                        </div>

                        {/* Event information */}
                        <div className="col-md-9">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h3 className="mb-1">{event.title}</h3>

                              <span className="badge bg-secondary">
                                {event.category?.name || "No category"}
                              </span>
                            </div>
                          </div>

                          <p className="text-muted">{event.description}</p>

                          <div className="row mb-3">
                            <div className="col-md-6 mb-2">
                              <strong>Organizer</strong>

                              <br />

                              {event.organizer?.name || "Unknown"}
                            </div>

                            <div className="col-md-6 mb-2">
                              <strong>Venue</strong>

                              <br />

                              {event.venue?.name || "Unknown"}

                              {event.venue?.location && (
                                <span className="text-muted">
                                  {" "}
                                  — {event.venue.location}
                                </span>
                              )}
                            </div>

                            <div className="col-md-6 mb-2">
                              <strong>Start</strong>
                              <br />
                              {formatDate(event.startDateTime)} at{" "}
                              {formatTime(event.startDateTime)}
                            </div>

                            <div className="col-md-6 mb-2">
                              <strong>End</strong>
                              <br />
                              {formatDate(event.endDateTime)} at{" "}
                              {formatTime(event.endDateTime)}
                            </div>

                            <div className="col-md-6 mb-2">
                              <strong>Capacity</strong>

                              <br />

                              {event.capacity}
                            </div>

                            <div className="col-md-6 mb-2">
                              <strong>Visibility</strong>

                              <br />

                              {event.isPublic ? "Public" : "Private"}
                            </div>
                          </div>

                          <hr />

                          {/* Actions */}
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-success"
                              disabled={processingId === event.id}
                              onClick={() => handleApprove(event)}
                            >
                              {processingId === event.id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger"
                              disabled={processingId === event.id}
                              onClick={() => handleReject(event)}
                            >
                              {processingId === event.id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
