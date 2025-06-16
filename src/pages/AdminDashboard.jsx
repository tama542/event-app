import React, { useState } from "react";
import EventCard from "./EventCard";

// import "./AdminDashboard.css";

function AdminDashboard() {
  // Simulated users data
  const [users] = useState([
    { id: 1, name: "Benard Johnson", email: "benard@gmail.com", role: "user" },
    { id: 2, name: "Lisa Muthoni", email: "lisa@gmail.com", role: "user" },
    { id: 3, name: "Elizabeth Mwarey", email: "elizabeth@gmail.com", role: "admin" },
    { id: 4, name: "Tama Nzavi", email: "tama@gmail.com", role: "user" },
  ]);

  // Events state—new events will be appended here.
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Rock Festival",
      description: "Join us for an evening of rock music!",
      date: "2025-08-01",
      image: "https://via.placeholder.com/400x300?text=Rock+Festival",
      rating: 4,
      reviews: 12,
    },
    {
      id: 2,
      title: "Summer Concert",
      description: "Enjoy the summer vibes with live music.",
      date: "2025-07-15",
      image: "https://via.placeholder.com/400x300?text=Summer+Concert",
      rating: 5,
      reviews: 20,
    },
  ]);

  // Active tab: overview, tickets, events, createEvent, users, settings
  const [activeTab, setActiveTab] = useState("overview");

  // Form state variables for creating events
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newImage, setNewImage] = useState("");
  const [formError, setFormError] = useState("");

  // Calculate total tickets sold from events data (if applicable)
  // For demonstration purposes, assume each event has a static ticket count.
  const totalTicketsSold = events.reduce((total, evt) => total + (evt.ticketsSold || 0), 0);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim() || !newDescription.trim() || !newImage.trim()) {
      setFormError("All fields are required.");
      return;
    }
    const newEvent = {
      id: events.length ? events[events.length - 1].id + 1 : 1,
      title: newTitle,
      description: newDescription,
      date: newDate,
      image: newImage,
      rating: 0,
      reviews: 0,
    };
    setEvents([...events, newEvent]);
    // Clear form and error.
    setNewTitle("");
    setNewDescription("");
    setNewDate("");
    setNewImage("");
    setFormError("");
    // Switch to the Events tab.
    setActiveTab("events");
  };

  // Render content based on the active tab.
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Admin Overview</h2>
            <div className="card-container">
              <div className="card">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
              <div className="card">
                <h3>Total Events</h3>
                <p>{events.length}</p>
              </div>
              <div className="card">
                <h3>Total Tickets Sold</h3>
                <p>{totalTicketsSold}</p>
              </div>
            </div>
          </div>
        );
      case "tickets":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Tickets Sold</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Tickets Sold</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id}>
                    <td>{evt.title}</td>
                    <td>{evt.date}</td>
                    <td>{evt.ticketsSold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "events":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Event Gallery</h2>
            <div className="event-grid">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        );
      case "createEvent":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Create New Event</h2>
            <form className="create-event-form" onSubmit={handleCreateEvent}>
              {formError && <p className="error-message">{formError}</p>}
              <div className="form-group">
                <label htmlFor="eventTitle">Title</label>
                <input
                  type="text"
                  id="eventTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventDescription">Description</label>
                <textarea
                  id="eventDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter event description"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input
                  type="date"
                  id="eventDate"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventImage">Image URL</label>
                <input
                  type="text"
                  id="eventImage"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              <button type="submit" className="create-event-btn">
                Create Event
              </button>
            </form>
          </div>
        );
      case "users":
        return (
          <div className="admin-tab-content fade-in">
            <h2>User Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "settings":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Admin Settings</h2>
            <div className="settings-card">
              <p>Customize your dashboard and preferences.</p>
              <button
                className="settings-btn"
                onClick={() => document.body.classList.toggle("dark-mode")}
              >
                Toggle Dark Mode
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="admin-tab-content fade-in">
            <p>Select a tab option.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <ul className="sidebar-menu">
          <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            Overview
          </li>
          <li className={activeTab === "tickets" ? "active" : ""} onClick={() => setActiveTab("tickets")}>
            Tickets
          </li>
          <li className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>
            Events
          </li>
          <li className={activeTab === "createEvent" ? "active" : ""} onClick={() => setActiveTab("createEvent")}>
            Create Event
          </li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            Users
          </li>
          <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
            Settings
          </li>
        </ul>
      </div>
      <div className="admin-main">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
