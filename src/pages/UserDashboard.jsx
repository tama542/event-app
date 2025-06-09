// src/pages/UserDashboard.jsx
import React from 'react';

const attendedEvents = [
  { id: 1, event: 'Summer Music Festival', date: '2025-06-20', status: 'Confirmed' },
  { id: 2, event: 'Art Exhibition', date: '2025-07-15', status: 'Confirmed' },
];

const upcomingEvents = [
  { id: 3, event: 'Tech Conference 2025', date: '2025-09-10', status: 'Pending' },
];

function UserDashboard() {
  return (
    <div className="dashboard user-dashboard">
      <h2>User Dashboard</h2>

      {/* Attended Events */}
      <section className="attended-events">
        <h3>Attended Events</h3>
        <ul>
          {attendedEvents.map((event) => (
            <li key={event.id}>
              <strong>{event.event}</strong> <span>({event.date})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events">
        <h3>Upcoming Events</h3>
        <ul>
          {upcomingEvents.map((event) => (
            <li key={event.id}>
              <strong>{event.event}</strong> <span>({event.date})</span> - Status: {event.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UserDashboard;
