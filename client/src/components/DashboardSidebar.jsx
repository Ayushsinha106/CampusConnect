import { Link, useLocation } from "react-router";

function DashboardSidebar({ role }) {
  const location = useLocation();

  const isOrganizer = role === "ORGANIZER";
  const isAdmin = role === "ADMIN";

  function isActive(path) {
    if (path === "/organizer" || path === "/admin") {
      return location.pathname === path;
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  }

  return (
    <aside className="dashboard-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span>
          {isOrganizer ? "Organizer" : isAdmin ? "Administrator" : "Dashboard"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Dashboard */}

        <Link
          className={`sidebar-link ${
            isActive(isOrganizer ? "/organizer" : "/admin") ? "active" : ""
          }`}
          to={isOrganizer ? "/organizer" : "/admin"}
        >
          <span>▣</span>
          Dashboard
        </Link>

        {/* Organizer */}

        {isOrganizer && (
          <>
            <Link
              className={`sidebar-link ${
                isActive("/organizer/events") ? "active" : ""
              }`}
              to="/organizer/events"
            >
              <span>◫</span>
              My Events
            </Link>
          </>
        )}

        {/* Admin */}

        {isAdmin && (
          <>
            <Link
              className={`sidebar-link ${
                isActive("/admin/events") ? "active" : ""
              }`}
              to="/admin/events"
            >
              <span>◫</span>
              All Events
            </Link>

            <Link
              className={`sidebar-link ${
                isActive("/admin/users") ? "active" : ""
              }`}
              to="/admin/users"
            >
              <span>✓</span>
              Manage Users
            </Link>
          </>
        )}

        {/* Common Event Action */}

        {(isOrganizer || isAdmin) && (
          <Link
            className={`sidebar-link ${
              isActive("/events/create") ? "active" : ""
            }`}
            to="/events/create"
          >
            <span>＋</span>
            Create Event
          </Link>
        )}
      </nav>

      {/* Footer */}

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link">
          <span>←</span>
          Back to Website
        </Link>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
