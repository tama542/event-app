// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
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
    name: "",
    description: "",
    date: "",
    price: 0,
    category: "Music",
    img: "",
    venue: "",
    capacity: 100
  });
  const [editingEventId, setEditingEventId] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [user, navigate]);

  // Load events from JSON file and localStorage
  useEffect(() => {
    // Only load if user is admin
    if (user?.role !== 'admin') return;

    const loadEvents = async () => {
      setLoading(true);
      try {
        // First try to load from localStorage (user-created events)
        const savedEvents = JSON.parse(localStorage.getItem('tn-events') || '[]');
        
        // If no saved events, load from JSON file
        if (savedEvents.length === 0) {
          const response = await fetch("/data/events.json");
          const jsonEvents = await response.json();
          
          // Enhance events with additional properties
          const enhancedEvents = jsonEvents.map(event => ({
            ...event,
            id: event.id || Math.random(),
            venue: event.venue || "Main Hall",
            capacity: event.capacity || 100,
            booked: Math.floor(Math.random() * (event.capacity || 100)),
            status: "active",
            rating: event.rating || Math.floor(Math.random() * 2) + 3,
            reviews: event.reviews || Math.floor(Math.random() * 50) + 10
          }));
          
          setEvents(enhancedEvents);
          localStorage.setItem('tn-events', JSON.stringify(enhancedEvents));
        } else {
          setEvents(savedEvents);
        }
        
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Failed to load events data");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  // Generate bookings whenever events change
  useEffect(() => {
    if (events.length > 0 && user?.role === 'admin') {
      const sampleBookings = generateBookings(events);
      setBookings(sampleBookings);
      calculateStats(events, sampleBookings);
    }
  }, [events, user]);

  const generateBookings = (eventsData) => {
    const bookingTemplates = [
      { userName: "John Doe", userEmail: "john@example.com" },
      { userName: "Jane Smith", userEmail: "jane@example.com" },
      { userName: "Mike Johnson", userEmail: "mike@example.com" },
      { userName: "Sarah Wilson", userEmail: "sarah@example.com" },
      { userName: "David Brown", userEmail: "david@example.com" }
    ];

    return eventsData.flatMap(event => 
      Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, index) => ({
        id: `BK-${event.id}-${index + 1}`,
        eventId: event.id,
        eventTitle: event.name || event.title,
        ...bookingTemplates[Math.floor(Math.random() * bookingTemplates.length)],
        bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tickets: Math.floor(Math.random() * 4) + 1,
        totalAmount: event.price * (Math.floor(Math.random() * 4) + 1),
        status: "confirmed"
      }))
    );
  };

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

  const saveEventsToStorage = (updatedEvents) => {
    localStorage.setItem('tn-events', JSON.stringify(updatedEvents));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (!newEvent.name || !newEvent.date || !newEvent.venue) {
      toast.error("Please fill in all required fields");
      return;
    }

    let updatedEvents;

    if (editingEventId) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === editingEventId 
          ? {
              ...event,
              ...newEvent,
              title: newEvent.name, // For compatibility
              image: newEvent.img,  // For compatibility
              date: newEvent.date.includes('T') ? newEvent.date : `${newEvent.date}T20:00:00Z`
            }
          : event
      );
      toast.success("Event updated successfully!");
    } else {
      // Create new event
      const event = {
        id: Date.now(), // Use timestamp for unique ID
        ...newEvent,
        title: newEvent.name, // For compatibility with EventCard
        image: newEvent.img,  // For compatibility with EventCard
        rating: 0,
        reviews: 0,
        booked: 0,
        status: "active",
        date: newEvent.date.includes('T') ? newEvent.date : `${newEvent.date}T20:00:00Z`
      };

      updatedEvents = [...events, event];
      toast.success("Event created successfully!");
    }

    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
    
    // Reset form
    setNewEvent({
      name: "",
      description: "",
      date: "",
      price: 0,
      category: "Music",
      img: "",
      venue: "",
      capacity: 100
    });
    setEditingEventId(null);
    
    setActiveTab("events");
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      toast.success("Event deleted successfully!");
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      name: event.name || event.title,
      description: event.description,
      date: event.date.split('T')[0],
      price: event.price,
      category: event.category,
      img: event.img || event.image,
      venue: event.venue,
      capacity: event.capacity
    });
    setEditingEventId(event.id);
    setActiveTab("create");
  };

  const cancelEdit = () => {
    setNewEvent({
      name: "",
      description: "",
      date: "",
      price: 0,
      category: "Music",
      img: "",
      venue: "",
      capacity: 100
    });
    setEditingEventId(null);
    setActiveTab("events");
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

  // Show access denied for non-admin users
  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Event Dashboard</h1>
          <p>Please log in to access the dashboard</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Access Denied</h1>
          <p>You need admin privileges to access the dashboard.</p>
          <button 
            className="btn primary" 
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
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
            onClick={() => {
              setActiveTab(tab);
              if (tab !== "create") {
                setEditingEventId(null);
                setNewEvent({
                  name: "",
                  description: "",
                  date: "",
                  price: 0,
                  category: "Music",
                  img: "",
                  venue: "",
                  capacity: 100
                });
              }
            }}
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
                    value={`$${stats.revenue.toLocaleString()}`}
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

                <div className="upcoming-events">
                  <h3>Upcoming Events</h3>
                  <div className="upcoming-list">
                    {events
                      .filter(event => new Date(event.date) > new Date())
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="upcoming-item">
                          <img src={event.img || event.image} alt={event.name || event.title} />
                          <div className="upcoming-details">
                            <h4>{event.name || event.title}</h4>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.venue}</p>
                          </div>
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
                  <h2>Manage Events ({events.length})</h2>
                  <button 
                    className="btn primary"
                    onClick={() => setActiveTab("create")}
                  >
                    + Create New Event
                  </button>
                </div>

                <div className="events-table">
                  {events.length === 0 ? (
                    <div className="no-events">
                      <p>No events found. Create your first event!</p>
                    </div>
                  ) : (
                    events.map(event => (
                      <div key={event.id} className="event-row">
                        <div className="event-info">
                          <img 
                            src={event.img || event.image} 
                            alt={event.name || event.title} 
                            onError={(e) => {
                              e.target.src = '/images/placeholder-event.jpg';
                            }}
                          />
                          <div className="event-details">
                            <h4>{event.name || event.title}</h4>
                            <p>{event.category} • {event.venue}</p>
                            <p>{new Date(event.date).toLocaleDateString()} • ${event.price}</p>
                            <div className="event-meta">
                              <span className={`status ${event.status}`}>
                                {event.status}
                              </span>
                              <span>{event.booked}/{event.capacity} booked</span>
                            </div>
                          </div>
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
                    ))
                  )}
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
                <div className="section-header">
                  <h2>Bookings Management ({bookings.length})</h2>
                </div>
                <div className="bookings-table">
                  {bookings.length === 0 ? (
                    <div className="no-bookings">
                      <p>No bookings yet. Bookings will appear here when customers purchase tickets.</p>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <div key={booking.id} className="booking-row">
                        <div className="booking-info">
                          <strong>{booking.eventTitle}</strong>
                          <p>Booking ID: {booking.id}</p>
                          <p>Customer: {booking.userName} ({booking.userEmail})</p>
                          <p>Date: {booking.bookingDate}</p>
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
                    ))
                  )}
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
                <h2>{editingEventId ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleAddEvent} className="event-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Event Name *</label>
                      <input
                        type="text"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        placeholder="Enter event name"
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
                        <option value="Culture">Culture</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Literature">Literature</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label>Price ($)</label>
                      <input
                        type="number"
                        value={newEvent.price}
                        onChange={(e) => setNewEvent({...newEvent, price: parseFloat(e.target.value) || 0})}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="form-group">
                      <label>Capacity</label>
                      <input
                        type="number"
                        value={newEvent.capacity}
                        onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value) || 100})}
                        min="1"
                        placeholder="100"
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
                        value={newEvent.img}
                        onChange={(e) => setNewEvent({...newEvent, img: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Describe your event..."
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn primary">
                      {editingEventId ? 'Update Event' : 'Create Event'}
                    </button>
                    <button 
                      type="button" 
                      className="btn secondary"
                      onClick={cancelEdit}
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