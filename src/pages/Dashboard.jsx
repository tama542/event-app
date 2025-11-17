import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

// Enhanced Mock API with proper authentication
const mockAPI = {
  // Authentication methods
  login: (email, password) => {
    const users = [
      { id: 1, name: "Tama Nzavi", email: "admin@example.com", password: "admin123", role: "admin", joinDate: "2024-01-15", status: "active" },
      { id: 2, name: "John Doe", email: "user@example.com", password: "user123", role: "user", joinDate: "2024-02-20", status: "active" },
      { id: 3, name: "Jane Smith", email: "jane@example.com", password: "user123", role: "user", joinDate: "2024-03-10", status: "active" }
    ];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    return Promise.resolve();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? Promise.resolve(JSON.parse(user)) : Promise.resolve(null);
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Data management
  getUsers: () => {
    const users = JSON.parse(localStorage.getItem('dashboardUsers')) || [
      { id: 1, name: "Tama Nzavi", email: "admin@example.com", password: "admin123", role: "admin", joinDate: "2024-01-15", status: "active" },
      { id: 2, name: "John Doe", email: "user@example.com", password: "user123", role: "user", joinDate: "2024-02-20", status: "active" },
      { id: 3, name: "Jane Smith", email: "jane@example.com", password: "user123", role: "user", joinDate: "2024-03-10", status: "active" },
      { id: 4, name: "Mike Johnson", email: "mike@example.com", password: "user123", role: "user", joinDate: "2024-04-05", status: "inactive" }
    ];
    return Promise.resolve(users);
  },

  getEvents: () => {
    const events = JSON.parse(localStorage.getItem('dashboardEvents')) || [
      { id: 1, name: "Rock Festival", date: "2025-06-15", attendees: 1500, revenue: 75000, status: "upcoming", category: "Music", ticketPrice: 50 },
      { id: 2, name: "Jazz Night", date: "2025-07-20", attendees: 800, revenue: 40000, status: "upcoming", category: "Music", ticketPrice: 50 },
      { id: 3, name: "Tech Conference", date: "2025-08-10", attendees: 1200, revenue: 60000, status: "upcoming", category: "Tech", ticketPrice: 75 },
      { id: 4, name: "Food Expo", date: "2025-05-20", attendees: 2000, revenue: 50000, status: "completed", category: "Food", ticketPrice: 25 },
      { id: 5, name: "Art Show", date: "2025-04-15", attendees: 600, revenue: 15000, status: "completed", category: "Art", ticketPrice: 25 }
    ];
    return Promise.resolve(events);
  },

  getBookings: () => {
    const bookings = JSON.parse(localStorage.getItem('dashboardBookings')) || [
      { id: 1, userId: 2, eventId: 1, tickets: 2, totalPrice: 100, bookingDate: "2025-06-01", status: "confirmed" },
      { id: 2, userId: 2, eventId: 2, tickets: 1, totalPrice: 50, bookingDate: "2025-06-02", status: "confirmed" },
      { id: 3, userId: 3, eventId: 2, tickets: 4, totalPrice: 200, bookingDate: "2025-06-03", status: "confirmed" },
      { id: 4, userId: 3, eventId: 3, tickets: 1, totalPrice: 75, bookingDate: "2025-06-04", status: "pending" }
    ];
    return Promise.resolve(bookings);
  },

  // Statistics with user-based data filtering
  getStatistics: (userId = null, userRole = 'user') => {
    return Promise.all([mockAPI.getEvents(), mockAPI.getBookings(), mockAPI.getUsers()])
      .then(([events, bookings, users]) => {
        
        let userBookings = bookings;
        let userEvents = events;
        
        // Filter data based on user role
        if (userRole === 'user' && userId) {
          userBookings = bookings.filter(booking => booking.userId === userId);
          const userEventIds = [...new Set(userBookings.map(b => b.eventId))];
          userEvents = events.filter(event => 
            userEventIds.includes(event.id) || event.status === 'upcoming'
          );
        }

        const totalRevenue = userEvents.reduce((sum, event) => sum + event.revenue, 0);
        const totalBookings = userBookings.length;
        const activeUsers = users.filter(user => user.status === 'active').length;
        const upcomingEvents = userEvents.filter(event => event.status === 'upcoming').length;
        
        // Generate monthly data
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => 
          userBookings
            .filter(booking => new Date(booking.bookingDate).getMonth() === i)
            .reduce((sum, booking) => sum + booking.totalPrice, 0)
        );

        const bookingTrends = Array.from({ length: 12 }, (_, i) => 
          userBookings.filter(booking => new Date(booking.bookingDate).getMonth() === i).length
        );

        const userSpent = userBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        return {
          totalUsers: users.length,
          activeUsers,
          totalEvents: userEvents.length,
          upcomingEvents,
          totalRevenue,
          totalBookings,
          monthlyRevenue,
          bookingTrends,
          userBookings: userBookings.length,
          userSpent
        };
      });
  },

  // User actions
  addBooking: (booking) => {
    return mockAPI.getBookings().then(bookings => {
      const newBooking = {
        ...booking,
        id: Math.max(0, ...bookings.map(b => b.id)) + 1,
        bookingDate: new Date().toISOString().split('T')[0]
      };
      const updatedBookings = [...bookings, newBooking];
      localStorage.setItem('dashboardBookings', JSON.stringify(updatedBookings));
      return newBooking;
    });
  },

  addEvent: (event) => {
    return mockAPI.getEvents().then(events => {
      const newEvent = {
        ...event,
        id: Math.max(0, ...events.map(e => e.id)) + 1,
        attendees: 0,
        revenue: 0
      };
      const updatedEvents = [...events, newEvent];
      localStorage.setItem('dashboardEvents', JSON.stringify(updatedEvents));
      return newEvent;
    });
  },

  updateUserStatus: (userId, status) => {
    return mockAPI.getUsers().then(users => {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status } : user
      );
      localStorage.setItem('dashboardUsers', JSON.stringify(updatedUsers));
      return updatedUsers.find(user => user.id === userId);
    });
  }
};

// Login Component
function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await mockAPI.login(credentials.email, credentials.password);
      onLogin(user);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setCredentials({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Event Dashboard</h2>
        <p className="login-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Demo Accounts:</h4>
          <div className="demo-buttons">
            <button 
              onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
              className="demo-btn admin"
            >
              Login as Admin
            </button>
            <button 
              onClick={() => handleDemoLogin('user@example.com', 'user123')}
              className="demo-btn user"
            >
              Login as User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    name: "", 
    date: "", 
    category: "Music", 
    ticketPrice: 50 
  });
  const [notifications, setNotifications] = useState([]);

  // Check authentication on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await mockAPI.getCurrentUser();
        if (user && mockAPI.isAuthenticated()) {
          setCurrentUser(user);
          await loadDashboardData(user);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };
    
    initializeAuth();
  }, []);

  const loadDashboardData = async (user = currentUser) => {
    setLoading(true);
    try {
      const [usersData, eventsData, bookingsData, statsData] = await Promise.all([
        mockAPI.getUsers(),
        mockAPI.getEvents(),
        user?.role === 'admin' ? mockAPI.getBookings() : 
          mockAPI.getBookings().then(bookings => 
            bookings.filter(booking => booking.userId === user?.id)
          ),
        mockAPI.getStatistics(user?.id, user?.role)
      ]);

      setUsers(usersData);
      setEvents(eventsData);
      setBookings(bookingsData);
      setStatistics(statsData);

      // Generate notifications
      const userNotifications = [];
      
      if (user?.role === 'admin') {
        // Admin notifications
        userNotifications.push(
          ...bookingsData.slice(-2).map(booking => ({
            id: booking.id,
            message: `New booking for event #${booking.eventId}`,
            type: 'booking',
            read: false,
            timestamp: new Date().toISOString()
          })),
          ...eventsData.filter(event => event.status === 'upcoming').slice(0, 2).map(event => ({
            id: event.id + 1000,
            message: `Upcoming: ${event.name} on ${event.date}`,
            type: 'event',
            read: false,
            timestamp: new Date().toISOString()
          }))
        );
      } else {
        // User notifications
        userNotifications.push(
          ...bookingsData.slice(-3).map(booking => {
            const event = eventsData.find(e => e.id === booking.eventId);
            return {
              id: booking.id,
              message: `Booking confirmed for ${event?.name}`,
              type: 'booking',
              read: false,
              timestamp: new Date().toISOString()
            };
          })
        );
      }

      setNotifications(userNotifications);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    loadDashboardData(user);
  };

  const handleLogout = async () => {
    await mockAPI.logout();
    setCurrentUser(null);
    setActiveTab("overview");
    setUsers([]);
    setEvents([]);
    setBookings([]);
    setStatistics({});
    setNotifications([]);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        status: "upcoming",
        attendees: 0,
        revenue: 0
      };
      await mockAPI.addEvent(eventData);
      await loadDashboardData();
      setShowAddEvent(false);
      setNewEvent({ name: "", date: "", category: "Music", ticketPrice: 50 });
      
      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        message: `New event created: ${eventData.name}`,
        type: 'event',
        read: false,
        timestamp: new Date().toISOString()
      }, ...prev]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleBookEvent = async (event) => {
    try {
      const booking = {
        userId: currentUser.id,
        eventId: event.id,
        tickets: 1,
        totalPrice: event.ticketPrice,
        status: "confirmed"
      };
      await mockAPI.addBooking(booking);
      await loadDashboardData();
      
      setNotifications(prev => [{
        id: Date.now(),
        message: `Booking confirmed for ${event.name}`,
        type: 'booking',
        read: false,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      alert(`Successfully booked ${event.name}!`);
    } catch (error) {
      console.error("Error booking event:", error);
      alert('Error booking event. Please try again.');
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await mockAPI.updateUserStatus(userId, newStatus);
      const updatedUsers = await mockAPI.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Chart Data
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: currentUser?.role === 'admin' ? "Monthly Revenue ($)" : "Your Spending ($)",
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
        label: currentUser?.role === 'admin' ? "Total Bookings" : "Your Bookings",
        data: statistics.bookingTrends || Array(12).fill(0),
        backgroundColor: "rgba(153,102,255,0.6)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  };

  const eventCategoriesData = {
    labels: events.length > 0 ? [...new Set(events.map(event => event.category))] : ['No Events'],
    datasets: [
      {
        data: events.length > 0 ? 
          [...new Set(events.map(event => event.category))].map(category => 
            events.filter(event => event.category === category).length
          ) : [1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Calculate metrics based on user role
  const getMetrics = () => {
    const baseMetrics = {
      totalRevenue: statistics.totalRevenue || 0,
      totalBookings: statistics.totalBookings || 0,
      activeUsers: statistics.activeUsers || 0,
      upcomingEvents: statistics.upcomingEvents || 0,
    };

    if (currentUser?.role === 'admin') {
      return baseMetrics;
    } else {
      return {
        totalRevenue: statistics.userSpent || 0,
        totalBookings: statistics.userBookings || 0,
        activeUsers: statistics.activeUsers || 0,
        upcomingEvents: statistics.upcomingEvents || 0,
      };
    }
  };

  const metrics = getMetrics();
  const isAdmin = currentUser?.role === "admin";

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <div className="overview-header">
              <h2>
                Welcome back, {currentUser?.name}! 
                {isAdmin && <span className="admin-badge">Administrator</span>}
              </h2>
              <p>
                {isAdmin 
                  ? "Here's your complete event management overview" 
                  : "Here's your personal event dashboard"
                }
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon revenue">💰</div>
                <div className="metric-info">
                  <h3>{isAdmin ? 'Total Revenue' : 'Total Spent'}</h3>
                  <p className="metric-value">${metrics.totalRevenue.toLocaleString()}</p>
                  <span className="metric-label">
                    {isAdmin ? 'All events revenue' : 'Your total spending'}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon bookings">🎫</div>
                <div className="metric-info">
                  <h3>{isAdmin ? 'Total Bookings' : 'Your Bookings'}</h3>
                  <p className="metric-value">{metrics.totalBookings}</p>
                  <span className="metric-label">
                    {isAdmin ? 'All bookings' : 'Your confirmed bookings'}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon users">👥</div>
                <div className="metric-info">
                  <h3>Active Users</h3>
                  <p className="metric-value">{metrics.activeUsers}</p>
                  <span className="metric-label">Registered users</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon events">📅</div>
                <div className="metric-info">
                  <h3>Upcoming Events</h3>
                  <p className="metric-value">{metrics.upcomingEvents}</p>
                  <span className="metric-label">Scheduled events</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>{isAdmin ? 'Revenue Overview' : 'Your Spending Pattern'}</h3>
                <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>

              <div className="chart-card">
                <h3>{isAdmin ? 'Booking Trends' : 'Your Booking History'}</h3>
                <Bar data={bookingsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>

              <div className="chart-card">
                <h3>Event Categories</h3>
                <Doughnut data={eventCategoriesData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Recent Activity & Actions */}
            <div className="action-grid">
              <div className="activity-card">
                <div className="card-header">
                  <h3>{isAdmin ? 'Recent Bookings' : 'Your Recent Bookings'}</h3>
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
                          <small>{booking.bookingDate}</small>
                        </div>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && (
                    <div className="no-data">No bookings found</div>
                  )}
                </div>
              </div>

              <div className="actions-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="action-buttons">
                  {isAdmin ? (
                    <>
                      <button 
                        className="action-btn primary"
                        onClick={() => setShowAddEvent(true)}
                      >
                        + Create New Event
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => setActiveTab('users')}
                      >
                        👥 Manage Users
                      </button>
                      <button className="action-btn secondary">
                        📊 Generate Report
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="action-btn primary"
                        onClick={() => setActiveTab('events')}
                      >
                        🎫 Browse Events
                      </button>
                      <button className="action-btn secondary">
                        📋 My Bookings
                      </button>
                      <button className="action-btn secondary">
                        ⭐ Write Reviews
                      </button>
                    </>
                  )}
                </div>

                {/* Upcoming Events Preview */}
                <div className="upcoming-events">
                  <h4>Upcoming Events</h4>
                  {events.filter(e => e.status === 'upcoming').slice(0, 3).map(event => (
                    <div key={event.id} className="upcoming-event">
                      <span>{event.name}</span>
                      <small>{event.date}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Event Modal */}
            {showAddEvent && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>Create New Event</h3>
                    <button onClick={() => setShowAddEvent(false)} className="close-btn">×</button>
                  </div>
                  <form onSubmit={handleAddEvent}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                      >
                        <option value="Music">Music</option>
                        <option value="Tech">Tech</option>
                        <option value="Food">Food</option>
                        <option value="Art">Art</option>
                        <option value="Sports">Sports</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Ticket Price"
                        value={newEvent.ticketPrice}
                        onChange={(e) => setNewEvent({...newEvent, ticketPrice: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">Create Event</button>
                      <button type="button" onClick={() => setShowAddEvent(false)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case "events":
        return (
          <div className="tab-content">
            <div className="page-header">
              <h2>Available Events</h2>
              {isAdmin && (
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddEvent(true)}
                >
                  + Add New Event
                </button>
              )}
            </div>
            <div className="events-grid">
              {events.filter(event => event.status === 'upcoming').map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3>{event.name}</h3>
                    <span className="event-category">{event.category}</span>
                  </div>
                  <div className="event-details">
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Expected Attendees:</strong> {event.attendees}</p>
                    <p><strong>Ticket Price:</strong> ${event.ticketPrice}</p>
                    {event.revenue > 0 && <p><strong>Revenue:</strong> ${event.revenue.toLocaleString()}</p>}
                  </div>
                  <div className="event-actions">
                    {!isAdmin && (
                      <button 
                        className="book-btn"
                        onClick={() => handleBookEvent(event)}
                      >
                        Book Now - ${event.ticketPrice}
                      </button>
                    )}
                    {isAdmin && (
                      <div className="admin-actions">
                        <button className="btn-small">Edit</button>
                        <button className="btn-small danger">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {events.filter(event => event.status === 'upcoming').length === 0 && (
                <div className="no-events">
                  <p>No upcoming events found.</p>
                  {isAdmin && (
                    <button 
                      className="btn-primary"
                      onClick={() => setShowAddEvent(true)}
                    >
                      Create Your First Event
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="tab-content">
            <div className="profile-container">
              <h2>Your Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{currentUser?.name}</h3>
                    <p className="user-role">{currentUser?.role}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Member Since:</label>
                    <span>{currentUser?.joinDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${currentUser?.status}`}>
                      {currentUser?.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Total Bookings:</label>
                    <span>{bookings.length}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Spent:</label>
                    <span>${statistics.userSpent || 0}</span>
                  </div>
                </div>
                <button className="logout-btn profile-logout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="tab-content">
            <div className="notifications-container">
              <div className="notifications-header">
                <h2>Notifications</h2>
                <span className="unread-count">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              </div>
              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                    <div className="notification-content">
                      <p className="notification-message">{notif.message}</p>
                      <small className="notification-time">
                        {new Date(notif.timestamp).toLocaleString()}
                      </small>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="mark-read-btn"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="no-notifications">
                    <p>No notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "users":
        if (!isAdmin) {
          return (
            <div className="tab-content">
              <div className="access-denied">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
              </div>
            </div>
          );
        }
        return (
          <div className="tab-content">
            <div className="users-management">
              <h2>User Management</h2>
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          <div className="user-actions">
                            <button 
                              className="btn-small"
                              onClick={() => handleUserStatusChange(
                                user.id, 
                                user.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn-small danger">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="tab-content">Select an option from the sidebar.</div>;
    }
  };

  // Show login if no user is authenticated
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>EventFlow</h2>
          <div className="user-info">
            <div className="user-avatar-small">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <small className="user-role">{currentUser.role}</small>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === "overview" ? "active" : ""} 
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">📊</span>
              Overview
            </li>
            <li 
              className={activeTab === "events" ? "active" : ""} 
              onClick={() => setActiveTab("events")}
            >
              <span className="nav-icon">🎫</span>
              Events
            </li>
            <li 
              className={activeTab === "profile" ? "active" : ""} 
              onClick={() => setActiveTab("profile")}
            >
              <span className="nav-icon">👤</span>
              Profile
            </li>
            <li 
              className={activeTab === "notifications" ? "active" : ""} 
              onClick={() => setActiveTab("notifications")}
            >
              <span className="nav-icon">🔔</span>
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </li>
            {isAdmin && (
              <li 
                className={activeTab === "users" ? "active" : ""} 
                onClick={() => setActiveTab("users")}
              >
                <span className="nav-icon">👥</span>
                User Management
              </li>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn-sidebar">
            <span className="nav-icon">🚪</span>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="dashboard-main">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Dashboard;