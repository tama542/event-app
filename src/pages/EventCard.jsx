import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import RatingStars from "./RatingStars";
//import "./EventCard.css";

// Seat booking modal component with interactive seat selection remains unchanged
const SeatBookingModal = ({ onClose, onConfirm }) => {
  // Create a 5x5 grid of seats with an 80% chance of availability per seat.
  const initialSeats = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => ({
      id: `${row}-${col}`,
      available: Math.random() > 0.2,
    }))
  );

  const [seats] = useState(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAR, setShowAR] = useState(false);

  const handleSeatClick = (seat) => {
    if (!seat.available) {
      alert("This seat is not available.");
      return;
    }
    setSelectedSeat(seat);
  };

  const handleConfirm = () => {
    if (!selectedSeat) {
      alert("Please select a seat first.");
      return;
    }
    onConfirm(selectedSeat);
  };

  return (
    <div className="seat-modal">
      <div className="seat-modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Select Your Seat</h2>
        <div className="seat-grid">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {row.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${
                    seat.available ? "available" : "unavailable"
                  } ${
                    selectedSeat && selectedSeat.id === seat.id ? "selected" : ""
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
          <div className="seat-actions">
            <p>
              Selected Seat: <strong>{selectedSeat.id}</strong>
            </p>
            <button onClick={() => setShowAR(true)} className="btn">
              View 360° / AR Preview
            </button>
          </div>
        )}
        {showAR && selectedSeat && (
          <div className="ar-view">
            <button className="close-button" onClick={() => setShowAR(false)}>
              Close AR
            </button>
            <h3>360° View for Seat {selectedSeat.id}</h3>
            {/* Replace with AR/360 viewer integration as needed */}
            <img
              src={`https://via.placeholder.com/600x400?text=360+View+Seat+${selectedSeat.id}`}
              alt={`360 view of seat ${selectedSeat.id}`}
            />
          </div>
        )}
        <button onClick={handleConfirm} className="btn confirm-btn">
          Confirm Seat & Book
        </button>
      </div>
    </div>
  );
};

// Modal component for showing detailed event information
const EventDetailsModal = ({ event, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content details-modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <img src={event.image} alt={event.title} className="modal-image" />
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <div className="reviews">
          <span className="rating">{'⭐'.repeat(event.rating)}</span>
          <span>({event.reviews} reviews)</span>
        </div>
        <button onClick={onClose} className="btn">
          Close Details
        </button>
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const { title, description, date, image, rating, reviews } = event;

  const [timeLeft, setTimeLeft] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Update countdown timer until the event starts
  useEffect(() => {
    const eventDate = new Date(date);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = eventDate - now;

      if (diff <= 0) {
        setTimeLeft("Event Started!");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  // Initiate Mpesa STK Push payment after seat selection
  const handleBooking = async (selectedSeat) => {
    const amount = 100; // Example ticket price
    const phoneNumber = prompt(
      "Please enter your phone number (in format 2547XXXXXXXX):"
    );

    if (!phoneNumber) {
      alert("Phone number is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          phoneNumber,
          accountReference: `Ticket-${selectedSeat.id}`,
          transactionDesc: `Payment for event ticket, Seat ${selectedSeat.id}`,
        }),
      });

      const data = await response.json();
      console.log("STK Push initiated:", data);
      if (response.ok) {
        alert("Payment initiated. Please complete the payment on your phone.");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("There was an error processing your payment.");
    }
    // Close seat selection modal after booking attempt
    setShowSeatModal(false);
  };

  // Toggle favorite state
  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  // Toggle reviews display
  const toggleReviews = () => {
    setShowReviews((prev) => !prev);
  };

  // Style countdown text in red if the event starts soon or has started
  const getCountdownStyle = () => {
    if (timeLeft.startsWith("0d") || timeLeft === "Event Started!") {
      return { color: "red", fontWeight: "bold" };
    }
    return {};
  };

  // Share event using the Web Share API or fallback to clipboard copy
  const handleShare = async () => {
    const shareData = {
      title: `Event: ${title}`,
      text: description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert("Event shared successfully!");
      } catch (error) {
        console.error("Error sharing event:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard!");
    }
  };

  // Send event details via email using EmailJS
  const handleSendEmail = () => {
    const templateParams = {
      event_title: title,
      event_date: date,
      event_description: description,
      event_url: window.location.href,
    };

    emailjs
      .send("service_tmjac7k", "template_kaq5cud", templateParams, "KzIzKV1mwC04tH7Er")
      .then(
        (response) => {
          alert("Email sent successfully!");
        },
        (error) => {
          console.error("Failed to send email", error);
          alert("There was an error sending the email.");
        }
      );
  };

  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />
      <div className="event-card-content">
        <div className="top-header">
          <h3>{title}</h3>
          <button onClick={toggleFavorite} className="favorite-btn">
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
        <p>{description}</p>
        <p style={getCountdownStyle()}>
          <strong>Starts in:</strong> {timeLeft}
        </p>
        <div className="reviews">
          <span className="rating">{'⭐'.repeat(rating)}</span>
          <span>({reviews} reviews)</span>
          <button onClick={toggleReviews} className="toggle-reviews-btn">
            {showReviews ? "Hide Reviews" : "Show Reviews"}
          </button>
        </div>
        {showReviews && (
          <div className="review-details">
            <p>"Great event! I had an amazing time." - Mark</p>
            <p>"An unforgettable experience!" - Nancy</p>
          </div>
        )}
        <div className="action-buttons">
          <button onClick={() => setShowSeatModal(true)} className="btn">
            RSVP / Book Now
          </button>
          <button onClick={handleShare} className="btn share-btn">
            Share Event
          </button>
          <button onClick={handleSendEmail} className="btn email-btn">
            Send Email Invite
          </button>
          <button onClick={() => setShowDetailsModal(true)} className="btn details-btn">
            View Details
          </button>
        </div>
      </div>
      {showSeatModal && (
        <SeatBookingModal
          onClose={() => setShowSeatModal(false)}
          onConfirm={handleBooking}
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
