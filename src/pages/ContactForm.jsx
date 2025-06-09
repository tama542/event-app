// src/components/ContactForm.jsx
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticketExperience: "",
    eventStyle: "",
    message: ""
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the form field state on change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send email using EmailJS when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      ticket_experience: formData.ticketExperience,
      event_style: formData.eventStyle,
      message: formData.message
    };

    // Replace these with your actual EmailJS service ID, template ID, and public key.
    emailjs
      .send(
        "service_tmjac7k", 
        "template_kaq5cud", 
        templateParams, 
        "KzIzKV1mwC04tH7Er"
      )
      .then(
        (response) => {
          setFeedback("Thank you for your feedback!");
          setFormData({
            name: "",
            email: "",
            ticketExperience: "",
            eventStyle: "",
            message: ""
          });
          setLoading(false);
        },
        (err) => {
          setFeedback("Something went wrong. Please try again.");
          setLoading(false);
        }
      );
  };

  return (
    <div className="contact-form-container">
      <h2>Feedback &amp; Contact</h2>
      <p>
        Please share your thoughts on your ticketing experience and the event style so we can continuously improve our services.
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Your Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketExperience">Ticketing Experience</label>
          <textarea
            id="ticketExperience"
            name="ticketExperience"
            placeholder="How was your ticket buying experience?"
            value={formData.ticketExperience}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="eventStyle">Event Style Feedback</label>
          <textarea
            id="eventStyle"
            name="eventStyle"
            placeholder="How did you find the event style or ambience?"
            value={formData.eventStyle}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="message">Additional Comments</label>
          <textarea
            id="message"
            name="message"
            placeholder="Any other suggestions or feedback?"
            value={formData.message}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Feedback"}
        </button>
        {feedback && <p className="feedback-msg">{feedback}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
