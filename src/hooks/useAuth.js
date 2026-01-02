import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for accessing auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    state,
    login,
    logout,
    updateUser,
    isAuthenticated,
    user,
    loading
  } = context;

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is librarian
  const isLibrarian = () => {
    return hasRole('librarian');
  };

  // Get user info
  const getUserInfo = () => {
    return user;
  };

  return {
    // State
    isAuthenticated,
    user,
    loading,
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Helper methods
    hasRole,
    isAdmin,
    isLibrarian,
    getUserInfo
  };
};
