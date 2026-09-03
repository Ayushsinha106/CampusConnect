import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import MyEvents from "./pages/organizer/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventRegistrations from "./pages/organizer/EventRegistrations";
import Attendance from "./pages/organizer/Attendance";
import Companions from "./pages/Companions";
import Review from "./pages/Review";
import EventReviews from "./pages/organizer/EventReviews";
import CreatePendingEvent from "./pages/organizer/CreatePendingEvent";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminManage from "./pages/admin/AdminManage";
import AdminEventApprovals from "./pages/admin/AdminEventApprovals";
import AdminEventReviews from "./pages/admin/AdminEventReviews";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events/:eventId/review" element={<Review />} />
        {/* Organizer */}
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<MyEvents />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route
          path="/organizer/events/:id/attendance"
          element={<Attendance />}
        />
        <Route
          path="/registrations/:registrationId/companions"
          element={<Companions />}
        />
        <Route
          path="/organizer/events/:eventId/registrations"
          element={<EventRegistrations />}
        />
        <Route
          path="/organizer/events/:eventId/reviews"
          element={<EventReviews />}
        />
        <Route
          path="/organizer/events/create"
          element={<CreatePendingEvent />}
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/manage" element={<AdminManage />} />
        <Route
          path="/admin/event-approvals"
          element={<AdminEventApprovals />}
        />
        <Route
          path="/admin/events/:eventId/reviews"
          element={<AdminEventReviews />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
