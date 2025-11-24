import React, { useState, useEffect } from "react";
// import "src/styles/dashboard.css";

export default function Dashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", date: "", venue: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      
      if (!res.ok) throw new Error("Failed to create event");
      
      const created = await res.json();
      setEvents([...events, created]);
      setNewEvent({ title: "", date: "", venue: "" });
      setError("");
    } catch (err) {
      setError("Failed to create event");
    }
  };

  const removeEvent = async (id) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

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

      {error && (
        <div className="error-message" style={{
          background: 'var(--danger-color)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {user.role === "admin" ? (
        <section className="admin-panel">
          <h2>Admin Controls</h2>
          <div className="event-form">
            <input
              type="text"
              placeholder="Event Title"
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
          <p>Browse and register for upcoming events</p>
        </section>
      )}

      <section className={`events-list ${loading ? 'loading' : ''}`}>
        {loading ? (
          <div>Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-events">No events available</div>
        ) : (
          events.map((ev) => (
            <div key={ev._id} className="event-card">
              <h3>{ev.title}</h3>
              <p>📅 {new Date(ev.date).toLocaleDateString()}</p>
              <p>📍 {ev.venue}</p>
              {user.role === "admin" && (
                <button onClick={() => removeEvent(ev._id)}>Remove Event</button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}