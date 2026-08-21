import { Link } from "react-router";

function DashboardSidebar({ role }) {
  const isOrganizer = role === "ORGANIZER";

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h4>CampusConnect</h4>
        <span>{isOrganizer ? "Organizer" : "Administrator"}</span>
      </div>

      <nav className="sidebar-nav">
        <Link
          className="sidebar-link"
          to={isOrganizer ? "/organizer" : "/admin"}
        >
          <span>▣</span>
          Dashboard
        </Link>

        {isOrganizer ? (
          <>
            <Link className="sidebar-link" to="/organizer/events">
              <span>◫</span>
              My Events
            </Link>

            <Link className="sidebar-link" to="/organizer/events/create">
              <span>＋</span>
              Create Event
            </Link>
          </>
        ) : (
          <>
            <Link className="sidebar-link" to="/admin/events">
              <span>◫</span>
              Manage Events
            </Link>

            <Link className="sidebar-link" to="/admin/events/pending">
              <span>✓</span>
              Pending Approvals
            </Link>
          </>
        )}
      </nav>

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
