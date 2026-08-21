import { useState } from "react";
import { useParams, Link } from "react-router";

const initialAttendance = [
  {
    registrationId: 1,
    studentName: "Ayush",
    companions: [],
    status: "PRESENT",
  },
  {
    registrationId: 2,
    studentName: "Rahul",
    companions: [
      {
        id: 1,
        name: "Aman",
        status: "PRESENT",
      },
      {
        id: 2,
        name: "Priya",
        status: "ABSENT",
      },
    ],
    status: "PRESENT",
  },
  {
    registrationId: 3,
    studentName: "Ananya",
    companions: [],
    status: "ABSENT",
  },
];

function Attendance() {
  const { id } = useParams();

  const [attendance, setAttendance] = useState(initialAttendance);

  function toggleStudent(registrationId) {
    setAttendance((previous) =>
      previous.map((record) => {
        if (record.registrationId !== registrationId) {
          return record;
        }

        return {
          ...record,
          status: record.status === "PRESENT" ? "ABSENT" : "PRESENT",
        };
      }),
    );
  }

  function toggleCompanion(registrationId, companionId) {
    setAttendance((previous) =>
      previous.map((record) => {
        if (record.registrationId !== registrationId) {
          return record;
        }

        return {
          ...record,
          companions: record.companions.map((companion) => {
            if (companion.id !== companionId) {
              return companion;
            }

            return {
              ...companion,
              status: companion.status === "PRESENT" ? "ABSENT" : "PRESENT",
            };
          }),
        };
      }),
    );
  }

  function saveAttendance() {
    console.log("Attendance to be saved:", attendance);

    alert("Attendance will be saved through the backend later.");
  }

  const totalStudents = attendance.length;

  const presentStudents = attendance.filter(
    (record) => record.status === "PRESENT",
  ).length;

  const totalCompanions = attendance.reduce(
    (total, record) => total + record.companions.length,
    0,
  );

  const presentCompanions = attendance.reduce(
    (total, record) =>
      total +
      record.companions.filter((companion) => companion.status === "PRESENT")
        .length,
    0,
  );

  return (
    <main>
      <Link to="/organizer/events">← Back to My Events</Link>

      <h1>Attendance</h1>

      <p>Event ID: {id}</p>

      <section>
        <h2>Attendance Summary</h2>

        <p>
          Students Present: {presentStudents} / {totalStudents}
        </p>

        <p>
          Companions Present: {presentCompanions} / {totalCompanions}
        </p>

        <p>Total Attendees Present: {presentStudents + presentCompanions}</p>
      </section>

      <section>
        <h2>Attendance List</h2>

        {attendance.map((record) => (
          <article key={record.registrationId}>
            <h3>{record.studentName}</h3>

            <p>Status: {record.status}</p>

            <button onClick={() => toggleStudent(record.registrationId)}>
              Mark as {record.status === "PRESENT" ? "Absent" : "Present"}
            </button>

            {record.companions.length > 0 && (
              <div>
                <h4>Companions</h4>

                {record.companions.map((companion) => (
                  <div key={companion.id}>
                    <span>
                      {companion.name} — {companion.status}
                    </span>{" "}
                    <button
                      onClick={() =>
                        toggleCompanion(record.registrationId, companion.id)
                      }
                    >
                      Mark as{" "}
                      {companion.status === "PRESENT" ? "Absent" : "Present"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      <button onClick={saveAttendance}>Save Attendance</button>
    </main>
  );
}

export default Attendance;
