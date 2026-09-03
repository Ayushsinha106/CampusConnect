import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  getVenues,
  createVenue,
  updateVenue,
} from "../../services/api";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function AdminManage() {
  const [activeTab, setActiveTab] = useState("categories");

  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Category form
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Venue form
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const [editingVenueId, setEditingVenueId] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [categoryData, venueData] = await Promise.all([
        getCategories(),
        getVenues(),
      ]);

      setCategories(categoryData || []);
      setVenues(venueData || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  // CATEGORY
  function resetCategoryForm() {
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategoryId(null);
  }

  function handleEditCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");

    setActiveTab("categories");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: categoryName.trim(),
        description: categoryDescription.trim() || null,
      };

      if (editingCategoryId) {
        const updatedCategory = await updateCategory(editingCategoryId, data);

        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategoryId ? updatedCategory : category,
          ),
        );
      } else {
        const newCategory = await createCategory(data);

        setCategories((prev) => [...prev, newCategory]);
      }

      resetCategoryForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  // VENUE
  function resetVenueForm() {
    setVenueName("");
    setVenueLocation("");
    setVenueCapacity("");
    setEditingVenueId(null);
  }

  function handleEditVenue(venue) {
    setEditingVenueId(venue.id);
    setVenueName(venue.name);
    setVenueLocation(venue.location);
    setVenueCapacity(
      venue.capacity !== null && venue.capacity !== undefined
        ? venue.capacity
        : "",
    );

    setActiveTab("venues");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleVenueSubmit(event) {
    event.preventDefault();

    if (!venueName.trim()) {
      alert("Venue name is required");
      return;
    }

    if (!venueLocation.trim()) {
      alert("Venue location is required");
      return;
    }

    if (
      venueCapacity !== "" &&
      (Number.isNaN(Number(venueCapacity)) || Number(venueCapacity) <= 0)
    ) {
      alert("Capacity must be a positive number");
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: venueName.trim(),
        location: venueLocation.trim(),
        capacity: venueCapacity === "" ? null : Number(venueCapacity),
      };

      if (editingVenueId) {
        const updatedVenue = await updateVenue(editingVenueId, data);

        setVenues((prev) =>
          prev.map((venue) =>
            venue.id === editingVenueId ? updatedVenue : venue,
          ),
        );
      } else {
        const newVenue = await createVenue(data);

        setVenues((prev) => [...prev, newVenue]);
      }

      resetVenueForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save venue");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <DashboardSidebar role="ADMIN" />

      <main className="flex-grow-1 p-4">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="fw-bold">Manage Categories & Venues</h1>

            <p className="text-muted">
              Create and manage the categories and venues used by events.
            </p>
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Tabs */}
          <div className="mb-4">
            <button
              type="button"
              className={`btn me-2 ${
                activeTab === "categories"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => {
                setActiveTab("categories");
                resetVenueForm();
              }}
            >
              Categories
            </button>

            <button
              type="button"
              className={`btn ${
                activeTab === "venues" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setActiveTab("venues");
                resetCategoryForm();
              }}
            >
              Venues
            </button>
          </div>

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    {editingCategoryId ? "Edit Category" : "Create Category"}
                  </h4>

                  <form onSubmit={handleCategorySubmit}>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        maxLength={100}
                        placeholder="e.g. Technology"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>

                      <textarea
                        className="form-control"
                        rows="3"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        placeholder="Describe this category..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary me-2"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingCategoryId
                          ? "Update Category"
                          : "Create Category"}
                    </button>

                    {editingCategoryId && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetCategoryForm}
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* Category List */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Categories</h4>

                    <span className="badge bg-secondary">
                      {categories.length}
                    </span>
                  </div>

                  {categories.length === 0 ? (
                    <p className="text-muted mb-0">No categories found.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {categories.map((category) => (
                            <tr key={category.id}>
                              <td>{category.id}</td>

                              <td>
                                <strong>{category.name}</strong>
                              </td>

                              <td>
                                {category.description || (
                                  <span className="text-muted">
                                    No description
                                  </span>
                                )}
                              </td>

                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* VENUES */}

          {activeTab === "venues" && (
            <>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    {editingVenueId ? "Edit Venue" : "Create Venue"}
                  </h4>

                  <form onSubmit={handleVenueSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Venue Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        maxLength={150}
                        placeholder="e.g. Main Auditorium"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Location</label>

                      <input
                        type="text"
                        className="form-control"
                        value={venueLocation}
                        onChange={(e) => setVenueLocation(e.target.value)}
                        maxLength={200}
                        placeholder="e.g. Block A, 2nd Floor"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Capacity</label>

                      <input
                        type="number"
                        className="form-control"
                        value={venueCapacity}
                        onChange={(e) => setVenueCapacity(e.target.value)}
                        min="1"
                        placeholder="Leave empty if there is no fixed capacity"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary me-2"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingVenueId
                          ? "Update Venue"
                          : "Create Venue"}
                    </button>

                    {editingVenueId && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetVenueForm}
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* Venue List */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Venues</h4>

                    <span className="badge bg-secondary">{venues.length}</span>
                  </div>

                  {venues.length === 0 ? (
                    <p className="text-muted mb-0">No venues found.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {venues.map((venue) => (
                            <tr key={venue.id}>
                              <td>{venue.id}</td>

                              <td>
                                <strong>{venue.name}</strong>
                              </td>

                              <td>{venue.location}</td>

                              <td>
                                {venue.capacity ?? (
                                  <span className="text-muted">No limit</span>
                                )}
                              </td>

                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditVenue(venue)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
