import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import { getEventRegistrations, markAttendance } from "../../services/api";

function EventRegistrations() {
  const { eventId } = useParams();

  const [registrations, setRegistrations] = useState([]);

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // --------------------------------
  // Load registrations
  // --------------------------------

  async function loadRegistrations() {
    try {
      setLoading(true);
      setError("");

      const result = await getEventRegistrations(eventId);

      setRegistrations(result.registrations);
      console.log("Registrations:", result); // Log the registrations for debugging
      setSummary(result.summary);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, [eventId]);

  // --------------------------------
  // Attendance
  // --------------------------------

  async function handleAttendance(registrationId, attended) {
    try {
      setUpdatingId(registrationId);

      await markAttendance(registrationId, attended);

      // Update UI without
      // fetching everything again

      // Update summary
    } catch (err) {
      console.error(err);

      alert(err.message || "Failed to update attendance");
    } finally {
      setUpdatingId(null);
    }
  }

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ORGANIZER" />

        <main className="dashboard-content">
          <p className="p-4">Loading registrations...</p>
        </main>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ORGANIZER" />

        <main className="dashboard-content">
          <div className="alert alert-danger">{error}</div>

          <Link to="/organizer/events" className="btn btn-outline-primary">
            ← Back to My Events
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ORGANIZER" />

      <main className="dashboard-content">
        {/* Header */}

        <div className="dashboard-header">
          <Link
            to="/organizer/events"
            className="btn btn-outline-secondary mb-3"
          >
            ← Back to My Events
          </Link>

          <h1>Event Registrations</h1>

          <p>Manage registered students and attendance.</p>
        </div>

        {/* Summary */}

        {summary && (
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Registrations</div>

                  <p className="stat-value">{summary.confirmedRegistrations}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Companions</div>

                  <p className="stat-value">{summary.totalCompanions}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Attended</div>

                  <p className="stat-value">{summary.attendedStudents}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Seats</div>

                  <p className="stat-value">
                    {summary.totalOccupiedSeats}
                    {" / "}
                    {summary.capacity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registrations */}

        <div className="dashboard-section">
          <h2 className="mb-4">Registered Students</h2>

          {registrations.length === 0 ? (
            <div className="alert alert-info">
              No students have registered for this event yet.
            </div>
          ) : (
            <div className="row g-3">
              <div className="col-12" key={registrations.id}>
                <div className="card">
                  <div className="card-body">
                    {/* Student */}

                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{registrations.student.name}</h5>

                        <p className="text-muted mb-2">
                          {registrations.student.email}
                        </p>
                      </div>

                      {/* Attendance */}

                      {registrations.attended ? (
                        <span className="badge text-bg-success">
                          ✓ Attended
                        </span>
                      ) : (
                        <span className="badge text-bg-secondary">
                          Not Attended
                        </span>
                      )}
                    </div>

                    {/* Companions */}

                    <div className="mt-3">
                      <strong>Companions</strong>

                      {registrations.companions.length === 0 ? (
                        <p className="text-muted mb-0">No companions</p>
                      ) : (
                        <ul className="mb-0">
                          {registrations.companions.map((companion) => (
                            <li key={companion.id}>{companion.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Attendance button */}

                    <div className="mt-3">
                      <button
                        type="button"
                        className={
                          registrations.attended
                            ? "btn btn-outline-danger"
                            : "btn btn-success"
                        }
                        disabled={updatingId === registrations.id}
                        onClick={() =>
                          handleAttendance(
                            registrations.id,
                            !registrations.attended,
                          )
                        }
                      >
                        {updatingId === registrations.id
                          ? "Updating..."
                          : registrations.attended
                            ? "Remove Attendance"
                            : "Mark Attended"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EventRegistrations;
