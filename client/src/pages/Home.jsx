import { Link } from "react-router";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>CampusConnect</h1>

          <p className="lead">
            Discover workshops, seminars, cultural events, and activities
            happening around your campus.
          </p>

          <Link className="btn btn-primary btn-lg" to="/events">
            Explore Events
          </Link>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">Everything in One Place</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h3 className="h5">Discover Events</h3>

                <p className="text-muted">
                  Find events based on your interests, categories, and dates.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h3 className="h5">Register Easily</h3>

                <p className="text-muted">
                  Register for events and manage your upcoming activities.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h3 className="h5">Manage Events</h3>

                <p className="text-muted">
                  Organizers can create, manage, and monitor their events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
