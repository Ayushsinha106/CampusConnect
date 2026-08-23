import events from "../data/events.json";
import organizerData from "../data/organizerData.json";
import adminData from "../data/adminData.json";

const API_BASE_URL = "http://localhost:5000/api";

export async function getEvents() {
  return events;
}

export async function getEventById(id) {
  return events.find((event) => event.id === Number(id));
}

export async function getAdminDashboard() {
  return adminData;
}

export async function getPendingEvents() {
  return adminData.pendingEvents;
}

export async function getAdminEvents() {
  return adminData.events;
}

export async function getOrganizerDashboard() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/organizer/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch organizer dashboard");
  }

  console.log("Organizer Dashboard:", result.data); // Log the data for debugging
  return result.data;
}

export async function getOrganizerEvents() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/organizer/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch organizer events");
  }
  console.log("Organizer Events:", result.data); // Log the data for debugging
  return result.data;
}

export async function getEventRegistrations(eventId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch registrations");
  }

  return {
    registrations: result.data,
    summary: result.summary,
  };
}

export async function markAttendance(registrationId, attended) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/registrations/${registrationId}/attendance`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        attended: attended,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update attendance");
  }

  return result;
}
