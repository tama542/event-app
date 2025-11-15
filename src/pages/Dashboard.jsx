import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
// import "./Dashboard.css";

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

// Enhanced Mock API with dynamic data
const mockAPI = {
  getUsers: () => {
    const users = JSON.parse(localStorage.getItem('dashboardUsers')) || [
      { id: 1, name: "Tama Nzavi", email: "tamanzavi@gmail.com", role: "admin", joinDate: "2024-01-15", status: "active" },
      { id: 2, name: "John Doe", email: "john@example.com", role: "user", joinDate: "2024-02-20", status: "active" },
      { id: 3, name: "Jane Smith", email: "jane@example.com", role: "user", joinDate: "2024-03-10", status: "active" },
      { id: 4, name: "Mike Johnson", email: "mike@example.com", role: "user", joinDate: "2024-04-05", status: "inactive" }
    ];
    return Promise.resolve(users);
  },

  saveUsers: (users) => {
    localStorage.setItem('dashboardUsers', JSON.stringify(users));
    return Promise.resolve(users);
  },

  getEvents: () => {
    const events = JSON.parse(localStorage.getItem('dashboardEvents')) || [
      { id: 1, name: "Rock Festival", date: "2025-06-15", attendees: 1500, revenue: 75000, status: "upcoming", category: "Music" },
      { id: 2, name: "Jazz Night", date: "2025-07-20", attendees: 800, revenue: 40000, status: "upcoming", category: "Music" },
      { id: 3, name: "Tech Conference", date: "2025-08-10", attendees: 1200, revenue: 60000, status: "upcoming", category: "Tech" },
      { id: 4, name: "Food Expo", date: "2025-05-20", attendees: 2000, revenue: 50000, status: "completed", category: "Food" },
      { id: 5, name: "Art Show", date: "2025-04-15", attendees: 600, revenue: 15000, status: "completed", category: "Art" }
    ];
    return Promise.resolve(events);
  },

  getBookings: () => {
    const bookings = JSON.parse(localStorage.getItem('dashboardBookings')) || [
      { id: 1, userId: 1, eventId: 1, tickets: 2, totalPrice: 100, bookingDate: "2025-06-01", status: "confirmed" },
      { id: 2, userId: 2, eventId: 1, tickets: 1, totalPrice: 50, bookingDate: "2025-06-02", status: "confirmed" },
      { id: 3, userId: 3, eventId: 2, tickets: 4, totalPrice: 200, bookingDate: "2025-06-03", status: "confirmed" },
      { id: 4, userId: 1, eventId: 3, tickets: 1, totalPrice: 75, bookingDate: "2025-06-04", status: "pending" }
    ];
    return Promise.resolve(bookings);
  },

  getStatistics: () => {
    const stats = JSON.parse(localStorage.getItem('dashboardStats'));
    if (stats) return Promise.resolve(stats);
    
    // Generate dynamic stats based on current data
    return mockAPI.getEvents().then(events => {
      return mockAPI.getBookings().then(bookings => {
        return mockAPI.getUsers().then(users => {
          const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
          const totalBookings = bookings.length;
          const activeUsers = users.filter(user => user.status === 'active').length;
          const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
          
          // Generate monthly data based on bookings
          const monthlyData = Array.from({ length: 12 }, (_, i) => 
            bookings.filter(booking => {
              const date = new Date(booking.bookingDate);
              return date.getMonth() === i;
            }).length * 25 // Assuming average ticket price of $25
          );

          const newStats = {
            totalUsers: users.length,
            activeUsers,
            totalEvents: events.length,
            upcomingEvents,
            totalRevenue,
            totalBookings,
            monthlyRevenue: monthlyData,
            bookingTrends: Array.from({ length: 12 }, (_, i) => 
              bookings.filter(booking => new Date(booking.bookingDate).getMonth() === i).length
            )
          };
          
          localStorage.setItem('dashboardStats', JSON.stringify(newStats));
          return newStats;
        });
      });
    });
  },

  // Add new booking
  addBooking: (booking) => {
    return mockAPI.getBookings().then(bookings => {
      const newBooking = {
        ...booking,
        id: Math.max(...bookings.map(b => b.id)) + 1,
        bookingDate: new Date().toISOString().split('T')[0]
      };
      const updatedBookings = [...bookings, newBooking];
      localStorage.setItem('dashboardBookings', JSON.stringify(updatedBookings));
      
      // Update statistics
      localStorage.removeItem('dashboardStats');
      return newBooking;
    });
  },

  // Add new event
  addEvent: (event) => {
    return mockAPI.getEvents().then(events => {
      const newEvent = {
        ...event,
        id: Math.max(...events.map(e => e.id)) + 1
      };
      const updatedEvents = [...events, newEvent];
      localStorage.setItem('dashboardEvents', JSON.stringify(updatedEvents));
      
      // Update statistics
      localStorage.removeItem('dashboardStats');
      return newEvent;
    });
  }
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", category: "Music" });

  const [notifications, setNotifications] = useState([]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const [usersData, eventsData, bookingsData, statsData] = await Promise.all([
          mockAPI.getUsers(),
          mockAPI.getEvents(),
          mockAPI.getBookings(),
          mockAPI.getStatistics()
        ]);

        setUsers(usersData);
        setEvents(eventsData);
        setBookings(bookingsData);
        setStatistics(statsData);
        setCurrentUser(usersData[0]);

        // Generate notifications from recent activity
        const recentNotifications = [
          ...bookingsData.slice(-3).map(booking => ({
            id: booking.id,
            message: `New booking for ${eventsData.find(e => e.id === booking.eventId)?.name}`,
            read: false,
            timestamp: new Date().toISOString()
          })),
          ...eventsData.filter(event => event.status === 'upcoming').slice(0, 2).map(event => ({
            id: event.id + 1000,
            message: `Upcoming event: ${event.name} on ${event.date}`,
            read: false,
            timestamp: new Date().toISOString()
          }))
        ];
        setNotifications(recentNotifications);

      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifs) =>
      prevNotifs.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        attendees: 0,
        revenue: 0,
        status: "upcoming"
      };
      await mockAPI.addEvent(eventData);
      
      // Refresh data
      const [eventsData, statsData] = await Promise.all([
        mockAPI.getEvents(),
        mockAPI.getStatistics()
      ]);
      setEvents(eventsData);
      setStatistics(statsData);
      setShowAddEvent(false);
      setNewEvent({ name: "", date: "", category: "Music" });
      
      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        message: `New event created: ${eventData.name}`,
        read: false,
        timestamp: new Date().toISOString()
      }, ...prev]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Dynamic Chart Data
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: statistics.monthlyRevenue || Array(12).fill(0),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1
      },
    ],
  };

  const bookingsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Bookings",
        data: statistics.bookingTrends || Array(12).fill(0),
        backgroundColor: "rgba(153,102,255,0.6)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  };

  const eventCategoriesData = {
    labels: events.length > 0 ? [...new Set(events.map(event => event.category))] : ['No Data'],
    datasets: [
      {
        data: events.length > 0 ? 
          [...new Set(events.map(event => event.category))].map(category => 
            events.filter(event => event.category === category).length
          ) : [1],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
      },
    ],
  };

  // Calculate real-time metrics
  const realTimeMetrics = {
    totalRevenue: statistics.totalRevenue || 0,
    totalBookings: statistics.totalBookings || 0,
    activeUsers: statistics.activeUsers || 0,
    upcomingEvents: statistics.upcomingEvents || 0,
    conversionRate: statistics.totalUsers > 0 ? 
      ((statistics.totalBookings / statistics.totalUsers) * 100).toFixed(1) : 0
  };

  const isAdmin = currentUser?.role === "admin";

  const renderTabContent = () => {
    if (loading) {
      return <div className="tab-content">Loading dashboard data...</div>;
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <div className="overview-header">
              <h2>Welcome back, {currentUser?.name}! {isAdmin && <span className="admin-badge">Admin</span>}</h2>
              <p>Here's what's happening with your events today.</p>
            </div>

            {/* Real-time Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon revenue">💰</div>
                <div className="metric-info">
                  <h3>Total Revenue</h3>
                  <p className="metric-value">${realTimeMetrics.totalRevenue.toLocaleString()}</p>
                  <span className="metric-trend">+12% from last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon bookings">🎫</div>
                <div className="metric-info">
                  <h3>Total Bookings</h3>
                  <p className="metric-value">{realTimeMetrics.totalBookings}</p>
                  <span className="metric-trend">+8% from last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon users">👥</div>
                <div className="metric-info">
                  <h3>Active Users</h3>
                  <p className="metric-value">{realTimeMetrics.activeUsers}</p>
                  <span className="metric-trend">+5% from last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon events">📅</div>
                <div className="metric-info">
                  <h3>Upcoming Events</h3>
                  <p className="metric-value">{realTimeMetrics.upcomingEvents}</p>
                  <span className="metric-trend">{realTimeMetrics.conversionRate}% conversion</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              <div className="card">
                <h3>Revenue Overview</h3>
                <Line data={revenueChartData} options={{ responsive: true }} />
              </div>

              <div className="card">
                <h3>Booking Trends</h3>
                <Bar data={bookingsChartData} options={{ responsive: true }} />
              </div>

              <div className="card">
                <h3>Event Categories</h3>
                <Doughnut data={eventCategoriesData} options={{ responsive: true }} />
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="action-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Recent Bookings</h3>
                  <span className="badge">{bookings.length} total</span>
                </div>
                <div className="recent-list">
                  {bookings.slice(-5).map(booking => {
                    const event = events.find(e => e.id === booking.eventId);
                    return (
                      <div key={booking.id} className="recent-item">
                        <div className="recent-info">
                          <strong>{event?.name || 'Unknown Event'}</strong>
                          <span>{booking.tickets} tickets • ${booking.totalPrice}</span>
                        </div>
                        <span className={`status ${booking.status}`}>{booking.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="action-buttons">
                  {isAdmin && (
                    <button 
                      className="action-btn primary"
                      onClick={() => setShowAddEvent(true)}
                    >
                      + Create New Event
                    </button>
                  )}
                  <button className="action-btn secondary">
                    📊 Generate Report
                  </button>
                  <button className="action-btn secondary">
                    👥 View All Users
                  </button>
                </div>

                {/* Add Event Form */}
                {showAddEvent && (
                  <div className="modal-overlay">
                    <div className="modal">
                      <h3>Create New Event</h3>
                      <form onSubmit={handleAddEvent}>
                        <input
                          type="text"
                          placeholder="Event Name"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                          required
                        />
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                          required
                        />
                        <select
                          value={newEvent.category}
                          onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                        >
                          <option value="Music">Music</option>
                          <option value="Tech">Tech</option>
                          <option value="Food">Food</option>
                          <option value="Art">Art</option>
                          <option value="Sports">Sports</option>
                        </select>
                        <div className="modal-actions">
                          <button type="submit">Create Event</button>
                          <button type="button" onClick={() => setShowAddEvent(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // ... other tabs remain the same
      case "profile":
        return (
          <div className="tab-content">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {currentUser?.name}</p>
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p><strong>Role:</strong> {currentUser?.role}</p>
              <p><strong>Member Since:</strong> {currentUser?.joinDate}</p>
              <p><strong>Total Bookings:</strong> {bookings.filter(b => b.userId === currentUser?.id).length}</p>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="tab-content">
            <h2>Notifications</h2>
            <div className="notifications-header">
              <span>{notifications.filter(n => !n.read).length} unread</span>
            </div>
            <ul className="notifications-list">
              {notifications.map((notif) => (
                <li key={notif.id} className={notif.read ? "read" : "unread"}>
                  <div>
                    <span>{notif.message}</span>
                    <br />
                    <small>{new Date(notif.timestamp).toLocaleString()}</small>
                  </div>
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

      // ... rest of the tabs
      default:
        return <div className="tab-content">Select an option.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            📊 Overview
          </li>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 Profile
          </li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>
            🔔 Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </li>
          {isAdmin && (
            <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
              👥 User Management
            </li>
          )}
          <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
            ⚙️ Settings
          </li>
        </ul>
      </div>
      
      <div className="dashboard-main">{renderTabContent()}</div>
    </div>
  );
}

export default Dashboard;