import { useContext } from 'react';
import { SavedBooksContext } from '../context/SavedBooksContext';
import { useBooks } from './useBooks';

/**
 * Custom hook for accessing saved books context
 */
export const useSavedBooks = () => {
  const context = useContext(SavedBooksContext);

  if (!context) {
    throw new Error('useSavedBooks must be used within a SavedBooksProvider');
  }

  const {
    savedBooks,
    count,
    addSavedBook,
    removeSavedBook,
    toggleSavedBook,
    isBookSaved,
    clearSavedBooks
  } = context;

  const { books } = useBooks();

  // Get saved books with full details
  const getSavedBooksDetails = () => {
    return books.filter(book => savedBooks.includes(book.id));
  };

  // Get saved books count
  const getSavedBooksCount = () => {
    return count;
  };

  // Check if there are saved books
  const hasSavedBooks = () => {
    return count > 0;
  };

  return {
    // State
    savedBooks,
    count,
    
    // Actions
    addSavedBook,
    removeSavedBook,
    toggleSavedBook,
    isBookSaved,
    clearSavedBooks,
    
    // Helper methods
    getSavedBooksDetails,
    getSavedBooksCount,
    hasSavedBooks
  };
};
