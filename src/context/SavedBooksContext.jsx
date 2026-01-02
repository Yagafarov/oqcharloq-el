import { createContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  savedBooks: [],
  count: 0
};

// Action types
export const SAVED_BOOKS_ACTIONS = {
  ADD_SAVED_BOOK: 'ADD_SAVED_BOOK',
  REMOVE_SAVED_BOOK: 'REMOVE_SAVED_BOOK',
  LOAD_SAVED_BOOKS: 'LOAD_SAVED_BOOKS',
  CLEAR_SAVED_BOOKS: 'CLEAR_SAVED_BOOKS'
};

// Reducer
const savedBooksReducer = (state, action) => {
  switch (action.type) {
    case SAVED_BOOKS_ACTIONS.ADD_SAVED_BOOK:
      const newSavedBooks = [...state.savedBooks, action.payload];
      return {
        savedBooks: newSavedBooks,
        count: newSavedBooks.length
      };
    
    case SAVED_BOOKS_ACTIONS.REMOVE_SAVED_BOOK:
      const filteredBooks = state.savedBooks.filter(
        bookId => bookId !== action.payload
      );
      return {
        savedBooks: filteredBooks,
        count: filteredBooks.length
      };
    
    case SAVED_BOOKS_ACTIONS.LOAD_SAVED_BOOKS:
      return {
        savedBooks: action.payload,
        count: action.payload.length
      };
    
    case SAVED_BOOKS_ACTIONS.CLEAR_SAVED_BOOKS:
      return {
        savedBooks: [],
        count: 0
      };
    
    default:
      return state;
  }
};

// Create context
export const SavedBooksContext = createContext();

// Provider component
export const SavedBooksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(savedBooksReducer, initialState);

  // Load saved books from localStorage on mount
  useEffect(() => {
    const loadSavedBooks = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.SAVED_BOOKS);
        if (saved) {
          const savedBooks = JSON.parse(saved);
          dispatch({
            type: SAVED_BOOKS_ACTIONS.LOAD_SAVED_BOOKS,
            payload: savedBooks
          });
        }
      } catch (error) {
        console.error('Error loading saved books:', error);
      }
    };

    loadSavedBooks();
  }, []);

  // Save to localStorage whenever savedBooks changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SAVED_BOOKS,
        JSON.stringify(state.savedBooks)
      );
    } catch (error) {
      console.error('Error saving books:', error);
    }
  }, [state.savedBooks]);

  // Add book to saved list
  const addSavedBook = (bookId) => {
    if (!state.savedBooks.includes(bookId)) {
      dispatch({
        type: SAVED_BOOKS_ACTIONS.ADD_SAVED_BOOK,
        payload: bookId
      });
      return true;
    }
    return false;
  };

  // Remove book from saved list
  const removeSavedBook = (bookId) => {
    dispatch({
      type: SAVED_BOOKS_ACTIONS.REMOVE_SAVED_BOOK,
      payload: bookId
    });
  };

  // Toggle saved status
  const toggleSavedBook = (bookId) => {
    if (state.savedBooks.includes(bookId)) {
      removeSavedBook(bookId);
      return false;
    } else {
      addSavedBook(bookId);
      return true;
    }
  };

  // Check if book is saved
  const isBookSaved = (bookId) => {
    return state.savedBooks.includes(bookId);
  };

  // Clear all saved books
  const clearSavedBooks = () => {
    dispatch({ type: SAVED_BOOKS_ACTIONS.CLEAR_SAVED_BOOKS });
  };

  // Context value
  const value = {
    state,
    dispatch,
    savedBooks: state.savedBooks,
    count: state.count,
    addSavedBook,
    removeSavedBook,
    toggleSavedBook,
    isBookSaved,
    clearSavedBooks
  };

  return (
    <SavedBooksContext.Provider value={value}>
      {children}
    </SavedBooksContext.Provider>
  );
};
