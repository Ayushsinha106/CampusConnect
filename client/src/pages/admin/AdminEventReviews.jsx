import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import { getEventReviews } from "../../services/api";

function AdminEventReviews() {
  const { eventId } = useParams();

  const [reviews, setReviews] = useState([]);

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const result = await getEventReviews(eventId);

        console.log("Event reviews:", result);

        setReviews(result.reviews);

        setSummary(result.summary);
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [eventId]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

        <main className="dashboard-content">
          <p className="p-4">Loading reviews...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ADMIN" />

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
      <DashboardSidebar role="ADMIN" />

      <main className="dashboard-content">
        {/* Header */}

        <div className="dashboard-header">
          <Link to="/admin/events" className="btn btn-outline-secondary mb-3">
            ← Back to My Events
          </Link>

          <h1>Event Reviews</h1>

          <p>See what students thought about your event.</p>
        </div>

        {/* Summary */}

        {summary && (
          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Average Rating</div>

                  <p className="stat-value">
                    ⭐ {summary.averageRating}
                    {" / 5"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card stat-card">
                <div className="card-body">
                  <div className="stat-label">Total Reviews</div>

                  <p className="stat-value">{summary.totalReviews}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}

        <div className="dashboard-section">
          <h2 className="mb-4">Student Reviews</h2>

          {reviews.length === 0 ? (
            <div className="alert alert-info">
              No reviews have been submitted for this event yet.
            </div>
          ) : (
            <div className="row g-3">
              {reviews.map((review) => (
                <div className="col-12" key={review.id}>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{review.student.name}</h5>

                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        {/* Rating */}

                        <span className="fs-5">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>

                      {/* Comment */}

                      {review.comment ? (
                        <p className="mt-3 mb-0">{review.comment}</p>
                      ) : (
                        <p className="text-muted mt-3 mb-0">
                          No comment provided.
                        </p>
                      )}
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

export default AdminEventReviews;
