import React from "react";
//import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1> Welcome to TN Events – Your Gateway to Unforgettable Experiences! </h1>
        <p>Bringing events to life, one ticket at a time.</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2> Who We Are</h2>
          <p>
            TN Events is your go-to event and ticketing platform, designed to connect
            you with amazing experiences. Whether it’s concerts, conferences, festivals, or live shows, we make booking seamless
            and stress-free.
          </p>

          <h2> Our Mission</h2>
          <p>
            Our mission is to simplify ticket booking, enhance event discovery, and
            create memorable experiences for audiences and organizers alike. We blend innovation with convenience to ensure
            you never miss out on the events that matter most to you.
            
          </p>

          <h2> Why Choose Us?</h2>
          <ul>
            <li> Easy & Secure Ticket Booking</li>
            <li> Personalized Event Recommendations</li>
            <li> Real-Time Seat Selection & AR Venue Views</li>
            <li> Instant Notifications & Exclusive Deals</li>
          </ul>
        </div>

        {/* <div className="about-image">
          <img src="111" alt="About TN Events" />
        </div> */}
      </div>

      <div className="about-cta">
        <h2>🎟️ Ready to Experience the Best Events?</h2>
        <p>Join thousands of event lovers and explore the most exciting happenings around you.</p>
        <button>Discover Events</button>
      </div>
    </div>
  );
}

export default AboutUs;
