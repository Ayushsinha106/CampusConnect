import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import DashboardSidebar from "../../components/DashboardSidebar";

import {
  createPendingEvent,
  getCategories,
  getVenues,
} from "../../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    venueId: "",
    startDateTime: "",
    endDateTime: "",
    capacity: "",
    imageUrl: "",
    isPublic: false,
  });

  const [categories, setCategories] = useState([]);

  const [venues, setVenues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const role = JSON.parse(localStorage.getItem("user"))?.role;

  // --------------------------------
  // Load categories and venues
  // --------------------------------

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [categoryData, venueData] = await Promise.all([
          getCategories(),
          getVenues(),
        ]);

        setCategories(categoryData);
        setVenues(venueData);
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // --------------------------------
  // Form changes
  // --------------------------------

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // --------------------------------
  // Submit
  // --------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const data = {
        title: formData.title,
        description: formData.description,

        categoryId: Number(formData.categoryId),

        venueId: Number(formData.venueId),

        startDateTime: formData.startDateTime,

        endDateTime: formData.endDateTime,

        capacity: Number(formData.capacity),

        imageUrl: formData.imageUrl.trim() || null,

        isPublic: formData.isPublic,
      };

      await createPendingEvent(data);

      setSuccess(true);

      setTimeout(() => {
        navigate("/organizer/events");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ORGANIZER" />

        <main className="dashboard-content">
          <p className="p-4">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ORGANIZER" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <Link
            to={`/${role.toLowerCase()}/events`}
            className="btn btn-outline-secondary mb-3"
          >
            ← Back to Events
          </Link>

          <h1>Create Event</h1>

          <p>Provide the details for your new event.</p>
        </div>

        <div className="dashboard-section">
          <form onSubmit={handleSubmit}>
            {/* Title */}

            <div className="mb-3">
              <label className="form-label">Event Title</label>

              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}

            <div className="mb-3">
              <label className="form-label">Description</label>

              <textarea
                className="form-control"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}

            <div className="mb-3">
              <label className="form-label">Category</label>

              <select
                className="form-select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue */}

            <div className="mb-3">
              <label className="form-label">Venue</label>

              <select
                className="form-select"
                name="venueId"
                value={formData.venueId}
                onChange={handleChange}
                required
              >
                <option value="">Select Venue</option>

                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                    {venue.location ? ` — ${venue.location}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Start */}

            <div className="mb-3">
              <label className="form-label">Start Date & Time</label>

              <input
                type="datetime-local"
                className="form-control"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* End */}

            <div className="mb-3">
              <label className="form-label">End Date & Time</label>

              <input
                type="datetime-local"
                className="form-control"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Capacity */}

            <div className="mb-3">
              <label className="form-label">Capacity</label>

              <input
                type="number"
                className="form-control"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image URL */}

            <div className="mb-3">
              <label className="form-label">Image URL</label>

              <input
                type="url"
                className="form-control"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              <small className="text-muted">
                Optional. Enter a direct link to the event image.
              </small>
            </div>

            {/* Visibility */}

            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />

                <label className="form-check-label" htmlFor="isPublic">
                  Public Event
                </label>
              </div>
            </div>

            {/* Submit */}
            {error && <div className="alert alert-danger">{error}</div>}

            {success && (
              <div className="alert alert-success">
                Event will be live after Admin approval! Redirecting to
                events...
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateEvent;
