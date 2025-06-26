// src/PaymentPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
//import mpesaLogo from "./mpesa.png"; // download official PNG

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeat, amount } = state || {};
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // guard: redirect home if no booking info
  if (!event || !selectedSeat) {
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
          amount,
          phoneNumber: phone,
          accountReference: `Ticket-${selectedSeat.id}`,
          transactionDesc: `Event: ${event.title}, Seat ${selectedSeat.id}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "STK Push failed");
      alert("STK Push initiated! Please approve on your phone.");
      navigate("/");  // or to a “Thank you” page
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
        <h2>Pay for {event.title}</h2>
        <p>Seat: <strong>{selectedSeat.id}</strong></p>
        <p>Amount: <strong>KES {amount}</strong></p>
        <form onSubmit={submitPayment}>
          <label>
            Phone Number
            <input
              type="tel"
              placeholder="2547XXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Processing…" : `Pay KES ${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
}
