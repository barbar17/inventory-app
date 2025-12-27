'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [users, setUsers] = useState([]); // Daftar semua users
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('user');
    
    if (!token && pathname !== '/login') {
      setUser(null);
      router.replace('/login');
      return;
    }

  }, [pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Default users
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'user1', password: 'pass1', role: 'user' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addUser = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: Date.now() }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUser = (id, updatedUser) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...updatedUser } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (user && user.id === id) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (user && user.id === id) {
      logout();
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, updateUser, deleteUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};