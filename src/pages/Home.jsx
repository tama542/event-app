// src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function Home() {
  // THEME TOGGLE
  const [dark, setDark] = useState(() => localStorage.getItem("tn-theme") === "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("tn-theme", dark ? "dark" : "light");
  }, [dark]);

  // LOAD DATA
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/events.json").then(r => r.json()),
      fetch("/data/testimonials.json").then(r => r.json())
    ])
      .then(([evs, tms]) => {
        setEvents(evs);
        setTestimonials(tms);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // FAVORITES
  const [favs, setFavs] = useState(() =>
    JSON.parse(localStorage.getItem("tn-favs") || "[]")
  );
  const toggleFav = useCallback(
    id => {
      const next = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
      setFavs(next);
      localStorage.setItem("tn-favs", JSON.stringify(next));
      toast(next.includes(id) ? "Added to favorites ❤️" : "Removed from favorites 💔");
    },
    [favs]
  );

  // SEARCH & FILTER
  const [query, setQuery] = useState("");
  const cats = ["All", ...new Set(events.map(e => e.category))];
  const [cat, setCat] = useState("All");
  const filtered = events.filter(
    e =>
      e.name.toLowerCase().includes(query.toLowerCase()) &&
      (cat === "All" || e.category === cat)
  );

  // MODAL
  const [modal, setModal] = useState(null);
  const openModal = ev => setModal(ev);
  const closeModal = () => setModal(null);

  // STATS ANIMATION
  const statRef = useRef();
  const [statsOn, setStatsOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsOn(true),
      { threshold: 0.4 }
    );
    if (statRef.current) obs.observe(statRef.current);
    return () => obs.disconnect();
  }, []);

  const Counter = ({ to, label, icon }) => {
    const [n, setN] = useState(0);
    useEffect(() => {
      if (!statsOn) return;
      let start = 0;
      const step = Math.ceil(to / 60);
      const id = setInterval(() => {
        start += step;
        setN(start >= to ? to : start);
        if (start >= to) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }, [statsOn, to]);
    return (
      <motion.div className="stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="icon">{icon}</span>
        <h3>{n.toLocaleString()}</h3>
        <p>{label}</p>
      </motion.div>
    );
  };

  if (loading) return <div className="loader">Loading…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            TN Events
          </motion.h1>
          <p>Discover & book concerts, festivals, conferences and art shows.</p>
          <Link to="/events" className="btn">Browse All Events</Link>
        </div>
        <Carousel autoPlay infiniteLoop showThumbs={false}>
          <div><img src="/pic/summer.jpg" alt="Concert" /></div>
          <div><img src="/pic/culture.jpg" alt="Festival" /></div>
          <div><img src="/pic/tech-expo.jpg" alt="Conference" /></div>
        </Carousel>
      </section>

      {/* STATS */}
      <section className="stats" ref={statRef}>
        <Counter to={events.length} label="Upcoming Events" icon="🎤" />
        <Counter to={favs.length} label="Your Favorites" icon="⭐" />
        <Counter to={12000} label="Tickets Sold" icon="🎟️" />
      </section>

      {/* FILTERS */}
      <section className="filters">
        <input
          type="search"
          placeholder="Search events…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={cat} onChange={e => setCat(e.target.value)}>
          {cats.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      {/* EVENTS GRID */}
      <section className="events-grid">
        {filtered.map(e => (
          <motion.div key={e.id} className="event-card" whileHover={{ scale: 1.05 }}>
            <div className="img-wrap" onClick={() => openModal(e)}>
              <img src={e.img} alt={e.name} />
              <button
                className={favs.includes(e.id) ? "fav-btn active" : "fav-btn"}
                onClick={x => {
                  x.stopPropagation();
                  toggleFav(e.id);
                }}
                aria-label="Toggle favorite"
              >
                ❤
              </button>
            </div>
            <div className="info">
              <h3>{e.name}</h3>
              <p className="meta">
                {new Date(e.date).toLocaleDateString()} · {e.category}
              </p>
              <p className="price">{e.price > 0 ? `$${e.price}` : "Free"}</p>
              <Link to={`/events/${e.id}`} className="btn small">Details</Link>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="no-results">No events match your search.</p>}
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What People Say</h2>
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
          {testimonials.map(t => (
            <div key={t.id} className="tm-card">
              <p>“{t.text}”</p>
              <p className="author">— {t.author}</p>
            </div>
          ))}
        </Carousel>
      </section>

      {/* ABOUT */}
      <section className="about">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          About TN Events
        </motion.h2>
        <p>
          TN Events is your trusted platform for discovering and booking the best concerts,
          festivals, conferences, and art shows. We connect passionate audiences with
          unforgettable experiences, making event discovery simple, exciting, and reliable.
        </p>
        <Link to="/about" className="btn">Learn More</Link>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-grid">
          <div className="cat-card">🎶 Concerts</div>
          <div className="cat-card">🎨 Art & Culture</div>
          <div className="cat-card">💻 Tech & Business</div>
          <div className="cat-card">🎉 Festivals</div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners">
        <h2>Our Partners</h2>
        <div className="partner-logos">
          <img src="/logos/partner1.png" alt="Partner 1" />
          <img src="/logos/partner2.png" alt="Partner 2" />
          <img src="/logos/partner3.png" alt="Partner 3" />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter and never miss an event.</p>
        <form
          className="newsletter-form"
          onSubmit={e => {
            e.preventDefault();
            toast("Subscribed! 🎉");
          }}
        >
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn">Subscribe</button>
        </form>
      </section>

      {/* CTA FOOTER */}
      <section className="cta-footer">
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Ready to Experience Something Amazing?
        </motion.h2>
        <Link to="/events" className="btn large">Book Your Next Event</Link>
      </section>

      {/* MODAL PREVIEW */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <motion.div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button className="modal-close" onClick={closeModal}>✕</button>
            <img src={modal.img} alt={modal.name} />
            <h3>{modal.name}</h3>
            <p className="meta">
              {new Date(modal.date).toLocaleString()} · {modal.category}
            </p>
            <p>{modal.description}</p>
            <div className="map-container">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(modal.location)}&output=embed`}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Event location map"
              ></iframe>
            </div>
            <Link to={`/events/${modal.id}`} className="btn" onClick={closeModal}>
              Book Tickets
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
