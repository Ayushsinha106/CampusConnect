import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import DashboardSidebar from "../components/DashboardSidebar";

import {
  getEventById,
  updateEvent,
  getCategories,
  getVenues,
} from "../services/api";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  const [categories, setCategories] = useState([]);

  const [venues, setVenues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  // --------------------------------
  // Load event
  // --------------------------------

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [event, categoryData, venueData] = await Promise.all([
          getEventById(id),
          getCategories(),
          getVenues(),
        ]);

        setCategories(categoryData);
        setVenues(venueData);

        setFormData({
          title: event.title || "",

          description: event.description || "",

          categoryId: event.category?.id ? String(event.category.id) : "",

          venueId: event.venue?.id ? String(event.venue.id) : "",

          startDateTime: event.startDateTime
            ? event.startDateTime.slice(0, 16)
            : "",

          endDateTime: event.endDateTime ? event.endDateTime.slice(0, 16) : "",

          capacity: event.capacity || "",

          imageUrl: event.imageUrl || "",

          isPublic: Boolean(event.isPublic),
        });
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // --------------------------------
  // Change
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

      await updateEvent(id, data);

      setSuccess(true);
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/events");
        } else {
          navigate("/organizer/events");
        }
      }, 1500);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />

        <main className="dashboard-content">
          <p className="p-4">Loading event...</p>
        </main>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />

        <main className="dashboard-content">
          <div className="alert alert-danger">{error}</div>

          <Link
            to={`/${role.toLowerCase()}/events`}
            className="btn btn-outline-primary"
          >
            ← Back to Events
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <Link
            to={`/${role.toLowerCase()}/events`}
            className="btn btn-outline-secondary mb-3"
          >
            ← Back to Events
          </Link>

          <h1>Edit Event</h1>

          <p>Update the details of your event.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {success && (
          <div className="alert alert-success">
            Event updated successfully! Redirecting to events...
          </div>
        )}

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

            {/* Image */}

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

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditEvent;
