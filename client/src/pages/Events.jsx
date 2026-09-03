import { useEffect, useState } from "react";

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

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    ...new Map(
      events
        .filter((event) => event.category)
        .map((event) => [event.category.id, event.category]),
    ).values(),
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        let backendSortBy = "startDateTime";
        let backendSortOrder = "asc";

        if (sortBy === "DATE_ASC") {
          backendSortBy = "startDateTime";
          backendSortOrder = "asc";
        }

        if (sortBy === "DATE_DESC") {
          backendSortBy = "startDateTime";
          backendSortOrder = "desc";
        }

        if (sortBy === "NAME_ASC") {
          backendSortBy = "title";
          backendSortOrder = "asc";
        }

        if (sortBy === "SEATS_ASC") {
          backendSortBy = "capacity";
          backendSortOrder = "asc";
        }

        const categoryId = category === "ALL" ? undefined : Number(category);

        let isPublic;

        if (visibility === "PUBLIC") {
          isPublic = true;
        }

        if (visibility === "COLLEGE_ONLY") {
          isPublic = false;
        }

        const result = await getEvents({
          search,
          categoryId,
          startDate: new Date().toISOString(),
          page: currentPage,
          limit: eventsPerPage,
          sortBy: backendSortBy,
          sortOrder: backendSortOrder,
          isPublic,
        });

        console.log("Fetched Events:", result);

        setEvents(result.data || []);

        setTotalPages(result.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load events. Please try again.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, visibility, sortBy, currentPage]);

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

      {/* Search and filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">
                Search Events
              </label>

              <input
                id="search"
                type="text"
                className="form-control"
                placeholder="Search title, description, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category */}
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
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
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

            {/* Sorting */}
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
      {events.length === 0 ? (
        <p>No events match your search or filters.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
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
