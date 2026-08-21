import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import MyEvents from "./pages/organizer/MyEvents";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import EventRegistrations from "./pages/organizer/EventRegistrations";
import Attendance from "./pages/organizer/Attendance";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import PendingEvents from "./pages/admin/PendingEvents";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Organizer */}
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<MyEvents />} />
        <Route path="/organizer/events/create" element={<CreateEvent />} />
        <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
        <Route
          path="/organizer/events/:id/registrations"
          element={<EventRegistrations />}
        />
        <Route
          path="/organizer/events/:id/attendance"
          element={<Attendance />}
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<ManageEvents />} />
        <Route path="/admin/events/pending" element={<PendingEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
