import { createContext, useReducer, useEffect } from 'react';
import { mockBooks } from '../data/mockBooks';
import { mockTextbooks } from '../data/mockTextbooks';
import { STORAGE_KEYS } from '../utils/constants';
import { searchBooks, filterBooksByGenres } from '../utils/helpers';

// Initial state
const initialState = {
  books: [],
  filteredBooks: [],
  selectedGenres: [],
  searchQuery: '',
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1
};

// Action types
export const BOOK_ACTIONS = {
  SET_BOOKS: 'SET_BOOKS',
  SET_FILTERED_BOOKS: 'SET_FILTERED_BOOKS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SELECTED_GENRES: 'SET_SELECTED_GENRES',
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PAGE: 'SET_PAGE',
  SET_TOTAL_PAGES: 'SET_TOTAL_PAGES'
};

// Reducer
const bookReducer = (state, action) => {
  switch (action.type) {
    case BOOK_ACTIONS.SET_BOOKS:
      return {
        ...state,
        books: action.payload,
        filteredBooks: action.payload
      };
    
    case BOOK_ACTIONS.SET_FILTERED_BOOKS:
      return {
        ...state,
        filteredBooks: action.payload
      };
    
    case BOOK_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
    
    case BOOK_ACTIONS.SET_SELECTED_GENRES:
      return {
        ...state,
        selectedGenres: action.payload
      };
    
    case BOOK_ACTIONS.ADD_BOOK:
      const newBooks = [...state.books, action.payload];
      return {
        ...state,
        books: newBooks,
        filteredBooks: newBooks
      };
    
    case BOOK_ACTIONS.UPDATE_BOOK:
      const updatedBooks = state.books.map(book =>
        book.id === action.payload.id ? action.payload : book
      );
      return {
        ...state,
        books: updatedBooks,
        filteredBooks: updatedBooks
      };
    
    case BOOK_ACTIONS.DELETE_BOOK:
      const remainingBooks = state.books.filter(
        book => book.id !== action.payload
      );
      return {
        ...state,
        books: remainingBooks,
        filteredBooks: remainingBooks
      };
    
    case BOOK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case BOOK_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case BOOK_ACTIONS.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case BOOK_ACTIONS.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
export const BookContext = createContext();

// Provider component
export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  // Load books from localStorage or use mock data
  useEffect(() => {
    const loadBooks = () => {
      try {
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
        
        const storedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS_DATA);
        
        // Always use fresh data from mock files (for development)
        const allBooks = [...mockBooks, ...mockTextbooks];
        dispatch({ type: BOOK_ACTIONS.SET_BOOKS, payload: allBooks });
        localStorage.setItem(STORAGE_KEYS.BOOKS_DATA, JSON.stringify(allBooks));
        
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: error.message });
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadBooks();
  }, []);

  // Apply filters when search query or selected genres change
  useEffect(() => {
    let filtered = [...state.books];

    // Apply search filter
    if (state.searchQuery) {
      filtered = searchBooks(filtered, state.searchQuery);
    }

    // Apply genre filter
    if (state.selectedGenres.length > 0) {
      filtered = filterBooksByGenres(filtered, state.selectedGenres);
    }

    dispatch({ type: BOOK_ACTIONS.SET_FILTERED_BOOKS, payload: filtered });
    dispatch({ type: BOOK_ACTIONS.SET_PAGE, payload: 1 }); // Reset to first page
  }, [state.searchQuery, state.selectedGenres, state.books]);

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (state.books.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BOOKS_DATA, JSON.stringify(state.books));
    }
  }, [state.books]);

  // Context value
  const value = {
    state,
    dispatch,
    // Helper functions
    setSearchQuery: (query) => {
      dispatch({ type: BOOK_ACTIONS.SET_SEARCH_QUERY, payload: query });
    },
    setSelectedGenres: (genres) => {
      dispatch({ type: BOOK_ACTIONS.SET_SELECTED_GENRES, payload: genres });
    },
    addBook: (book) => {
      dispatch({ type: BOOK_ACTIONS.ADD_BOOK, payload: book });
    },
    updateBook: (book) => {
      dispatch({ type: BOOK_ACTIONS.UPDATE_BOOK, payload: book });
    },
    deleteBook: (bookId) => {
      dispatch({ type: BOOK_ACTIONS.DELETE_BOOK, payload: bookId });
    },
    setPage: (page) => {
      dispatch({ type: BOOK_ACTIONS.SET_PAGE, payload: page });
    },
    setTotalPages: (pages) => {
      dispatch({ type: BOOK_ACTIONS.SET_TOTAL_PAGES, payload: pages });
    }
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};
