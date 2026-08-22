import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Companions() {
  const { registrationId } = useParams();

  const [companions, setCompanions] = useState([]);
  const [names, setNames] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCompanions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/companions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch companions");
      }

      setCompanions(result.data);
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to load companions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanions();
  }, [registrationId]);

  const handleAddCompanion = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const companionNames = names
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (companionNames.length === 0) {
      setError("Please enter at least one companion names.");

      return;
    }

    try {
      setAdding(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/companions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            names: companionNames,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add companions");
      }

      setMessage("Companions added successfully.");

      setNames("");

      await fetchCompanions();
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to add companions");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading companions...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-2">Add Companions</h2>

              <p className="text-muted">
                Add friends or relatives who will accompany you to this event.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleAddCompanion}>
                <div className="mb-3">
                  <label className="form-label">Companion Names</label>

                  <input
                    type="text"
                    className="form-control"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    placeholder="Rahul sharma, Priya Singh"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add Companion"}
                </button>
              </form>

              <hr className="my-4" />

              <h5>Added Companions</h5>

              {companions.length === 0 ? (
                <p className="text-muted">No companions added yet.</p>
              ) : (
                <ul className="list-group">
                  {companions.map((companion) => (
                    <li key={companion.id} className="list-group-item">
                      {companion.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <Link to="/events" className="btn btn-outline-secondary">
                  Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companions;
