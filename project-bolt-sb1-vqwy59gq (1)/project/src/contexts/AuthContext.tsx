import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('mindbridge_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Check if user is approved (for therapists)
        if (userData.role === 'therapist' && !userData.isApproved) {
          localStorage.removeItem('mindbridge_user');
        } else {
          setUser(userData);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for demo accounts
      if (email === 'patient@demo.com' && password === 'demo123') {
        const mockUser: User = {
          id: 'patient-demo',
          email,
          role: 'patient',
          firstName: 'Demo',
          lastName: 'Patient',
          createdAt: new Date(),
          lastLogin: new Date(),
          isApproved: true
        };
        localStorage.setItem('mindbridge_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      if (email === 'therapist@demo.com' && password === 'demo123') {
        const mockUser: User = {
          id: 'therapist-demo',
          email,
          role: 'therapist',
          firstName: 'Dr. Demo',
          lastName: 'Therapist',
          createdAt: new Date(),
          lastLogin: new Date(),
          isApproved: true,
          licenseNumber: 'LIC123456',
          specializations: ['Depression', 'Anxiety', 'PTSD']
        };
        localStorage.setItem('mindbridge_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      // Check stored users
      const storedUsers = JSON.parse(localStorage.getItem('mindbridge_registered_users') || '[]');
      const foundUser = storedUsers.find((u: User) => u.email === email);
      
      if (foundUser) {
        if (foundUser.role === 'therapist' && !foundUser.isApproved) {
          throw new Error('Account pending approval');
        }
        
        foundUser.lastLogin = new Date();
        localStorage.setItem('mindbridge_user', JSON.stringify(foundUser));
        setUser(foundUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        role: userData.role!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        createdAt: new Date(),
        isApproved: userData.role === 'patient', // Patients auto-approved, therapists need approval
        licenseNumber: userData.licenseNumber,
        specializations: userData.specializations
      };

      // Store in registered users list
      const storedUsers = JSON.parse(localStorage.getItem('mindbridge_registered_users') || '[]');
      storedUsers.push(newUser);
      localStorage.setItem('mindbridge_registered_users', JSON.stringify(storedUsers));

      // If patient, auto-login. If therapist, don't login (pending approval)
      if (newUser.role === 'patient') {
        localStorage.setItem('mindbridge_user', JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('mindbridge_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};