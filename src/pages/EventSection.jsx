// src/components/EventSection.js
import React, { useState } from "react";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const EventSection = () => {
  const events = [
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
    },
    {
      id: 3,
      title: "Art Festival",
      description: "Experience creativity at its finest at the annual art festival.",
      date: "2025-07-20T15:00:00",
      image: "/pic/art.jpg",
      rating: 3,
      reviews: 15,
      category: "Art",
      price: 25,
    },
    {
      id: 4,
      title: "Food Carnival",
      description: "Taste a variety of international cuisines at our food carnival.",
      date: "2025-12-01T12:00:00",
      image: "/pic/food.jpg",
      rating: 4,
      reviews: 50,
      category: "Food",
      price: 30,
    },
    {
      id: 5,
      title: "Sports Gala",
      description: "Cheer on your favorite teams at our annual sports gala.",
      date: "2025-10-05T18:00:00",
      image: "/pic/sports.jpg",
      rating: 5,
      reviews: 45,
      category: "Sports",
      price: 35,
    },
    {
      id: 6,
      title: "Cultural Fair",
      description: "Celebrate traditions and diversity at the Cultural Fair.",
      date: "2025-11-11T14:00:00",
      image: "/pic/culture.jpg",
      rating: 4,
      reviews: 25,
      category: "Culture",
      price: 20,
    },
    {
      id: 7,
      title: "Outdoor Movie Night",
      description: "Join us for a magical evening under the stars with a classic film.",
      date: "2025-08-30T19:00:00",
      image: "/pic/movie.jpg",
      rating: 4,
      reviews: 30,
      category: "Entertainment",
      price: 15,
    },
    {
      id: 8,
      title: "Book Festival",
      description: "Meet your favorite authors and explore new genres at our Book Festival.",
      date: "2025-10-20T11:00:00",
      image: "/pic/books.jpg",
      rating: 5,
      reviews: 40,
      category: "Literature",
      price: 10,
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Music", "Tech", "Art", "Food", "Sports", "Culture", "Entertainment", "Literature"];

  const filteredEvents = events.filter((event) => {
    return (
      (selectedCategory === "All" || event.category === selectedCategory) &&
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
          <p className="no-events">No events found. Try adjusting your search or filters.</p>
        )}
      </motion.div>
    </section>
  );
};

export default EventSection;