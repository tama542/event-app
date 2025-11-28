// src/components/EventSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const normalizeEventData = useCallback((events) => {
    return events.map(event => ({
      id: event.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: event.title || event.name || "Untitled Event",
      name: event.name || event.title || "Untitled Event",
      description: event.description || "No description available",
      date: event.date || new Date(Date.now() + 86400000).toISOString(),
      image: event.image || event.img || "/images/placeholder-event.jpg",
      img: event.img || event.image || "/images/placeholder-event.jpg",
      price: typeof event.price === 'number' ? event.price : 
             parseFloat(event.price) || 0,
      category: event.category || "General",
      rating: event.rating || Math.floor(Math.random() * 2) + 3,
      reviews: event.reviews || Math.floor(Math.random() * 50) + 10,
      venue: event.venue || "Main Hall",
      capacity: event.capacity || 100,
      booked: event.booked || Math.floor(Math.random() * (event.capacity || 100))
    }));
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        
        // Load from localStorage first (user-created events)
        const savedEvents = JSON.parse(localStorage.getItem('tn-events') || '[]');
        
        if (savedEvents.length > 0) {
          setEvents(normalizeEventData(savedEvents));
        } else {
          // Load from events.json
          try {
            const response = await fetch("/data/events.json");
            if (!response.ok) throw new Error("Failed to fetch events");
            
            const jsonEvents = await response.json();
            setEvents(normalizeEventData(jsonEvents));
          } catch (fetchError) {
            console.warn("Could not load events.json, checking for direct data...");
            // Use the sample data you provided
            const sampleEvents = [
              {
                "id": 1,
                "name": "Summer Jazz Fest",
                "date": "2025-07-10T19:00:00Z",
                "price": 25,
                "category": "Music",
                "img": "/pic/summer.jpg",
                "description": "An evening of smooth jazz by the lake.",
                "venue": "Lakeside Amphitheater",
                "capacity": 500
              },
              {
                "id": 2,
                "name": "Tech Innovators Conference",
                "date": "2025-08-05T09:00:00Z",
                "price": 20,
                "category": "Tech",
                "img": "/pic/movie.jpg",
                "description": "Join the brightest minds in AI, web3 & robotics.",
                "venue": "Convention Center",
                "capacity": 1000
              },
              {
                "id": 3,
                "name": "Art Festival",
                "date": "2025-07-20T15:00:00Z",
                "price": 15,
                "category": "Art",
                "img": "/pic/art.jpg",
                "description": "Experience creativity at its finest at the annual art festival.",
                "venue": "City Park",
                "capacity": 300
              },
              {
                "id": 4,
                "name": "Food Carnival",
                "date": "2025-12-01T12:00:00Z",
                "price": 30,
                "category": "Food",
                "img": "/pic/food.jpg",
                "description": "Taste a variety of international cuisines at our food carnival.",
                "venue": "Downtown Square",
                "capacity": 800
              },
              {
                "id": 5,
                "name": "Sports Gala",
                "date": "2025-10-05T18:00:00Z",
                "price": 35,
                "category": "Sports",
                "img": "/pic/sports.jpg",
                "description": "Cheer on your favorite teams at our annual sports gala.",
                "venue": "Sports Arena",
                "capacity": 2000
              },
              {
                "id": 6,
                "name": "Cultural Fair",
                "date": "2025-11-11T14:00:00Z",
                "price": 20,
                "category": "Culture",
                "img": "/pic/culture.jpg",
                "description": "Celebrate traditions and diversity at the Cultural Fair.",
                "venue": "Community Center",
                "capacity": 400
              }
            ];
            setEvents(normalizeEventData(sampleEvents));
          }
        }
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    const handleStorageChange = () => {
      const savedEvents = JSON.parse(localStorage.getItem('tn-events') || '[]');
      setEvents(normalizeEventData(savedEvents));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('events-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('events-updated', handleStorageChange);
    };
  }, [normalizeEventData]);

  const categories = ["All", ...new Set(events.map(event => event.category).filter(Boolean))];

  const filteredEvents = events.filter((event) => {
    const eventName = event.name || event.title || "";
    const eventDescription = event.description || "";
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (selectedCategory === "All" || event.category === selectedCategory) &&
      (eventName.toLowerCase().includes(searchLower) ||
        eventDescription.toLowerCase().includes(searchLower) ||
        event.venue?.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <section className="event-section">
      <div className="event-section-header">
        <h2>Discover Exciting Events</h2>
        <p>Explore a curated list of events tailored to your interests and make every experience memorable.</p>
      </div>

      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events by name, description, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="events-info">
        <p>Showing {filteredEvents.length} of {events.length} events</p>
      </div>

      <motion.div 
        className="event-cards"
        layout
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events-message">
            <h3>No events found</h3>
            <p>Try adjusting your search or filters, or check back later for new events.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default EventSection;