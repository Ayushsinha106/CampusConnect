import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getOrganizerEvents } from "../../services/api";

function EditEvent() {
  const { id } = useParams();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          category: event.category.name,
          venue: event.venue.name,
          startDate: event.startDate.slice(0, 16),
          endDate: event.endDate.slice(0, 16),
          registrationDeadline: event.registrationDeadline.slice(0, 16),
          capacity: event.capacity,
          visibility: event.visibility,
          tags: event.tags ? event.tags.join(", ") : "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Updated event:", {
      id: Number(id),
      ...formData,
    });

    alert("Event update will be connected to the backend later.");
  }

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>

        <Link to="/organizer/events">Back to My Events</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/organizer/events">← Back to My Events</Link>

      <h1>Edit Event</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Technology">Technology</option>

            <option value="Web Development">Web Development</option>

            <option value="Arts">Arts</option>

            <option value="Business">Business</option>

            <option value="Wellness">Wellness</option>

            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label>Venue</label>

          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Start Date</label>

          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Date</label>

          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Registration Deadline</label>

          <input
            type="datetime-local"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Capacity</label>

          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Visibility</label>

          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="COLLEGE_ONLY">College Only</option>

            <option value="PUBLIC">Public</option>
          </select>
        </div>

        <div>
          <label>Tags</label>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="AI, Python, Machine Learning"
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}

export default EditEvent;
