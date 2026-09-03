import events from "../data/events.json";

const API_BASE_URL = "http://localhost:5000/api";

export async function getEvents() {
  return events;
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

  const response = await fetch(
    `http://localhost:5000/api/registrations/events/${eventId}/registrations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  console.log("GET EVENT REGISTRATIONS RESPONSE:", result);

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

export async function getEventReviews(eventId) {
  const response = await fetch(
    `http://localhost:5000/api/reviews/events/${eventId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch reviews");
  }

  return {
    reviews: result.data,
    summary: result.summary,
  };
}

export async function getAdminStatistics() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/admin/statistics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log("GET ADMIN STATISTICS RESPONSE:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch admin statistics");
  }

  return result.data;
}

export async function getAdminUsers() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch admin users");
  }

  return result.data;
}

export async function getAdminEvents() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/admin/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch admin events");
  }

  return result.data;
}

export async function updateUserRole(userId, role) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/admin/users/${userId}/role`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        role,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user role");
  }

  return result.data;
}

export async function createEvent(eventData) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/events", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(eventData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create event");
  }

  return result.data;
}

export async function getEventById(id) {
  const response = await fetch(`http://localhost:5000/api/events/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch event");
  }

  return result.data;
}

export async function updateEvent(id, eventData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5000/api/events/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(eventData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update event");
  }

  return result.data;
}

export async function getCategories() {
  const response = await fetch("http://localhost:5000/api/categories");

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch categories");
  }

  return result.data;
}

export async function getVenues() {
  const response = await fetch("http://localhost:5000/api/venues");

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch venues");
  }

  return result.data;
}

export async function getOrganizerEventsProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/users/me/organizer-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch organizer events");
  }
  console.log("Organizer Events:", result.data); // Log the data for debugging
  return result.data;
}

export async function deleteEvent(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete event");
  }

  return result;
}

export async function createCategory(categoryData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create category");
  }

  return result.data;
}

export async function updateCategory(id, categoryData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update category");
  }

  return result.data;
}

export async function createVenue(venueData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venueData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create venue");
  }

  return result.data;
}

export async function updateVenue(id, venueData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venueData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update venue");
  }

  return result.data;
}

export async function createPendingEvent(eventData) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/pending-events", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(eventData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create event");
  }

  return result.data;
}

export async function getPendingEvents() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/pending-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log("GET PENDING EVENTS RESPONSE:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch pending events");
  }

  return result.data;
}

export async function approvePendingEvent(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/pending-events/${id}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to approve event");
  }

  return result.data;
}

export async function rejectPendingEvent(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/pending-events/${id}/reject`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reject event");
  }

  return result;
}
