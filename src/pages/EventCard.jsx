// // import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";

// // function EventList() {
// //   const [events, setEvents] = useState([]);
// //   const [filter, setFilter] = useState("All");
// //   const [sortBy, setSortBy] = useState("date");

// //   useEffect(() => {
// //     // Preloaded demo events – add more demo data as needed
// //     const sampleEvents = [
// //       { 
// //         id: 1, 
// //         title: "Summer Music Festival", 
// //         category: "Music", 
// //         date: "2025-06-20", 
// //         image: "https://source.unsplash.com/400x300/?festival",
// //         countdown: "02:15:10"
// //       },
// //       { 
// //         id: 2, 
// //         title: "Art Exhibition", 
// //         category: "Art", 
// //         date: "2025-07-15", 
// //         image: "https://source.unsplash.com/400x300/?art",
// //         countdown: "05:12:45"
// //       },
// //       { 
// //         id: 3, 
// //         title: "Tech Conference 2025", 
// //         category: "Tech", 
// //         date: "2025-08-10", 
// //         image: "https://source.unsplash.com/400x300/?technology",
// //         countdown: "00:45:00"
// //       }
// //     ];
// //     setEvents(sampleEvents);
// //   }, []);

// //   const filteredEvents = filter === "All" ? events : events.filter(e => e.category === filter);
// //   // For simplicity, sorting is done on date (expand as needed)
// //   const sortedEvents = [...filteredEvents].sort((a,b) => a.date.localeCompare(b.date));

// //   return (
// //     <div>
// //       <h2>Upcoming Events</h2>
// //       <div style={{ marginBottom: '1rem' }}>
// //         <label>Filter by Category: </label>
// //         <select onChange={(e) => setFilter(e.target.value)}>
// //           <option value="All">All Categories</option>
// //           <option value="Music">Music</option>
// //           <option value="Tech">Tech</option>
// //           <option value="Art">Art</option>
// //         </select>
// //         <label style={{ marginLeft: '1rem' }}>Sort by: </label>
// //         <select onChange={(e) => setSortBy(e.target.value)}>
// //           <option value="date">Date</option>
// //           {/* Add more sort options like popularity or price if available */}
// //         </select>
// //       </div>
// //       <div className="event-grid">
// //         {sortedEvents.map(event => (
// //           <div key={event.id} className="event-card">
// //             <img src={event.image} alt={event.title} />
// //             <div className="event-content">
// //               <h3>{event.title}</h3>
// //               <p>Category: {event.category}</p>
// //               <p>Date: {event.date}</p>
// //               <div className="countdown">{event.countdown}</div>
// //               <Link to={`/events/${event.id}`}>View Details</Link>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default EventList;


// // src/components/EventCard.jsx


// // src/components/EventCard.jsx


// // src/components/EventCard.jsx
// import React, { useState, useEffect } from "react";
// import emailjs from '@emailjs/browser';

// const EventCard = ({ event }) => {
//   const { title, description, date, image, rating, reviews } = event;
  
//   const [timeLeft, setTimeLeft] = useState("");
//   const [isBooked, setIsBooked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showReviews, setShowReviews] = useState(false);

//   // Update countdown timer
//   useEffect(() => {
//     const eventDate = new Date(date);
//     const timer = setInterval(() => {
//       const now = new Date();
//       const diff = eventDate - now;

//       if (diff <= 0) {
//         setTimeLeft("Event Started!");
//         clearInterval(timer);
//       } else {
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);
//         setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [date]);

//   // Handler for RSVP / Booking button
//   const handleBooking = () => {
//     setIsBooked((prev) => !prev);
//   };

//   // Handler for favorite button
//   const toggleFavorite = () => {
//     setIsFavorite((prev) => !prev);
//   };

//   // Toggle reviews display
//   const toggleReviews = () => {
//     setShowReviews((prev) => !prev);
//   };

//   // Determine countdown style: highlight if event is less than a day away
//   const getCountdownStyle = () => {
//     // If timeLeft is formatted as "0d ..." or event started, change color
//     if (timeLeft.startsWith("0d") || timeLeft === "Event Started!") {
//       return { color: "red", fontWeight: "bold" };
//     }
//     return {};
//   };

//   // Share functionality using Web Share API with fallback to copying URL
//   const handleShare = async () => {
//     const shareData = {
//       title: `Event: ${title}`,
//       text: description,
//       url: window.location.href,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//         alert("Event shared successfully!");
//       } catch (error) {
//         console.error("Error sharing event:", error);
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Event URL copied to clipboard!");
//     }
//   };

//   // Email sending functionality using EmailJS
//   const handleSendEmail = () => {
//     const templateParams = {
//       event_title: title,
//       event_date: date,
//       event_description: description,
//       event_url: window.location.href,
//     };

//     // Replace the following with your actual EmailJS service ID, template ID, and public key:
//     emailjs.send("service_tmjac7k", "template_kaq5cud", templateParams, "KzIzKV1mwC04tH7Er")
//       .then((response) => {
//         alert("Email sent successfully!");
//       }, (error) => {
//         console.error("Failed to send email", error);
//         alert("There was an error sending the email.");
//       });
//   };

//   return (
//     <div className="event-card">
//       <img src={image} alt={title} />
//       <div className="event-card-content">
//         <div className="top-header">
//           <h3>{title}</h3>
//           <button onClick={toggleFavorite} className="favorite-btn">
//             {isFavorite ? "❤️" : "🤍"}
//           </button>
//         </div>
//         <p>{description}</p>
//         <p style={getCountdownStyle()}>
//           <strong>Starts in:</strong> {timeLeft}
//         </p>
//         <div className="reviews">
//           <span className="rating">{'⭐'.repeat(rating)}</span>
//           <span>({reviews} reviews)</span>
//           <button onClick={toggleReviews} className="toggle-reviews-btn">
//             {showReviews ? "Hide Reviews" : "Show Reviews"}
//           </button>
//         </div>
//         {showReviews && (
//           <div className="review-details">
//             <p>
//               {/* Placeholder text - replace with dynamic reviews if available */}
//               "Great event! I had an amazing time." - Jane Doe
//             </p>
//             <p>"An unforgettable experience!" - John Smith</p>
//           </div>
//         )}
//         <div className="action-buttons">
//           <button onClick={handleBooking} className="btn">
//             {isBooked ? "Cancel Booking" : "RSVP / Book Now"}
//           </button>
//           <button onClick={handleShare} className="btn share-btn">
//             Share Event
//           </button>
//           <button onClick={handleSendEmail} className="btn email-btn">
//             Send Email Invite
//           </button>
//         </div>
//         {isBooked && (
//           <p className="booking-confirmation">
//             Your booking is confirmed! A confirmation email will be sent shortly.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventCard;


import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
//import "./EventCard.css";

// Seat booking modal component with interactive seat selection
const SeatBookingModal = ({ onClose, onConfirm }) => {
  // Create a 5x5 grid of seats. Adjust grid dimensions or seat availability as needed.
  const initialSeats = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => ({
      id: `${row}-${col}`,
      available: Math.random() > 0.2, // 80% chance available
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
            {/* In a real app, integrate an AR/360 viewer library here */}
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

const EventCard = ({ event }) => {
  const { title, description, date, image, rating, reviews } = event;

  const [timeLeft, setTimeLeft] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);

  // Update countdown timer until event starts
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

  // Initiate Mpesa STK Push after seat selection
  const handleBooking = async (selectedSeat) => {
    const amount = 100; // e.g., ticket price
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
    // Close the seat selection modal after booking attempt
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

  // Style countdown text in red if event starts soon or has started
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
        </div>
      </div>
      {showSeatModal && (
        <SeatBookingModal
          onClose={() => setShowSeatModal(false)}
          onConfirm={handleBooking}
        />
      )}
    </div>
  );
};

export default EventCard;


