import React, { useState } from 'react';

function TicketBooking({ eventTitle }) {
  const [quantity, setQuantity] = useState(1);
  const [seatType, setSeatType] = useState("Standard");
  const [message, setMessage] = useState("");

  const handleBooking = () => {
    // Placeholder for dynamic ticket booking logic
    setMessage(`Booked ${quantity} ${seatType} ticket(s) for ${eventTitle}`);
  };

  return (
    <div className="ticket-booking">
      <h3>Book Tickets</h3>
      <label>Seat Type:</label>
      <select value={seatType} onChange={(e) => setSeatType(e.target.value)}>
        <option value="Standard">Standard</option>
        <option value="VIP">VIP</option>
      </select>
      <label>Quantity:</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleBooking}>Book Now</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TicketBooking;
