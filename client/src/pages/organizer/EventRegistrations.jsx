import { useParams, Link } from "react-router";

const registrations = [
  {
    id: 1,
    student: {
      id: 101,
      name: "Ayush",
      email: "ayush@example.com",
    },
    registeredAt: "2026-08-10T12:30:00",
    status: "CONFIRMED",
    companions: [],
  },
  {
    id: 2,
    student: {
      id: 102,
      name: "Rahul",
      email: "rahul@example.com",
    },
    registeredAt: "2026-08-11T15:20:00",
    status: "CONFIRMED",
    companions: [
      {
        id: 1,
        name: "Aman",
        relationship: "Friend",
      },
      {
        id: 2,
        name: "Priya",
        relationship: "Sister",
      },
    ],
  },
  {
    id: 3,
    student: {
      id: 103,
      name: "Ananya",
      email: "ananya@example.com",
    },
    registeredAt: "2026-08-12T09:15:00",
    status: "CONFIRMED",
    companions: [],
  },
];

function EventRegistrations() {
  const { id } = useParams();

  return (
    <main>
      <Link to="/organizer/events">← Back to My Events</Link>

      <h1>Event Registrations</h1>

      <p>Event ID: {id}</p>

      <p>Total Registrations: {registrations.length}</p>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Registration Date</th>
            <th>Companions</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <td>{registration.student.name}</td>

              <td>{registration.student.email}</td>

              <td>
                {new Date(registration.registeredAt).toLocaleDateString()}
              </td>

              <td>
                {registration.companions.length === 0 ? (
                  "None"
                ) : (
                  <ul>
                    {registration.companions.map((companion) => (
                      <li key={companion.id}>
                        {companion.name} ({companion.relationship})
                      </li>
                    ))}
                  </ul>
                )}
              </td>

              <td>{registration.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default EventRegistrations;
