
"use client";

import type { User } from 'firebase/auth';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for prototype
const ADMIN_EMAIL = 'admin@dashboard.com';
const ADMIN_PASSWORD = 'admin123'; // Placeholder password

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth state is checked
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for persisted auth state
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname === '/admin') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (email?: string, password?: string): Promise<boolean> => {
    // For this prototype, we use hardcoded credentials
    // In a real app, you'd integrate with an auth provider (e.g., Firebase Auth)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin');
      return true;
    }
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
