import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventSection from "./pages/EventSection";
import EventCard from "./pages/EventCard";
import ContactForm from "./pages/ContactForm";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import AboutUs from "./pages/About";
import RatingStars from "./pages/RatingStars";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for Users */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventSection />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <PrivateRoute>
                <EventCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <ContactForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
            <Route
            path="/about"
            element={
              <PrivateRoute>
                <AboutUs />
              </PrivateRoute>
            }
          />
            <Route
            path="/ratingstars"
            element={
              <PrivateRoute>
                <RatingStars />
              </PrivateRoute>
            }
          />

          {/* Protected Route for Admins */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
