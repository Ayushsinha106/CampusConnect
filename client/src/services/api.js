import events from "../data/events.json";
import organizerData from "../data/organizerData.json";
import adminData from "../data/adminData.json";

export async function getEvents() {
  return events;
}

export async function getEventById(id) {
  return events.find((event) => event.id === Number(id));
}

export async function getOrganizerDashboard() {
  return organizerData;
}

export async function getOrganizerEvents() {
  return organizerData.events;
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
