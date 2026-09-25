import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cb_staff_user');
    return saved ? JSON.parse(saved) : {
      name: 'Varun (Admin)',
      role: 'manager',
      email: 'varun.manager@campusbite.com'
    };
  });

  const login = (role, email = '') => {
    const roleNames = {
      cashier: 'Cashier Staff',
      kitchen: 'Kitchen Head Chef',
      beverage: 'Juice Bar Specialist',
      counter: 'Order Handover Staff',
      manager: 'Store Manager (Varun)'
    };
    const newUser = {
      role,
      name: roleNames[role] || 'Staff Member',
      email: email || `${role}@campusbite.com`,
      token: `jwt_token_${role}_mock`
    };
    setUser(newUser);
    localStorage.setItem('cb_staff_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cb_staff_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
