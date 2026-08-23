import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Link, useNavigate } from "react-router-dom";

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
    isPublic: true,
  });
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Event to be created:", formData);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/events/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Event creation response:", result);

      setSuccess(true);
      setTimeout(() => {
        navigate("/organizer");
      }, 1500);
      if (!response.ok) {
        throw new Error(result.message || "Event creation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="ORGANIZER" />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Create Event</h1>
          <p>Provide the details for your new event.</p>
        </div>

        <div className="dashboard-section">
          <form onSubmit={handleSubmit}>
            {/* Event Title */}

            <div className="mb-3">
              <label className="form-label">Event Title</label>

              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
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
                placeholder="Describe your event..."
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

                {/* Replace these IDs with
                your actual database IDs */}

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

                {/* Replace these IDs with
                your actual database IDs */}

                <option value="1">Seminar Hall</option>

                <option value="2">Auditorium</option>

                <option value="3">Computer Lab</option>
              </select>
            </div>

            {/* Start Date */}

            <div className="mb-3">
              <label className="form-label">Start Date & Time</label>

              <input
                className="form-control"
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* End Date */}

            <div className="mb-3">
              <label className="form-label">End Date & Time</label>

              <input
                className="form-control"
                type="datetime-local"
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
                className="form-control"
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Maximum number of attendees"
                required
              />
            </div>

            {/* Image URL */}

            <div className="mb-3">
              <label className="form-label">Image URL</label>

              <input
                className="form-control"
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/event-image.jpg"
              />

              <div className="form-text">
                Enter a publicly accessible URL for the event image.
              </div>
            </div>

            {/* Visibility */}

            <div className="mb-3">
              <label className="form-label">Visibility</label>

              <select
                name="isPublic"
                value={formData.isPublic}
                onChange={(e) =>
                  setFormData((previous) => ({
                    ...previous,
                    isPublic: e.target.value === "true",
                  }))
                }
                className="form-select"
              >
                <option value="false">College Only</option>

                <option value="true">Public</option>
              </select>
            </div>

            {/* Submit */}

            {success && (
              <div className="alert alert-success">
                <div>
                  Event created successfully! Redirecting to dashboard...
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateEvent;
