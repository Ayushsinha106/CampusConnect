import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Review() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          eventId: Number(eventId),
          rating: Number(rating),
          comment: comment.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review");
      }

      setSuccess("Your review was submitted successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-2">Write a Review</h2>

              <p className="text-muted">
                Tell us about your experience at this event.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/* Rating */}

                <div className="mb-4">
                  <label className="form-label">Rating</label>

                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>5 - Excellent</option>

                    <option value={4}>4 - Very Good</option>

                    <option value={3}>3 - Good</option>

                    <option value={2}>2 - Poor</option>

                    <option value={1}>1 - Very Poor</option>
                  </select>
                </div>

                {/* Comment */}

                <div className="mb-4">
                  <label className="form-label">Comment</label>

                  <textarea
                    className="form-control"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
