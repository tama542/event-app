// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // Add this import

const Dashboard = () => { // Remove the user prop
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    price: 0,
    category: "Music",
    image: "",
    venue: "",
    capacity: 100
  });

  // Sample events data (replace with your API)
  const sampleEvents = [
    {
      id: 1,
      title: "Summer Concert",
      description: "Enjoy an unforgettable night with live music under the stars.",
      date: "2025-08-15T20:00:00",
      image: "/pic/summer.jpg",
      rating: 4,
      reviews: 20,
      category: "Music",
      price: 40,
      venue: "Central Park",
      capacity: 1000,
      booked: 750,
      status: "active"
    },
    {
      id: 2,
      title: "Tech Expo",
      description: "Discover cutting-edge innovations at the annual tech expo.",
      date: "2025-09-10T10:00:00",
      image: "/pic/tech-expo.jpg",
      rating: 5,
      reviews: 35,
      category: "Tech",
      price: 60,
      venue: "Convention Center",
      capacity: 2000,
      booked: 1200,
      status: "active"
    }
  ];

  const sampleBookings = [
    {
      id: "BK-001",
      eventId: 1,
      eventTitle: "Summer Concert",
      userName: "John Doe",
      userEmail: "john@example.com",
      bookingDate: "2024-01-15",
      tickets: 2,
      totalAmount: 80,
      status: "confirmed"
    },
    {
      id: "BK-002",
      eventId: 2,
      eventTitle: "Tech Expo",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      bookingDate: "2024-01-16",
      tickets: 1,
      totalAmount: 60,
      status: "confirmed"
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setLoading(true);
    setTimeout(() => {
      setEvents(sampleEvents);
      setBookings(sampleBookings);
      calculateStats(sampleEvents, sampleBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (eventsData, bookingsData) => {
    const totalEvents = eventsData.length;
    const totalBookings = bookingsData.length;
    const revenue = bookingsData.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const upcomingEvents = eventsData.filter(event => new Date(event.date) > new Date()).length;

    setStats({
      totalEvents,
      totalBookings,
      revenue,
      upcomingEvents
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      toast.error("Please fill in all required fields");
      return;
    }

    const event = {
      id: events.length + 1,
      ...newEvent,
      rating: 0,
      reviews: 0,
      booked: 0,
      status: "active"
    };

    setEvents([...events, event]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      price: 0,
      category: "Music",
      image: "",
      venue: "",
      capacity: 100
    });
    
    toast.success("Event created successfully!");
    setActiveTab("events");
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully!");
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.date.split('T')[1]?.substring(0, 5) || "",
      price: event.price,
      category: event.category,
      image: event.image,
      venue: event.venue,
      capacity: event.capacity
    });
    setActiveTab("create");
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </motion.div>
  );

  // Add debug logging
  console.log('🏠 Dashboard - Current user from AuthContext:', user);

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Event Dashboard</h1>
          <p>Please log in to access the dashboard</p>
          <p>Debug: User is null in Dashboard component</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Event Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name || user.username}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        {["overview", "events", "bookings", "create"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overview-grid"
              >
                <div className="stats-grid">
                  <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    icon="🎭"
                    color="#4f46e5"
                  />
                  <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon="🎟️"
                    color="#10b981"
                  />
                  <StatCard
                    title="Revenue"
                    value={`$${stats.revenue}`}
                    icon="💰"
                    color="#f59e0b"
                  />
                  <StatCard
                    title="Upcoming Events"
                    value={stats.upcomingEvents}
                    icon="📅"
                    color="#ef4444"
                  />
                </div>

                <div className="recent-activity">
                  <h3>Recent Bookings</h3>
                  <div className="activity-list">
                    {bookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="activity-item">
                        <div className="activity-info">
                          <strong>{booking.userName}</strong>
                          <span>booked {booking.tickets} ticket(s) for</span>
                          <strong>{booking.eventTitle}</strong>
                        </div>
                        <span className="activity-amount">${booking.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="events-management"
              >
                <div className="section-header">
                  <h2>Manage Events</h2>
                  <button 
                    className="btn primary"
                    onClick={() => setActiveTab("create")}
                  >
                    + Create New Event
                  </button>
                </div>

                <div className="events-table">
                  {events.map(event => (
                    <div key={event.id} className="event-row">
                      <div className="event-info">
                        <img src={event.image} alt={event.title} />
                        <div className="event-details">
                          <h4>{event.title}</h4>
                          <p>{event.category} • {event.venue}</p>
                          <p>{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="event-stats">
                        <span>{event.booked}/{event.capacity} booked</span>
                        <span>${event.price}</span>
                      </div>
                      <div className="event-actions">
                        <button 
                          className="btn secondary small"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn danger small"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bookings-management"
              >
                <h2>Bookings Management</h2>
                <div className="bookings-table">
                  {bookings.map(booking => (
                    <div key={booking.id} className="booking-row">
                      <div className="booking-info">
                        <strong>{booking.eventTitle}</strong>
                        <p>Booking ID: {booking.id}</p>
                        <p>Customer: {booking.userName} ({booking.userEmail})</p>
                      </div>
                      <div className="booking-details">
                        <span>{booking.tickets} ticket(s)</span>
                        <span>${booking.totalAmount}</span>
                        <span className={`status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-actions">
                        <button className="btn secondary small">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Create Event Tab */}
            {activeTab === "create" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="create-event"
              >
                <h2>{newEvent.title ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleAddEvent} className="event-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Event Title *</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                      >
                        <option value="Music">Music</option>
                        <option value="Tech">Tech</option>
                        <option value="Art">Art</option>
                        <option value="Food">Food</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Price ($)</label>
                      <input
                        type="number"
                        value={newEvent.price}
                        onChange={(e) => setNewEvent({...newEvent, price: parseFloat(e.target.value)})}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Capacity</label>
                      <input
                        type="number"
                        value={newEvent.capacity}
                        onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})}
                        min="1"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Venue *</label>
                      <input
                        type="text"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                        placeholder="Enter venue address"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={newEvent.image}
                        onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Enter event description"
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn primary">
                      {newEvent.title ? 'Update Event' : 'Create Event'}
                    </button>
                    <button 
                      type="button" 
                      className="btn secondary"
                      onClick={() => {
                        setNewEvent({
                          title: "",
                          description: "",
                          date: "",
                          time: "",
                          price: 0,
                          category: "Music",
                          image: "",
                          venue: "",
                          capacity: 100
                        });
                        setActiveTab("events");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;