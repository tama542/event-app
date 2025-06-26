// src/pages/Home.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { Link } from "react-router-dom";
//import "./Home.css";

export default function Home() {
  // THEME TOGGLE
  const [dark, setDark] = useState(
    () => localStorage.getItem("tn-theme") === "dark"
  );
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("tn-theme", dark ? "dark" : "light");
  }, [dark]);

  // LOAD DATA FROM STATIC JSON
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

  // FAVORITES (localStorage)
  const [favs, setFavs] = useState(() =>
    JSON.parse(localStorage.getItem("tn-favs") || "[]")
  );
  const toggleFav = useCallback(
    id => {
      const next = favs.includes(id)
        ? favs.filter(x => x !== id)
        : [...favs, id];
      setFavs(next);
      localStorage.setItem("tn-favs", JSON.stringify(next));
    },
    [favs]
  );

  // SEARCH & CATEGORY FILTER
  const [query, setQuery] = useState("");
  const cats = ["All", ...new Set(events.map(e => e.category))];
  const [cat, setCat] = useState("All");
  const filtered = events.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) &&
    (cat === "All" || e.category === cat)
  );

  // MODAL PREVIEW
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

  const Counter = ({ to, label }) => {
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
      <div className="stat">
        <h3>{n.toLocaleString()}</h3>
        <p>{label}</p>
      </div>
    );
  };

  if (loading) return <div className="loader">Loading…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <button
        className="theme-toggle"
        onClick={() => setDark(d => !d)}
        aria-label="Toggle theme"
      >
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>TN events</h1>
          <p>
            Discover & book concerts, festivals, conferences and art shows in
            seconds.
          </p>
          <Link to="/events" className="btn">
            Browse All Events
          </Link>
        </div>
        <div className="hero-img">
          <img src="/images/hero.jpg" alt="Crowd at concert" />
        </div>
      </section>

      {/* STATS */}
      <section className="stats" ref={statRef}>
        <Counter to={events.length} label="Upcoming Events" />
        <Counter to={favs.length} label="Your Favorites" />
        <Counter to={12000} label="Tickets Sold" />
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
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {/* EVENTS GRID */}
      <section className="events-grid">
        {filtered.map(e => (
          <div key={e.id} className="event-card">
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
              <p className="price">
                {e.price > 0 ? `$${e.price}` : "Free"}
              </p>
              <Link to={`/events/${e.id}`} className="btn small">
                Details
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No events match your search.</p>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What People Say</h2>
        <div className="tm-wrap">
          {testimonials.map(t => (
            <div key={t.id} className="tm-card">
              <p>“{t.text}”</p>
              <p className="author">— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL PREVIEW */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <img src={modal.img} alt={modal.name} />
            <h3>{modal.name}</h3>
            <p className="meta">
              {new Date(modal.date).toLocaleString()} · {modal.category}
            </p>
            <p>{modal.description}</p>
            <div className="map-placeholder">[ Map preview here ]</div>
            <Link
              to={`/events/${modal.id}`}
              className="btn"
              onClick={closeModal}
            >
              Book Tickets
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
