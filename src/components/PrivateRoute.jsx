// // src/components/PrivateRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-spinner" style={{ 
//         textAlign: 'center', 
//         padding: '2rem',
//         color: 'var(--text-color)'
//       }}>
//         Checking authentication...
//       </div>
//     );
//   }

//   console.log('PrivateRoute - User:', user); // Debug log

//   return user ? children : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ PrivateRoute - Auth state:', { user, loading });

  if (loading) {
    console.log('⏳ PrivateRoute - Still loading...');
    return (
      <div className="loading-spinner" style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: 'var(--text-color)'
      }}>
        Checking authentication...
      </div>
    );
  }

  console.log('🔐 PrivateRoute - Decision:', user ? 'ACCESS GRANTED' : 'ACCESS DENIED');

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;