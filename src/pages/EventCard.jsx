// src/components/EventCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { motion } from "framer-motion";

const EventDetailsModal = ({ event, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <motion.div
      className="modal-content details-modal"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="close-button" onClick={onClose}>✕</button>
      <img 
        src={event.image || event.img} 
        alt={event.title || event.name} 
        className="modal-image"
        onError={(e) => {
          e.target.src = '/images/placeholder-event.jpg';
          e.target.alt = 'Event image not available';
        }}
      />
      <h2>{event.title || event.name}</h2>
      <p>{event.description}</p>
      <div className="modal-details">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Price:</strong> ${event.price}</p>
        <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
        <p><strong>Category:</strong> {event.category}</p>
        {event.capacity && (
          <p><strong>Capacity:</strong> {event.capacity} seats</p>
        )}
      </div>
      <div className="reviews">
        <RatingStars rating={event.rating} />
        <span>({event.reviews} reviews)</span>
      </div>
      <div className="modal-actions">
        <button 
          onClick={() => {
            onClose();
            navigate("/payment", { 
              state: { 
                event: event,
                amount: event.price || 100,
                bookingReference: `EVT-${event.id}-${Date.now()}`,
              }
            });
          }} 
          className="btn primary"
        >
          Book Now - ${event.price}
        </button>
        <button onClick={onClose} className="btn secondary">Close</button>
      </div>
    </motion.div>
  </div>
);

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { 
    title, 
    name, 
    description, 
    date, 
    image, 
    img, 
    rating, 
    reviews, 
    price, 
    id, 
    venue,
    capacity,
    booked 
  } = event;

  const eventTitle = title || name;
  const eventImage = image || img;
  const eventRating = rating || 4;
  const eventReviews = reviews || 0;

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
    navigate("/payment", { 
      state: { 
        event: event,
        amount: event.price || 100,
        bookingReference: `EVT-${event.id}-${Date.now()}`,
      }
    });
  };

  const toggleFavorite = () => {
    setIsFavorite((f) => !f);
    // Save to localStorage
    const favorites = JSON.parse(localStorage.getItem('tn-favs') || '[]');
    if (!isFavorite) {
      const updatedFavorites = [...favorites, event.id];
      localStorage.setItem('tn-favs', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter(favId => favId !== event.id);
      localStorage.setItem('tn-favs', JSON.stringify(updatedFavorites));
    }
  };

  const toggleReviews = () => setShowReviews((r) => !r);

  const shareEvent = async () => {
    const shareData = { 
      title: `Event: ${eventTitle}`, 
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

  // Check if event is in favorites on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('tn-favs') || '[]');
    setIsFavorite(favorites.includes(event.id));
  }, [event.id]);

  return (
    <motion.div 
      className="event-card" 
      whileHover={{ scale: 1.02 }}
      layout
    >
      <img 
        src={eventImage} 
        alt={eventTitle} 
        className="event-image"
        onError={(e) => {
          e.target.src = '/images/placeholder-event.jpg';
          e.target.alt = 'Event image not available';
        }}
      />

      <div className="event-card-content">
        <div className="top-header">
          <h3>{eventTitle}</h3>
          <button 
            onClick={toggleFavorite} 
            className="favorite-btn"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="event-description">
          {description}
        </p>
        
        <div className="event-meta-info">
          <p style={countdownStyle}>
            <strong>Starts in:</strong> {timeLeft}
          </p>
          {venue && (
            <p className="event-venue">
              <strong>Venue:</strong> {venue}
            </p>
          )}
        </div>

        <div className="event-price">
          <strong>Price: ${price}</strong>
          {capacity && booked !== undefined && (
            <span className="event-capacity">
              {booked}/{capacity} booked
            </span>
          )}
        </div>

        <div className="reviews">
          <RatingStars rating={eventRating} />
          <span>({eventReviews} reviews)</span>
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
                const subject = encodeURIComponent(`Invitation to ${eventTitle}`);
                const body = encodeURIComponent(
                  `Hey,\n\nI'd love for you to join me at "${eventTitle}"!\n\nDetails:\n${description}\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\nPrice: $${price}\nVenue: ${venue || 'TBA'}\n\nHere's the link: ${window.location.href}\n\nHope to see you there!`
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

export default EventCard;