// src/components/EventCard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { motion, AnimatePresence } from "framer-motion";

const EventDetailsModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    onClose();
    navigate("/payment", { 
      state: { 
        event: event,
        amount: event.price || 0,
        bookingReference: `EVT-${event.id}-${Date.now()}`,
      }
    });
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return numPrice === 0 ? "Free" : `$${numPrice.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "Date TBA";
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return "Time TBA";
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'Tech': '💻',
      'Art': '🎨',
      'Food': '🍕',
      'Sports': '⚽',
      'Culture': '🌍',
      'General': '🎭'
    };
    return icons[category] || '🎭';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content details-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="modal-image-container" data-category={event.category}>
          <div className="image-placeholder">
            <span className="placeholder-text">
              {getCategoryIcon(event.category)} {event.category}
            </span>
          </div>
          <img 
            src={event.img || event.image} 
            alt={event.title || event.name} 
            className="modal-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        <div className="modal-body">
          <div className="modal-header">
            <h2>{event.title || event.name}</h2>
            <span className="event-price-badge">{formatPrice(event.price)}</span>
          </div>
          
          <p className="event-description">{event.description}</p>
          
          <div className="modal-details">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <strong>Date:</strong> {formatDate(event.date)}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <div>
                <strong>Time:</strong> {formatTime(event.date)}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <div>
                <strong>Price:</strong> {formatPrice(event.price)}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <strong>Venue:</strong> {event.venue || 'TBA'}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🎯</span>
              <div>
                <strong>Category:</strong> {event.category}
              </div>
            </div>
            {event.capacity && (
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <div>
                  <strong>Capacity:</strong> {event.capacity} seats
                </div>
              </div>
            )}
          </div>
          
          <div className="reviews-section">
            <RatingStars rating={event.rating} />
            <span>({event.reviews} reviews)</span>
          </div>
          
          <div className="modal-actions">
            <button onClick={handleBookNow} className="btn primary">
              Book Now - {formatPrice(event.price)}
            </button>
            <button onClick={onClose} className="btn secondary">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = useCallback((price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return numPrice === 0 ? "Free" : `$${numPrice.toFixed(2)}`;
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'Tech': '💻',
      'Art': '🎨',
      'Food': '🍕',
      'Sports': '⚽',
      'Culture': '🌍',
      'General': '🎭'
    };
    return icons[category] || '🎭';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageLoaded(false);
    e.target.style.display = 'none';
  };

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        const target = new Date(event.date).getTime();
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
          return "Event Started!";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${minutes}m`;
        }
      } catch {
        return "Date TBA";
      }
    };

    setTimeLeft(calculateTimeLeft());
    
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(interval);
  }, [event.date]);

  // Favorite management
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('tn-favs') || '[]');
    setIsFavorite(favorites.includes(event.id));
  }, [event.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    const favorites = JSON.parse(localStorage.getItem('tn-favs') || '[]');
    
    if (newFavoriteState) {
      const updatedFavorites = [...favorites, event.id];
      localStorage.setItem('tn-favs', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter(favId => favId !== event.id);
      localStorage.setItem('tn-favs', JSON.stringify(updatedFavorites));
    }
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate("/payment", { 
      state: { 
        event: event,
        amount: event.price,
        bookingReference: `EVT-${event.id}-${Date.now()}`,
      }
    });
  };

  const shareEvent = async (e) => {
    e.stopPropagation();
    const shareData = { 
      title: `${event.title || event.name}`, 
      text: event.description, 
      url: window.location.href 
    };
    
    if (navigator.share) {
      try { 
        await navigator.share(shareData); 
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Event URL copied to clipboard!");
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("Event URL copied to clipboard!");
      }
    }
  };

  const countdownStyle = timeLeft.includes("Event Started") ? 
    { color: "#e74c3c", fontWeight: "bold" } : 
    timeLeft.includes("TBA") ? 
    { color: "#7f8c8d", fontStyle: "italic" } : {};

  return (
    <>
      <motion.div 
        className="event-card" 
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="event-image-container"
          data-category={event.category}
        >
          <div className="image-placeholder">
            <span className="placeholder-text">
              {getCategoryIcon(event.category)} {event.category}
            </span>
          </div>
          <img 
            src={event.img || event.image} 
            alt={event.title || event.name} 
            className="event-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          <button 
            onClick={toggleFavorite} 
            className="favorite-btn"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="event-card-content">
          <div className="event-header">
            <h3 className="event-title">{event.title || event.name}</h3>
            <span className="event-price-tag">{formatPrice(event.price)}</span>
          </div>

          <p className="event-description">
            {event.description?.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </p>
          
          <div className="event-meta-info">
            <p className="countdown" style={countdownStyle}>
              <strong>Starts in:</strong> {timeLeft}
            </p>
            {event.venue && (
              <p className="event-venue">
                <strong>Venue:</strong> {event.venue}
              </p>
            )}
          </div>
{/* 
          {event.capacity && (
            <div className="event-capacity">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill"
                  style={{ 
                    width: `${((event.booked || 0) / event.capacity) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="capacity-text">
                {event.booked || 0}/{event.capacity} booked
              </span>
            </div> */}
          {/* )} */}

          <div className="reviews-section">
            <div className="rating-container">
              <RatingStars rating={event.rating} />
              <span className="reviews-count">({event.reviews} reviews)</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowReviews(!showReviews);
              }} 
              className="toggle-reviews-btn"
            >
              {showReviews ? "Hide" : "Show"} Reviews
            </button>
          </div>

          <AnimatePresence>
            {showReviews && (
              <motion.div 
                className="review-details" 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="review-item">
                  <strong>Sarah:</strong> "Great event! Would definitely go again."
                </div>
                <div className="review-item">
                  <strong>Mike:</strong> "Amazing atmosphere and great organization."
                </div>
                <div className="review-item">
                  <strong>Jessica:</strong> "An unforgettable experience!"
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="action-buttons">
            <button onClick={handleBookNow} className="btn primary">
              🎟️ Book Now
            </button>
            
            <div className="secondary-buttons">
              <button onClick={shareEvent} className="btn secondary">
                🔗 Share
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const subject = encodeURIComponent(`Invitation to ${event.title || event.name}`);
                  const body = encodeURIComponent(
                    `Hey!\n\nI'd love for you to join me at "${event.title || event.name}"!\n\nEvent Details:\n${event.description}\n\n📅 Date: ${new Date(event.date).toLocaleDateString()}\n⏰ Time: ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n💰 Price: ${formatPrice(event.price)}\n📍 Venue: ${event.venue || 'TBA'}\n\nGet your tickets here: ${window.location.href}\n\nHope to see you there!`
                  );
                  window.open(`mailto:?subject=${subject}&body=${body}`);
                }}
                className="btn secondary"
              >
                📧 Invite
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsModal(true);
                }} 
                className="btn secondary"
              >
                ℹ️ Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetailsModal && (
          <EventDetailsModal 
            event={event} 
            onClose={() => setShowDetailsModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EventCard;