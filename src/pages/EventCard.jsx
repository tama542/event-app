import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingStars from "./RatingStars";

// Seat-booking modal (unchanged except onConfirm → navigate)
const SeatBookingModal = ({ onClose, onConfirm }) => {
  // 5×5 grid with 80% availability
  const initialSeats = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => ({
      id: `${r}-${c}`,
      available: Math.random() > 0.2,
    }))
  );

  const [seats]        = useState(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAR, setShowAR]             = useState(false);

  const handleSeatClick = (seat) => {
    if (!seat.available) return alert("This seat is not available.");
    setSelectedSeat(seat);
  };

  return (
    <div className="seat-modal">
      <div className="seat-modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Select Your Seat</h2>

        <div className="seat-grid">
          {seats.map((row, ri) => (
            <div key={ri} className="seat-row">
              {row.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${
                    seat.available ? "available" : "unavailable"
                  } ${
                    selectedSeat?.id === seat.id ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedSeat && (
          <>
            <p>
              Selected: <strong>{selectedSeat.id}</strong>
            </p>
            <button
              onClick={() => setShowAR(true)}
              className="btn"
            >
              View 360° / AR Preview
            </button>
          </>
        )}

        {showAR && (
          <div className="ar-view">
            <button
              className="close-button"
              onClick={() => setShowAR(false)}
            >
              Close AR
            </button>
            <h3>360° View Seat {selectedSeat.id}</h3>
            <img
              src={`https://via.placeholder.com/600x400?text=360+Seat+${selectedSeat.id}`}
              alt={`360 view ${selectedSeat.id}`}
            />
          </div>
        )}

        <button
          onClick={() => {
            if (!selectedSeat) {
              alert("Please select a seat first.");
              return;
            }
            onConfirm(selectedSeat);
          }}
          className="btn confirm-btn"
        >
          Confirm & Book
        </button>
      </div>
    </div>
  );
};

// Event details modal (unchanged)
const EventDetailsModal = ({ event, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content details-modal">
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <img
        src={event.image}
        alt={event.title}
        className="modal-image"
      />
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <div className="reviews">
        <span className="rating">
          {"⭐".repeat(event.rating)}
        </span>
        <span>({event.reviews} reviews)</span>
      </div>
      <button onClick={onClose} className="btn">
        Close
      </button>
    </div>
  </div>
);

const EventCard = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  // TODO: fetch your event by `id` or grab from context/store
  const event = {/* fetch based on id */}
  // For demo we'll stub:
  // const event = EVENTS.find(e => e.id === id);

  const {
    title,
    description,
    date,
    image,
    rating,
    reviews,
  } = event;

  const [timeLeft, setTimeLeft]       = useState("");
  const [isFavorite, setIsFavorite]   = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showSeatModal, setShowSeatModal]     = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Countdown
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

  // On seat confirm, go to /payment
  const handleSeatConfirm = (selectedSeat) => {
    const amount = 100; // your ticket price
    setShowSeatModal(false);

    navigate("/payment", {
      state: { event, selectedSeat, amount },
    });
  };

  const toggleFavorite = () => setIsFavorite((f) => !f);
  const toggleReviews  = () => setShowReviews((r) => !r);

  const shareEvent = async () => {
    const shareData = {
      title: `Event: ${title}`,
      text: description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert("Shared!");
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied");
    }
  };

  const sendEmailInvite = () => {
    // keep your emailjs logic here
  };

  const countdownStyle =
    timeLeft.startsWith("0d") || timeLeft === "Event Started!"
      ? { color: "red", fontWeight: "bold" }
      : {};

  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />

      <div className="event-card-content">
        <div className="top-header">
          <h3>{title}</h3>
          <button
            onClick={toggleFavorite}
            className="favorite-btn"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p>{description}</p>
        <p style={countdownStyle}>
          <strong>Starts in:</strong> {timeLeft}
        </p>

        <div className="reviews">
          <span className="rating">
            {"⭐".repeat(rating)}
          </span>
          <span>({reviews} reviews)</span>
          <button
            onClick={toggleReviews}
            className="toggle-reviews-btn"
          >
            {showReviews ? "Hide" : "Show"} Reviews
          </button>
        </div>

        {showReviews && (
          <div className="review-details">
            <p>"Great event!" - Mark</p>
            <p>"An unforgettable time!" - Nancy</p>
          </div>
        )}

        <div className="action-buttons">
          <button
            onClick={() => setShowSeatModal(true)}
            className="btn"
          >
            RSVP / Book Now
          </button>
          <button
            onClick={shareEvent}
            className="btn share-btn"
          >
            Share
          </button>
          <button
            onClick={sendEmailInvite}
            className="btn email-btn"
          >
            Email Invite
          </button>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="btn details-btn"
          >
            Details
          </button>
        </div>
      </div>

      {showSeatModal && (
        <SeatBookingModal
          onClose={() => setShowSeatModal(false)}
          onConfirm={handleSeatConfirm}
        />
      )}
      {showDetailsModal && (
        <EventDetailsModal
          event={event}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
