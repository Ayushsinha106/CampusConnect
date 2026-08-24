import { useEffect, useMemo, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [visibility, setVisibility] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_ASC");

  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const result = await response.json();
        console.log("Fetched Events:", result.data); // Log the data for debugging
        setEvents(result.data);
      } catch (err) {
        console.error(err);

        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /*
   * Get unique categories from the event data.
   *
   * Later this could come from:
   * GET /api/categories
   */
  const categories = useMemo(() => {
    const uniqueCategories = events.map((event) => event.category.name);

    return [...new Set(uniqueCategories)];
  }, [events]);

  /*
   * Filtering and sorting
   */
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Remove past events
    const now = new Date();

    result = result.filter((event) => {
      return new Date(event.startDateTime) >= now;
    });

    // Keyword search
    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      result = result.filter((event) => {
        return (
          event.title.toLowerCase().includes(keyword) ||
          event.description.toLowerCase().includes(keyword) ||
          event.category.name.toLowerCase().includes(keyword) ||
          event.organizer.name.toLowerCase().includes(keyword)
        );
      });
    }

    // Category filter
    if (category !== "ALL") {
      result = result.filter((event) => event.category.name === category);
    }

    // Visibility filter
    if (visibility !== "ALL") {
      result = result.filter((event) => event.visibility === visibility);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "DATE_ASC") {
        return new Date(a.startDateTime) - new Date(b.startDateTime);
      }

      if (sortBy === "DATE_DESC") {
        return new Date(b.startDateTime) - new Date(a.startDateTime);
      }

      if (sortBy === "NAME_ASC") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "SEATS_ASC") {
        const seatsA = a.capacity - a.registeredCount;

        const seatsB = b.capacity - b.registeredCount;

        return seatsA - seatsB;
      }

      return 0;
    });

    return result;
  }, [events, search, category, visibility, sortBy]);

  /*
   * Pagination
   */
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;

  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage,
  );

  /*
   * Reset page when filters change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, visibility, sortBy]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3">Loading events...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h2">Upcoming Events</h1>

      {/* Search */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">
                Search Events
              </label>

              <input
                id="search"
                type="text"
                className="form-control"
                placeholder="Search title, tags, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>

              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="visibility" className="form-label">
                Event Type
              </label>

              <select
                id="visibility"
                className="form-select"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="ALL">All Events</option>

                <option value="PUBLIC">Public Events</option>

                <option value="COLLEGE_ONLY">College Only</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="sort" className="form-label">
                Sort By
              </label>

              <select
                id="sort"
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="DATE_ASC">Earliest First</option>

                <option value="DATE_DESC">Latest First</option>

                <option value="NAME_ASC">Name A-Z</option>

                <option value="SEATS_ASC">Fewest Seats Available</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Results */}
      {paginatedEvents.length === 0 ? (
        <p>No events match your search or filters.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          <span>
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default Events;
