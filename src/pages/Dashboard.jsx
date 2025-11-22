import React, { useState, useEffect } from "react";
// import "./dashboard.css";

export default function Dashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", venue: "" });

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) return;
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    const created = await res.json();
    setEvents([...events, created]);
    setNewEvent({ title: "", date: "", venue: "" });
  };

  const removeEvent = async (id) => {
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(events.filter((e) => e._id !== id));
  };

  // 🔒 Guard against missing user
  if (!user) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Event Dashboard</h1>
          <span>Guest (not logged in)</span>
        </header>
        <p className="guest-msg">Please log in to view events.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Event Dashboard</h1>
        <span>{user.email} ({user.role})</span>
      </header>

      {user.role === "admin" ? (
        <section className="admin-panel">
          <h2>Admin Controls</h2>
          <div className="event-form">
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
            />
            <button onClick={addEvent}>Add Event</button>
          </div>
        </section>
      ) : (
        <section className="user-panel">
          <h2>Available Events</h2>
        </section>
      )}

      <section className="events-list">
        {events.map((ev) => (
          <div key={ev._id} className="event-card">
            <h3>{ev.title}</h3>
            <p>{new Date(ev.date).toLocaleDateString()}</p>
            <p>{ev.venue}</p>
            {user.role === "admin" && (
              <button onClick={() => removeEvent(ev._id)}>Remove</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
