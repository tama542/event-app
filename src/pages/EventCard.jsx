// src/components/EventCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingStars from "./RatingStars";
import { motion } from "framer-motion";

const SeatBookingModal = ({ onClose, onConfirm }) => {
  const initialSeats = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => ({
      id: `${r}-${c}`,
      available: Math.random() > 0.2,
    }))
  );

  const [seats] = useState(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAR, setShowAR] = useState(false);

  const handleSeatClick = (seat) => {
    if (!seat.available) return alert("This seat is not available.");
    setSelectedSeat(seat);
  };

  return (
    <div className="seat-modal">
      <motion.div
        className="seat-modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button className="close-button" onClick={onClose}>✕</button>
        <h2>Select Your Seat</h2>

        <div className="seat-grid">
          {seats.map((row, ri) => (
            <div key={ri} className="seat-row">
              {row.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.available ? "available" : "unavailable"} ${selectedSeat?.id === seat.id ? "selected" : ""}`}
                  onClick={() => handleSeatClick(seat)}
                  title={`Seat ${seat.id}`}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedSeat && (
          <>
            <p>Selected: <strong>{selectedSeat.id}</strong></p>
            <button onClick={() => setShowAR(true)} className="btn secondary">
              🎥 View 360° / AR Preview
            </button>
          </>
        )}

        {showAR && (
          <div className="ar-view">
            <button className="close-button" onClick={() => setShowAR(false)}>✕</button>
            <h3>360° View Seat {selectedSeat.id}</h3>
            <img
              src={`https://via.placeholder.com/600x400?text=360+Seat+${selectedSeat.id}`}
              alt={`360 view ${selectedSeat.id}`}
            />
          </div>
        )}

        <button
          onClick={() => {
            if (!selectedSeat) return alert("Please select a seat first.");
            onConfirm(selectedSeat);
          }}
          className="btn confirm-btn"
        >
          ✅ Confirm & Book
        </button>
      </motion.div>
    </div>
  );
};

const EventDetailsModal = ({ event, onClose }) => (
  <div className="modal-overlay">
    <motion.div
      className="modal-content details-modal"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <button className="close-button" onClick={onClose}>✕</button>
      <img src={event.image} alt={event.title} className="modal-image" />
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <div className="reviews">
        <RatingStars rating={event.rating} />
        <span>({event.reviews} reviews)</span>
      </div>
      <button onClick={onClose} className="btn">Close</button>
    </motion.div>
  </div>
);

const EventCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Stub event data (replace with fetch/store)
  const event = {
    id,
    title: "Live Concert",
    description: "An amazing night of music and fun.",
    date: "2025-12-01T20:00:00",
    image: "https://via.placeholder.com/600x300?text=Event+Image",
    rating: 4,
    reviews: 120,
  };

  const { title, description, date, image, rating, reviews } = event;

  const [timeLeft, setTimeLeft] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
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

  const handleSeatConfirm = (selectedSeat) => {
    const amount = 100;
    setShowSeatModal(false);
    navigate("/payment", { state: { event, selectedSeat, amount } });
  };

  const toggleFavorite = () => setIsFavorite((f) => !f);
  const toggleReviews = () => setShowReviews((r) => !r);

  const shareEvent = async () => {
    const shareData = { title: `Event: ${title}`, text: description, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); alert("Shared!"); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied");
    }
  };

  const countdownStyle = timeLeft.includes("Event Started") ? { color: "red", fontWeight: "bold" } : {};

  return (
    <motion.div className="event-card" whileHover={{ scale: 1.02 }}>
      <img src={image} alt={title} className="event-image" />

      <div className="event-card-content">
        <div className="top-header">
          <h3>{title}</h3>
          <button onClick={toggleFavorite} className="favorite-btn">
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p>{description}</p>
        <p style={countdownStyle}><strong>Starts in:</strong> {timeLeft}</p>

        <div className="reviews">
          <RatingStars rating={rating} />
          <span>({reviews} reviews)</span>
          <button onClick={toggleReviews} className="toggle-reviews-btn">
            {showReviews ? "Hide" : "Show"} Reviews
          </button>
        </div>

        {showReviews && (
          <motion.div className="review-details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>"Great event!" - Mark</p>
            <p>"An unforgettable time!" - Nancy</p>
          </motion.div>
        )}

        <div className="action-buttons">
          <button onClick={() => setShowSeatModal(true)} className="btn primary">🎟️ RSVP / Book Now</button>
          <button onClick={shareEvent} className="btn secondary">🔗 Share</button>
          <button onClick={() => alert("Email invite feature coming soon!")} className="btn secondary">📧 Email Invite</button>
          <button onClick={() => setShowDetailsModal(true)} className="btn secondary">ℹ️ Details</button>
        </div>
      </div>

      {showSeatModal && (
        <SeatBookingModal onClose={() => setShowSeatModal(false)} onConfirm={handleSeatConfirm} />
      )}
      {showDetailsModal && (
        <EventDetailsModal event={event} onClose={() => setShowDetailsModal(false)} />
      )}
    </motion.div>
  );
};

export default EventCard;
