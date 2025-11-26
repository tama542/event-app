// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Attempt to load user from localStorage on initial load
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error('Error parsing stored user:', error);
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(true);

//   // Check authentication status on app start
//   useEffect(() => {
//     const checkAuth = () => {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//         } catch (error) {
//           console.error('Error parsing user from localStorage:', error);
//           localStorage.removeItem('user');
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Sync authentication state with localStorage
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//     }
//   }, [user]);

//   // Improved login function
//   const login = (username, password) => {
//     // Simulate API call delay
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         try {
//           // Basic validation
//           if (!username || !password) {
//             reject(new Error('Username and password are required'));
//             return;
//           }

//           // In a real app, validate credentials through your backend
//           const newUser =
//             username.trim().toLowerCase() === "admin"
//               ? { 
//                   id: 1, 
//                   name: "Admin User", 
//                   email: `${username}@example.com`,
//                   role: "admin", 
//                   username 
//                 }
//               : { 
//                   id: Date.now(), 
//                   name: username, 
//                   email: `${username}@example.com`,
//                   role: "user", 
//                   username 
//                 };
          
//           setUser(newUser);
//           console.log('User logged in:', newUser); // Debug log
//           resolve(newUser);
//         } catch (error) {
//           reject(error);
//         }
//       }, 500);
//     });
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     console.log('User logged out'); // Debug log
//   };

//   // Check if user is authenticated
//   const isAuthenticated = !!user;

//   // Check if user is admin
//   const isAdmin = user?.role === 'admin';

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated,
//     isAdmin
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('🔄 AuthContext - Loading user from localStorage:', storedUser);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('❌ Error parsing stored user:', error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      console.log('🔍 AuthContext - Initial auth check, storedUser:', storedUser);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ AuthContext - Setting user from localStorage:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('❌ Error parsing user from localStorage:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Sync authentication state with localStorage
  useEffect(() => {
    console.log('📝 AuthContext - User state changed:', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('💾 AuthContext - User saved to localStorage');
    } else {
      localStorage.removeItem('user');
      console.log('🗑️ AuthContext - User removed from localStorage');
    }
  }, [user]);

  const login = (username, password) => {
    console.log('🔐 AuthContext - Login attempt:', username);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!username || !password) {
            reject(new Error('Username and password are required'));
            return;
          }

          const newUser =
            username.trim().toLowerCase() === "admin"
              ? { 
                  id: 1, 
                  name: "Admin User", 
                  email: `${username}@example.com`,
                  role: "admin", 
                  username 
                }
              : { 
                  id: Date.now(), 
                  name: username, 
                  email: `${username}@example.com`,
                  role: "user", 
                  username 
                };
          
          console.log('✅ AuthContext - Login successful, setting user:', newUser);
          setUser(newUser);
          resolve(newUser);
        } catch (error) {
          console.error('❌ AuthContext - Login error:', error);
          reject(error);
        }
      }, 500);
    });
  };

  const logout = () => {
    console.log('🚪 AuthContext - Logging out user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  console.log('📊 AuthContext - Current state:', { 
    user, 
    loading, 
    isAuthenticated, 
    isAdmin 
  });

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};