/**
 * UUID generatsiya qilish
 */
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Debounce funksiyasi
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Matnni qisqartirish
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Sanani formatlash
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
};

/**
 * Kitoblarni qidirish
 */
export const searchBooks = (books, query) => {
  if (!query || query.trim() === '') return books;
  
  const searchTerm = query.toLowerCase().trim();
  
  return books.filter((book) => {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();
    const genre = book.genre.toLowerCase();
    
    return (
      title.includes(searchTerm) ||
      author.includes(searchTerm) ||
      genre.includes(searchTerm)
    );
  });
};

/**
 * Kitoblarni janr bo'yicha filtrlash
 */
export const filterBooksByGenres = (books, selectedGenres) => {
  if (!selectedGenres || selectedGenres.length === 0) return books;
  
  return books.filter((book) => selectedGenres.includes(book.genre));
};

/**
 * Kitoblarni sahifalash
 */
export const paginateBooks = (books, page, perPage) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  
  return {
    books: books.slice(startIndex, endIndex),
    totalPages: Math.ceil(books.length / perPage),
    currentPage: page,
    totalBooks: books.length
  };
};

/**
 * Kitoblarni saralash
 */
export const sortBooks = (books, sortBy = 'title', order = 'asc') => {
  const sorted = [...books].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // String qiymatlar uchun
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Janrlar bo'yicha kitoblar sonini hisoblash
 */
export const countBooksByGenre = (books) => {
  const counts = {};
  
  books.forEach((book) => {
    counts[book.genre] = (counts[book.genre] || 0) + 1;
  });
  
  return counts;
};

/**
 * Rasmni base64 ga o'girish
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * URL dan kitob ID olish
 */
export const getBookIdFromUrl = (pathname) => {
  const parts = pathname.split('/');
  return parts[parts.length - 1];
};

/**
 * Kitobni ID bo'yicha topish
 */
export const findBookById = (books, id) => {
  return books.find((book) => book.id === id);
};

/**
 * LocalStorage hajmini tekshirish (MB)
 */
export const getLocalStorageSize = () => {
  let total = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  
  return (total / 1024 / 1024).toFixed(2); // MB
};

/**
 * Matnni highlight qilish (qidiruv uchun)
 */
export const highlightText = (text, query) => {
  if (!query || query.trim() === '') return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Tasodifiy rang generatsiya qilish
 */
export const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Kitob muqovasi placeholder
 */
export const getBookCoverPlaceholder = (title) => {
  const firstLetter = title ? title.charAt(0).toUpperCase() : '?';
  return {
    letter: firstLetter,
    color: getRandomColor()
  };
};
