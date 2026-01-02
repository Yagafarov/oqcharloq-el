import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Mock authentication service
 * In production, these would be actual API calls
 */

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login user
 */
export const login = async (username, password) => {
  try {
    await delay(800);
    
    // Mock authentication check
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: '1',
        username: username,
        role: 'admin',
        lastLogin: Date.now()
      };
      
      // Create mock JWT token
      const token = btoa(JSON.stringify({
        userId: user.id,
        username: user.username,
        timestamp: Date.now()
      }));
      
      return { user, token };
    } else {
      throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await delay(200);
    
    // Clear auth data from localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    return { success: true };
  } catch (error) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

/**
 * Verify token
 */
export const verifyToken = async (token) => {
  try {
    await delay(200);
    
    if (!token) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    // Decode token
    const tokenData = JSON.parse(atob(token));
    
    // Check if token is expired
    const now = Date.now();
    if (now - tokenData.timestamp > SESSION_TIMEOUT) {
      throw new Error('Token expired');
    }
    
    return { valid: true, tokenData };
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    await delay(200);
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (!token || !userData) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    // Verify token
    await verifyToken(token);
    
    return JSON.parse(userData);
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    await delay(400);
    
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (!userData) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    const user = JSON.parse(userData);
    
    if (user.id !== userId) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    const updatedUser = {
      ...user,
      ...updates,
      id: user.id, // Preserve ID
      role: user.role // Preserve role
    };
    
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    await delay(600);
    
    // Mock password change
    // In production, this would validate old password and update in backend
    
    if (oldPassword !== 'admin123') {
      throw new Error('Eski parol noto\'g\'ri');
    }
    
    if (newPassword.length < 6) {
      throw new Error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    }
    
    // In production, update password in backend
    return { success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  
  if (!token || !userData) {
    return false;
  }
  
  try {
    const tokenData = JSON.parse(atob(token));
    const now = Date.now();
    
    // Check if token is expired
    return (now - tokenData.timestamp) < SESSION_TIMEOUT;
  } catch (error) {
    return false;
  }
};

/**
 * Get auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Set auth token
 */
export const setAuthToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Remove auth token
 */
export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};
