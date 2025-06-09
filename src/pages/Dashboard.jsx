import React, { useState } from "react";
import { Line } from "react-chartjs-2";
//import "./Dashboard.css";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Example Dashboard component with multiple tabs: Overview, Profile, Notifications, and Settings.
function Dashboard() {
  // State to keep track of the active tab.
  const [activeTab, setActiveTab] = useState("overview");

  // Dummy profile data.
  const [profile, setProfile] = useState({
    name: "Tama Nzavi",
    email: "tamanzavi@gmail.com",
  });
  const [editingProfile, setEditingProfile] = useState(false);

  // Dummy notifications.
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your event booking is confirmed!", read: false },
    { id: 2, message: "New event available in your area.", read: false },
    { id: 3, message: "Profile updated successfully.", read: true },
  ]);

  // Mark notification as read.
  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifs) =>
      prevNotifs.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Save profile changes.
  const handleProfileSave = (e) => {
    e.preventDefault();
    setEditingProfile(false);
  };

  // Dummy chart data to show how you can visualize statistics.
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tickets Booked",
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: "rgb(75,192,192)",
        borderColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  // Render content based on the active tab.
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <h2>Welcome, {profile.name}!</h2>
            <div className="card">
              <h3>Statistics</h3>
              <Line data={chartData} />
            </div>
            <div className="card">
              <h3>Recent Activity</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-06-08</td>
                    <td>Booked ticket for Rock Festival</td>
                  </tr>
                  <tr>
                    <td>2025-06-07</td>
                    <td>Left a review for Summer Concert</td>
                  </tr>
                  <tr>
                    <td>2025-06-06</td>
                    <td>Updated profile details</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="tab-content">
            <h2>Your Profile</h2>
            {editingProfile ? (
              <form onSubmit={handleProfileSave} className="profile-form">
                <label>Name:</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <div className="profile-info">
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <button onClick={() => setEditingProfile(true)}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        );
      case "notifications":
        return (
          <div className="tab-content">
            <h2>Notifications</h2>
            <ul className="notifications-list">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={notif.read ? "read" : "unread"}
                >
                  <span>{notif.message}</span>
                  {!notif.read && (
                    <button onClick={() => handleMarkAsRead(notif.id)}>
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case "settings":
        return (
          <div className="tab-content">
            <h2>Settings</h2>
            <div className="settings-card">
              <p>Toggle dark mode:</p>
              <button
                onClick={() => document.body.classList.toggle("dark-mode")}
              >
                Toggle Dark Mode
              </button>
            </div>
          </div>
        );
      default:
        return <div className="tab-content">Select an option.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}
      <div className="dashboard-sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </li>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
          <li
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
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
      <div className="dashboard-main">{renderTabContent()}</div>
    </div>
  );
}

export default Dashboard;
