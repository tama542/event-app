// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import TicketBooking from '../components/TicketBooking';
// import SocialShare from '../components/SocialShare';

// function EventDetails() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
  
//   useEffect(() => {
//     // Simulated API call – replace with actual API integration
//     const demoEvent = {
//       id,
//       title: "Summer Music Festival",
//       date: "2025-06-20",
//       category: "Music",
//       location: "Central Park",
//       description: "Join us for an unforgettable experience with live performances, food vendors, and immersive activities. Feel the energy and make memories that last a lifetime!",
//       image: "https://source.unsplash.com/1200x400/?concert"
//     };
//     setTimeout(() => setEvent(demoEvent), 500);
//   }, [id]);

//   if (!event) return <p>Loading event details...</p>;

//   return (
//     <div className="event-details">
//       <img src={event.image} alt={event.title} />
//       <h2>{event.title}</h2>
//       <p><strong>Date:</strong> {event.date}</p>
//       <p><strong>Location:</strong> {event.location}</p>
//       <p>{event.description}</p>
//       <TicketBooking eventTitle={event.title} />
//       <SocialShare eventUrl={window.location.href} eventTitle={event.title} />
//     </div>
//   );
// }

// export default EventDetails;

// src/components/EventSection.jsx


// src/components/EventSection.jsx
import React, { useState } from "react";
import EventCard from "./EventCard";

const EventSection = () => {
  // Define a longer list of sample events across more categories
  const events = [
    {
      id: 1,
      title: "Summer Concert",
      description: "Enjoy an unforgettable night with live music under the stars.",
      date: "2025-08-15T20:00:00",
      image: "/pic/summer.jpg",
      rating: 4,
      reviews: 20,
      category: "Music"
    },
    {
      id: 2,
      title: "Tech Expo",
      description: "Discover cutting-edge innovations at the annual tech expo.",
      date: "2025-09-10T10:00:00",
      image: "/pic/tech-expo.jpg",
      rating: 5,
      reviews: 35,
      category: "Tech"
    },
    {
      id: 3,
      title: "Art Festival",
      description: "Experience creativity at its finest at the annual art festival.",
      date: "2025-07-20T15:00:00",
      image: "/pic/art.jpg",
      rating: 3,
      reviews: 15,
      category: "Art"
    },
    {
      id: 4,
      title: "Food Carnival",
      description: "Taste a variety of international cuisines at our food carnival.",
      date: "2025-12-01T12:00:00",
      image: "/pic/food.jpg",
      rating: 4,
      reviews: 50,
      category: "Food"
    },
    {
      id: 5,
      title: "Sports Gala",
      description: "Cheer on your favorite teams at our annual sports gala.",
      date: "2025-10-05T18:00:00",
      image: "/pic/sports.jpg",
      rating: 5,
      reviews: 45,
      category: "Sports"
    },
    {
      id: 6,
      title: "Cultural Fair",
      description: "Celebrate traditions and diversity at the Cultural Fair.",
      date: "2025-11-11T14:00:00",
      image: "/pic/culture.jpg",
      rating: 4,
      reviews: 25,
      category: "Culture"
    },
    {
      id: 7,
      title: "Outdoor Movie Night",
      description: "Join us for a magical evening under the stars with a classic film.",
      date: "2025-08-30T19:00:00",
      image: "/pic/movie.jpg",
      rating: 4,
      reviews: 30,
      category: "Entertainment"
    },
    {
      id: 8,
      title: "Book Festival",
      description: "Meet your favorite authors and explore new genres at our Book Festival.",
      date: "2025-10-20T11:00:00",
      image: "/pic/books.jpg",
      rating: 5,
      reviews: 40,
      category: "Literature"
    }
  ];

  // Define search and category filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories includes All to show every event.
  const categories = ["All", "Music", "Tech", "Art", "Food", "Sports", "Culture", "Entertainment", "Literature"];

  // Filter events based on search term and selected category.
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
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="event-cards">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>
    </section>
  );
};

export default EventSection;
