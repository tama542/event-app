// src/PaymentPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { event, amount, bookingReference } = state || {};
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if no event data
  if (!event) {
    navigate("/");
    return null;
  }

  const submitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount || event.price || 100,
          phoneNumber: phone,
          accountReference: bookingReference || `Event-${event.id}`,
          transactionDesc: `Event: ${event.title}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "STK Push failed");
      alert("STK Push initiated! Please check your phone to complete payment.");
      // Navigate to confirmation or home page
      navigate("/booking-confirmation", { 
        state: { 
          event, 
          phone,
          bookingReference: bookingReference || `Event-${event.id}`,
          amount: amount || event.price || 100
        } 
      });
    } catch (err) {
      console.error(err);
      alert("Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <img src="pic/image.png" className="mpesa-logo" alt="M-Pesa" />
        <h2>Complete Your Booking</h2>
        <div className="booking-details">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
          <p><strong>Amount:</strong> KES {amount || event.price || 100}</p>
          {bookingReference && (
            <p><strong>Reference:</strong> {bookingReference}</p>
          )}
        </div>
        
        <form onSubmit={submitPayment}>
          <label>
            M-Pesa Phone Number
            <input
              type="tel"
              placeholder="2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="254[0-9]{9}"
              title="Please enter a valid M-Pesa number starting with 254"
            />
          </label>
          <small>Enter your M-Pesa registered phone number (format: 2547XXXXXXXX)</small>
          
          <button type="submit" disabled={loading} className="pay-button">
            {loading ? "Processing…" : `Pay KES ${amount || event.price || 100}`}
          </button>
        </form>
        
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
          disabled={loading}
        >
          ← Back to Event
        </button>
      </div>
    </div>
  );
}