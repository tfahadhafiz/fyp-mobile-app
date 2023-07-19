import React, { createContext, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Define the authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Define the login function
  const login = (userData) => {
    setUser(userData);
  };

  // Define the logout function
  const logout = () => {
    setUser(null);
  };

  // Render the authentication provider component
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
