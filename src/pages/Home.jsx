// import React from 'react';
// import { Link } from 'react-router-dom';

// function Home() {
//   return (
//     <div className="home page-enter page-enter-active">
//       <h1>Welcome to TN events</h1>
//       <p>
//         Discover, explore, and book tickets for the best events in town. Enjoy concerts,
//         festivals, tech conferences, art exhibitions, and more!
//       </p>
//       <img 
//         src="pic\pic1.jpg" 
//         alt="Concert Crowd" 
//         style={{ margin: '2rem 0', borderRadius: '8px', width: '100%', height: '500px' }} 
//       />
//       <Link to="/events" className="explore-btn">Explore Events</Link>
//     </div>
//   );
// }

// export default Home;


// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Optional: import a carousel library (e.g., react-slick) if desired
// import Slider from "react-slick";

function Home() {
  // For demonstration, here's a simple testimonial slider state
  const testimonials = [
    {
      id: 1,
      text: "TN events completely transformed my weekends! The experience was unforgettable.",
      author: "Tama Nzavi"
    },
    {
      id: 2,
      text: "I love how easy it is to discover events in town. Highly recommended!",
      author: "Elizabeth mwarey"
    },
    {
      id: 3,
      text: "Booking tickets has never been smoother. TN events is my go-to app.",
      author: "James Macharia"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Cycle through testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="home page-enter page-enter-active">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to TN events</h1>
          <p>
            Discover, explore, and book tickets for the best events in town.
            Enjoy concerts, festivals, tech conferences, art exhibitions, and more!
          </p>
          <Link to="/events" className="explore-btn">
            Explore Events
          </Link>
        </div>
        <div className="hero-img">
          <img 
            src="pic/pic1.jpg" 
            alt="Concert Crowd" 
          />
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="features">
        <h2>Why Choose TN events?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="icon fa fa-calendar"></i>
            <h3>Easy Booking</h3>
            <p>Book tickets in seconds with our streamlined process.</p>
          </div>
          <div className="feature-card">
            <i className="icon fa fa-mobile-alt"></i>
            <h3>Mobile Friendly</h3>
            <p>Enjoy a seamless experience on any device.</p>
          </div>
          <div className="feature-card">
            <i className="icon fa fa-star"></i>
            <h3>Top Rated Events</h3>
            <p>We only feature the best and most memorable events.</p>
          </div>
        </div>
      </section>

      {/* Testimonials / Interactive Carousel */}
      <section className="testimonials">
        <h2>What Our Users Are Saying</h2>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "{testimonials[currentTestimonial].text}"
          </p>
          <p className="testimonial-author">
            - {testimonials[currentTestimonial].author}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
