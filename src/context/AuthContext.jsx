import { createContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          const tokenData = JSON.parse(atob(token));

          // Check if token is expired (30 minutes)
          const now = Date.now();
          const SESSION_TIMEOUT = 30 * 60 * 1000;
          if (now - tokenData.timestamp < SESSION_TIMEOUT) {
            dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
          } else {
            // Token expired, logout
            logout();
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Auto logout after session timeout
  useEffect(() => {
    if (state.isAuthenticated) {
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      const timeoutId = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [state.isAuthenticated]);

  // Login function
  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Mock authentication
      if (username === 'admin' && password === 'admin123') {
        const user = {
          id: '1',
          username: username,
          role: 'admin',
          lastLogin: Date.now()
        };

        // Create token (mock JWT)
        const token = btoa(JSON.stringify({
          userId: user.id,
          timestamp: Date.now()
        }));

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        // Update state
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });

        resolve(user);
      } else {
        reject(new Error('Login yoki parol noto\'g\'ri'));
      }
    });
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Update state
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user data
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
  };

  // Context value
  const value = {
    state,
    dispatch,
    login,
    logout,
    updateUser,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
