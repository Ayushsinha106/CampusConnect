import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    capacity: "",
    visibility: "COLLEGE_ONLY",
    tags: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Event to be created:", formData);

    alert("Event creation will be connected to the backend later.");
  }

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

            <div className="mb-3">
              <label className="form-label">Category</label>

              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>

                <option value="Technology">Technology</option>

                <option value="Arts">Arts</option>

                <option value="Business">Business</option>

                <option value="Wellness">Wellness</option>

                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Venue</label>

              <input
                type="text"
                className="form-control"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Start Date</label>

              <input
                className="form-control"
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Date</label>

              <input
                className="form-control"
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Registration Deadline</label>

              <input
                className="form-control"
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Capacity</label>

              <input
                className="form-control"
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Visibility</label>

              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="form-select"
              >
                <option value="COLLEGE_ONLY">College Only</option>

                <option value="PUBLIC">Public</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tags</label>

              <input
                type="text"
                name="tags"
                placeholder="AI, Python, Machine Learning"
                value={formData.tags}
                onChange={handleChange}
                className="form-control"
              />
            </div>

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
