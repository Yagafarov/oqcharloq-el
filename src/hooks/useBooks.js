import { useContext } from 'react';
import { BookContext } from '../context/BookContext';
import { findBookById } from '../utils/helpers';

/**
 * Custom hook for accessing book context
 */
export const useBooks = () => {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }

  const {
    state,
    setSearchQuery,
    setSelectedGenres,
    addBook,
    updateBook,
    deleteBook,
    setPage,
    setTotalPages
  } = context;

  // Get book by ID
  const getBookById = (id) => {
    return findBookById(state.books, id);
  };

  // Get all books
  const getAllBooks = () => {
    return state.books;
  };

  // Get filtered books
  const getFilteredBooks = () => {
    return state.filteredBooks;
  };

  // Get books count
  const getBooksCount = () => {
    return state.filteredBooks.length;
  };

  // Check if loading
  const isLoading = () => {
    return state.loading;
  };

  // Get error
  const getError = () => {
    return state.error;
  };

  return {
    // State
    books: state.books,
    filteredBooks: state.filteredBooks,
    selectedGenres: state.selectedGenres,
    searchQuery: state.searchQuery,
    loading: state.loading,
    error: state.error,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    
    // Actions
    setSearchQuery,
    setSelectedGenres,
    addBook,
    updateBook,
    deleteBook,
    setPage,
    setTotalPages,
    
    // Helper methods
    getBookById,
    getAllBooks,
    getFilteredBooks,
    getBooksCount,
    isLoading,
    getError
  };
};
