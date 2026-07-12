import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (token) {
        // 1 hour = 3600000 ms
        inactivityTimer = setTimeout(() => {
          console.log('Inactivity timeout reached. Logging out...');
          logout();
          window.location.reload(); // Refresh to trigger auth check
        }, 3600000);
      }
    };

    // Events to track activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    if (token) {
      activityEvents.forEach(event => document.addEventListener(event, resetTimer));
      resetTimer();
    }

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          const fetchedUser = data.data.user;
          setUser(fetchedUser);
          
          // Sync language from user preferences if available and not already set in session
          if (fetchedUser.preferredLanguage && !localStorage.getItem('preferredLanguage')) {
            setLanguage(fetchedUser.preferredLanguage);
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const loggedInUser = data.data.user;
        setUser(loggedInUser);
        
        // Apply user's language preference immediately after login
        if (loggedInUser.preferredLanguage) {
          localStorage.setItem('preferredLanguage', loggedInUser.preferredLanguage);
          setLanguage(loggedInUser.preferredLanguage);
        }
        
        return { success: true };
      } else {
        // Handle validation errors array if it exists
        const errorMsg = data.errors 
          ? data.errors.map(err => err.message).join(', ') 
          : data.message || 'Login failed';
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Login error details:', error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  // Step 1 of admin login: verify credentials, triggers an emailed OTP.
  // Does not store a token — the session only starts once verifyAdminOtp
  // succeeds.
  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.success) {
        return { success: true, otpRequired: true };
      }
      const errorMsg = data.errors
        ? data.errors.map(err => err.message).join(', ')
        : data.message || 'Login failed';
      return { success: false, message: errorMsg };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  // Step 2 of admin login: verify the emailed OTP and actually establish
  // the session.
  const verifyAdminOtp = async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.data.user);
        return { success: true };
      }
      const errorMsg = data.errors
        ? data.errors.map(err => err.message).join(', ')
        : data.message || 'Verification failed';
      return { success: false, message: errorMsg };
    } catch (error) {
      console.error('Admin OTP verify error:', error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  const signup = async (name, email, password, gender) => {
    try {
      console.log('Attempting signup for:', email);
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, gender })
      });

      const data = await response.json();
      console.log('Signup response:', data);
      if (data.success) {
        // Don't set token or user here, let them login manually
        return { success: true };
      } else {
        const errorMsg = data.errors 
          ? data.errors.map(err => err.message).join(', ') 
          : data.message || 'Signup failed';
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Signup error details:', error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  const socialLogin = async (userData) => {
    try {
      console.log('Attempting social login:', userData);
      const response = await fetch(`${API_URL}/api/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const loggedInUser = data.data.user;
        setUser(loggedInUser);

        // Apply language preference
        if (loggedInUser.preferredLanguage) {
          localStorage.setItem('preferredLanguage', loggedInUser.preferredLanguage);
          setLanguage(loggedInUser.preferredLanguage);
        }

        return { success: true };
      } else {
        return { success: false, message: data.message || 'Social login failed' };
      }
    } catch (error) {
      console.error('Social login error:', error);
      return { success: false, message: 'Server connection error.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('preferredLanguage', 'en'); 
    setToken(null);
    setUser(null);
    setLanguage('en'); 
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/update-me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Update failed' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Server connection error.' };
    }
  };

  const redeemReward = async (rewardTitle, cost) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/redeem-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rewardTitle, cost })
      });

      const data = await response.json();
      if (data.success) {
        // Update user state with new credits
        setUser(prev => ({ ...prev, credits: data.data.credits }));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Redemption failed' };
      }
    } catch (error) {
      console.error('Redeem reward error:', error);
      return { success: false, message: 'Server connection error.' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (email, token, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const loggedInUser = data.data.user;
        setUser(loggedInUser);

        // Apply language preference
        if (loggedInUser.preferredLanguage) {
          localStorage.setItem('preferredLanguage', loggedInUser.preferredLanguage);
          setLanguage(loggedInUser.preferredLanguage);
        }
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, verifyAdminOtp, signup, socialLogin, logout, updateProfile, redeemReward, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
