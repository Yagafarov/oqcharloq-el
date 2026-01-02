import { generateId } from '../utils/helpers';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Mock API service for books
 * In production, these would be actual API calls
 */

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all books
 */
export const getAllBooks = async () => {
  try {
    await delay(300);
    
    const books = localStorage.getItem('oqcharloq_books_data');
    if (books) {
      return JSON.parse(books);
    }
    return [];
  } catch (error) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

/**
 * Get book by ID
 */
export const getBookById = async (id) => {
  try {
    await delay(200);
    
    const books = await getAllBooks();
    const book = books.find(b => b.id === id);
    
    if (!book) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    
    return book;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new book
 */
export const createBook = async (bookData) => {
  try {
    await delay(400);
    
    const newBook = {
      ...bookData,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const books = await getAllBooks();
    books.push(newBook);
    
    localStorage.setItem('oqcharloq_books_data', JSON.stringify(books));
    
    return newBook;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

/**
 * Update book
 */
export const updateBook = async (id, bookData) => {
  try {
    await delay(400);
    
    const books = await getAllBooks();
    const index = books.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    
    const updatedBook = {
      ...books[index],
      ...bookData,
      id: books[index].id, // Preserve original ID
      createdAt: books[index].createdAt, // Preserve creation date
      updatedAt: Date.now()
    };
    
    books[index] = updatedBook;
    localStorage.setItem('oqcharloq_books_data', JSON.stringify(books));
    
    return updatedBook;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete book
 */
export const deleteBook = async (id) => {
  try {
    await delay(300);
    
    const books = await getAllBooks();
    const filteredBooks = books.filter(b => b.id !== id);
    
    if (books.length === filteredBooks.length) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    
    localStorage.setItem('oqcharloq_books_data', JSON.stringify(filteredBooks));
    
    return { success: true, id };
  } catch (error) {
    throw error;
  }
};

/**
 * Search books
 */
export const searchBooks = async (query) => {
  try {
    await delay(200);
    
    const books = await getAllBooks();
    
    if (!query || query.trim() === '') {
      return books;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return books.filter(book => {
      return (
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
      );
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

/**
 * Filter books by genre
 */
export const filterBooksByGenre = async (genres) => {
  try {
    await delay(200);
    
    const books = await getAllBooks();
    
    if (!genres || genres.length === 0) {
      return books;
    }
    
    return books.filter(book => genres.includes(book.genre));
  } catch (error) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

/**
 * Get books by year range
 */
export const getBooksByYearRange = async (minYear, maxYear) => {
  try {
    await delay(200);
    
    const books = await getAllBooks();
    
    return books.filter(book => {
      return book.year >= minYear && book.year <= maxYear;
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

/**
 * Get books count by genre
 */
export const getBooksCountByGenre = async () => {
  try {
    await delay(200);
    
    const books = await getAllBooks();
    const counts = {};
    
    books.forEach(book => {
      counts[book.genre] = (counts[book.genre] || 0) + 1;
    });
    
    return counts;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};
