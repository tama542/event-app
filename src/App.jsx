// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute   from "./components/AdminRoute";

import Home          from "./pages/Home";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import EventSection  from "./pages/EventSection";
import EventCard     from "./pages/EventCard";
import ContactForm   from "./pages/ContactForm";
import Dashboard     from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs       from "./pages/About";
import RatingStars   from "./pages/RatingStars";
import PaymentPage   from "./pages/PaymentPage";

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <div className="content">
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User-only */}
          <Route
            path="/"
            element={<PrivateRoute><Home /></PrivateRoute>}
          />
          <Route
            path="/events"
            element={<PrivateRoute><EventSection /></PrivateRoute>}
          />
          <Route
            path="/events/:id"
            element={<PrivateRoute><EventCard /></PrivateRoute>}
          />
          <Route
            path="/contact"
            element={<PrivateRoute><ContactForm /></PrivateRoute>}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/about"
            element={<PrivateRoute><AboutUs /></PrivateRoute>}
          />
          <Route
            path="/ratingstars"
            element={<PrivateRoute><RatingStars /></PrivateRoute>}
          />
          <Route
            path="/payment"
            element={<PrivateRoute><PaymentPage /></PrivateRoute>}
          />

          {/* Admin-only */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
