// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Attempt to load user from localStorage on initial load
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync authentication state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Simulated login function
  // If the username is "admin" (case insensitive), assign an admin role.
  const login = (username, password) => {
    // In a real app, validate credentials through your backend.
    const newUser =
      username.trim().toLowerCase() === "admin"
        ? { id: 1, name: "Admin User", role: "admin", username }
        : { id: Date.now(), name: username, role: "user", username };
    setUser(newUser);
    return newUser;
  };

  // Simulated logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

