// src/components/EventCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { motion } from "framer-motion";

// Mock events data - replace this with actual API call or context
const mockEvents = [
  {
    id: "1",
    title: "Live Concert",
    description: "An amazing night of music and fun.",
    date: "2025-12-01T20:00:00",
    image: "https://via.placeholder.com/600x300?text=Concert+Event",
    rating: 4,
    reviews: 120,
    price: 75
  },
  {
    id: "2",
    title: "Art Exhibition",
    description: "Contemporary art from local artists.",
    date: "2025-11-15T10:00:00",
    image: "https://via.placeholder.com/600x300?text=Art+Exhibition",
    rating: 4.5,
    reviews: 89,
    price: 25
  },
  {
    id: "3",
    title: "Food Festival",
    description: "Taste the best local and international cuisine.",
    date: "2025-12-10T12:00:00",
    image: "https://via.placeholder.com/600x300?text=Food+Festival",
    rating: 4.2,
    reviews: 156,
    price: 40
  }
];

const EventDetailsModal = ({ event, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <motion.div
      className="modal-content details-modal"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="close-button" onClick={onClose}>✕</button>
      <img src={event.image} alt={event.title} className="modal-image" />
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <div className="reviews">
        <RatingStars rating={event.rating} />
        <span>({event.reviews} reviews)</span>
      </div>
      <button onClick={onClose} className="btn">Close</button>
    </motion.div>
  </div>
);

const EventCard = ({ event, showAll = false }) => {
  const navigate = useNavigate();

  const { title, description, date, image, rating, reviews, price, id } = event;

  const [timeLeft, setTimeLeft] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const target = new Date(date).getTime();
    const iv = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("Event Started!");
        clearInterval(iv);
      } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [date]);

  const handleBookNow = () => {
    // Direct navigation to payment without seat selection
   
       navigate("/payment", { 
    state: { 
      event: event,
      amount: event.price || 100, // Use event price or default
      bookingReference: `EVT-${event.id}-${Date.now()}`,
    }
      
    });
  };

  const toggleFavorite = () => setIsFavorite((f) => !f);
  const toggleReviews = () => setShowReviews((r) => !r);

  const shareEvent = async () => {
    const shareData = { 
      title: `Event: ${title}`, 
      text: description, 
      url: window.location.href 
    };
    
    if (navigator.share) {
      try { 
        await navigator.share(shareData); 
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard!");
    }
  };

  const countdownStyle = timeLeft.includes("Event Started") ? 
    { color: "red", fontWeight: "bold" } : {};

  return (
    <motion.div 
      className="event-card" 
      whileHover={{ scale: showAll ? 1.02 : 1 }}
      layout
    >
      <img src={image} alt={title} className="event-image" />

      <div className="event-card-content">
        <div className="top-header">
          <h3>{title}</h3>
          <button onClick={toggleFavorite} className="favorite-btn">
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="event-description">
          {showAll ? description : `${description.substring(0, 100)}...`}
        </p>
        
        <p style={countdownStyle}>
          <strong>Starts in:</strong> {timeLeft}
        </p>

        <div className="event-price">
          <strong>Price: ${price}</strong>
        </div>

        <div className="reviews">
          <RatingStars rating={rating} />
          <span>({reviews} reviews)</span>
          <button onClick={toggleReviews} className="toggle-reviews-btn">
            {showReviews ? "Hide" : "Show"} Reviews
          </button>
        </div>

        {showReviews && (
          <motion.div 
            className="review-details" 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
          >
            <p>"Great event! Would definitely go again." - Sarah</p>
            <p>"Amazing atmosphere and great organization." - Mike</p>
            <p>"An unforgettable experience!" - Jessica</p>
          </motion.div>
        )}

        <div className="action-buttons">
          <button onClick={handleBookNow} className="btn primary">
            🎟️ Book Now - ${price}
          </button>
          
          <div className="secondary-buttons">
            <button onClick={shareEvent} className="btn secondary">
              🔗 Share
            </button>
            
            <button
              onClick={() => {
                const subject = encodeURIComponent(`Invitation to ${title}`);
                const body = encodeURIComponent(
                  `Hey,\n\nI'd love for you to join me at "${title}"!\n\nDetails:\n${description}\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${new Date(date).toLocaleTimeString()}\nPrice: $${price}\n\nHere's the link: ${window.location.href}\n\nHope to see you there!`
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              className="btn secondary"
            >
              📧 Invite
            </button>

            <button 
              onClick={() => setShowDetailsModal(true)} 
              className="btn secondary"
            >
              ℹ️ Details
            </button>
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <EventDetailsModal 
          event={event} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </motion.div>
  );
};

// Main Events Section Component
const EventsSection = () => {
  const [events] = useState(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // In a real app, you would fetch events from an API
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await fetch('/api/events');
  //       const eventsData = await response.json();
  //       setEvents(eventsData);
  //     } catch (error) {
  //       console.error('Error fetching events:', error);
  //     }
  //   };
  //   fetchEvents();
  // }, []);

  return (
    <div className="events-section">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        <div className="category-filters">
          <button 
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            All Events
          </button>
          <button 
            className={selectedCategory === "music" ? "active" : ""}
            onClick={() => setSelectedCategory("music")}
          >
            Music
          </button>
          <button 
            className={selectedCategory === "art" ? "active" : ""}
            onClick={() => setSelectedCategory("art")}
          >
            Art
          </button>
          <button 
            className={selectedCategory === "food" ? "active" : ""}
            onClick={() => setSelectedCategory("food")}
          >
            Food
          </button>
        </div>
      </div>

      <motion.div 
        className="events-grid"
        layout
      >
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            showAll={true}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default EventCard;
// export { EventCard }; // Export individual card if needed elsewhere