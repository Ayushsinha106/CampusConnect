import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";

import { getOrganizerEvents } from "../../services/api";

import DashboardSidebar from "../../components/DashboardSidebar";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // --------------------------------
  // Load event
  // --------------------------------

  useEffect(() => {
    async function loadEvent() {
      try {
        const events = await getOrganizerEvents();

        const event = events.find((item) => item.id === Number(id));

        if (!event) {
          throw new Error("Event not found");
        }

        setFormData({
          title: event.title,

          description: event.description,

          categoryId: event.category?.id || "",

          venueId: event.venue?.id || "",

          startDateTime: event.startDateTime
            ? event.startDateTime.slice(0, 16)
            : "",

          endDateTime: event.endDateTime ? event.endDateTime.slice(0, 16) : "",

          capacity: event.capacity,

          imageUrl: event.imageUrl || "",

          isPublic: event.isPublic,
        });
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  // --------------------------------
  // Handle input
  // --------------------------------

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // --------------------------------
  // Handle visibility
  // --------------------------------

  function handleVisibilityChange(event) {
    setFormData((previous) => ({
      ...previous,

      isPublic: event.target.value === "true",
    }));
  }

  // --------------------------------
  // Submit update
  // --------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");

      setSaving(false);

      return;
    }

    const payload = {
      title: formData.title,

      description: formData.description,

      startDateTime: formData.startDateTime,

      endDateTime: formData.endDateTime,

      capacity: Number(formData.capacity),

      imageUrl: formData.imageUrl || null,

      isPublic: formData.isPublic,

      categoryId: Number(formData.categoryId),

      venueId: Number(formData.venueId),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      console.log("Event update response:", result);

      setSuccess(true);

      // Redirect after showing message

      setTimeout(() => {
        navigate("/organizer/events");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
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
          <p className="p-4">Loading event...</p>
        </main>
      </div>
    );
  }

  // --------------------------------
  // Error while loading
  // --------------------------------

  if (error && !formData) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar role="ORGANIZER" />

        <main className="dashboard-content">
          <div className="alert alert-danger">{error}</div>

          <Link to="/organizer/events" className="btn btn-outline-primary">
            Back to My Events
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ORGANIZER" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Edit Event</h1>

          <p>Update the details of your event.</p>
        </div>

        <div className="dashboard-section">
          <Link
            to="/organizer/events"
            className="btn btn-outline-secondary mb-4"
          >
            ← Back to My Events
          </Link>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Success */}

          {success && (
            <div className="alert alert-success">
              Event updated successfully! Redirecting to dashboard...
            </div>
          )}

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

                <option value="1">Technology</option>

                <option value="2">Arts</option>

                <option value="3">Business</option>

                <option value="4">Wellness</option>

                <option value="5">Entertainment</option>
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

                <option value="1">Seminar Hall</option>

                <option value="2">Auditorium</option>

                <option value="3">Computer Lab</option>
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

              <div className="form-text">
                Paste a publicly accessible image URL.
              </div>
            </div>

            {/* Visibility */}

            <div className="mb-4">
              <label className="form-label">Visibility</label>

              <select
                className="form-select"
                name="isPublic"
                value={formData.isPublic ? "true" : "false"}
                onChange={handleVisibilityChange}
              >
                <option value="false">College Only</option>

                <option value="true">Public</option>
              </select>
            </div>

            {/* Submit */}

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
