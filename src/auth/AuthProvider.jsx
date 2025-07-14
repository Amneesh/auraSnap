import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged , signOut } from 'firebase/auth';
import { auth } from './firebase';  // adjust path if needed

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
const logout = () => {
  localStorage.clear();

    return signOut(auth);

  };
  const isAuthenticated = !!currentUser;

  if (loading) {
    return <div>Loading...</div>;  // or your loading spinner component
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated , logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
