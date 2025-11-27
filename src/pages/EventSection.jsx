// src/components/EventSection.jsx
import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Load from localStorage first (user-created events), then fallback to JSON
        const savedEvents = JSON.parse(localStorage.getItem('tn-events') || '[]');
        
        if (savedEvents.length > 0) {
          setEvents(savedEvents);
        } else {
          // Fallback to JSON file
          const response = await fetch("/data/events.json");
          const jsonEvents = await response.json();
          
          const enhancedEvents = jsonEvents.map(event => ({
            ...event,
            title: event.name,
            image: event.img,
            rating: event.rating || Math.floor(Math.random() * 2) + 3,
            reviews: event.reviews || Math.floor(Math.random() * 50) + 10,
            venue: event.venue || "Main Hall",
            capacity: event.capacity || 100,
            booked: Math.floor(Math.random() * (event.capacity || 100))
          }));
          
          setEvents(enhancedEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Listen for storage changes to update events in real-time
    const handleStorageChange = () => {
      const savedEvents = JSON.parse(localStorage.getItem('tn-events') || '[]');
      setEvents(savedEvents);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const categories = ["All", ...new Set(events.map(event => event.category))];

  const filteredEvents = events.filter((event) => {
    const eventName = event.name || event.title;
    const eventDescription = event.description || "";
    
    return (
      (selectedCategory === "All" || event.category === selectedCategory) &&
      (eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eventDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="loading-spinner">Loading events...</div>;
  }

  return (
    <section className="event-section">
      <div className="event-section-header">
        <h2>Discover Exciting Events</h2>
        <p>Explore a curated list of events tailored to your interests and make every experience memorable.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
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

      <motion.div 
        className="event-cards"
        layout
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
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