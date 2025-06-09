import React, { useState } from "react";
//import "./AdminDashboard.css";

function AdminDashboard() {
  // Simulated data arrays

  // Users data for the "Users" tab
  const [users] = useState([
    { id: 1, name: "Benard Johnson", email: "benard@gmail.com", role: "user" },
    { id: 2, name: "Lisa Muthoni", email: "lisa@gmail.com", role: "user" },
    { id: 3, name: "Elizabeth Mwarey", email: "elizabeth@gmail.com", role: "admin" },
    { id: 4, name: "Tama Nzavi", email: "tama@gmail.com", role: "user" },
  ]);

  // Events data for the "Events" and "Tickets" tab
  const [events] = useState([
    { id: 1, name: "Rock Festival", date: "2025-08-01", ticketsSold: 150 },
    { id: 2, name: "Summer Concert", date: "2025-07-15", ticketsSold: 200 },
    { id: 3, name: "Art Expo", date: "2025-09-10", ticketsSold: 90 },
    { id: 4, name: "Tech Conference", date: "2025-10-05", ticketsSold: 120 },
  ]);

  // Manage active tab state; additional tabs added for Tickets & Events.
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total tickets sold from the events data
  const totalTicketsSold = events.reduce((total, evt) => total + evt.ticketsSold, 0);

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
                    <td>{evt.name}</td>
                    <td>{evt.date}</td>
                    <td>{evt.ticketsSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "events":
        return (
          <div className="admin-tab-content fade-in">
            <h2>Event Details</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Tickets Sold</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id}>
                    <td>{evt.id}</td>
                    <td>{evt.name}</td>
                    <td>{evt.date}</td>
                    <td>{evt.ticketsSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </li>
          <li
            className={activeTab === "tickets" ? "active" : ""}
            onClick={() => setActiveTab("tickets")}
          >
            Tickets
          </li>
          <li
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            Events
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </li>
        </ul>
      </div>
      {/* Main Content Area */}
      <div className="admin-main">{renderTabContent()}</div>
    </div>
  );
}

export default AdminDashboard;
