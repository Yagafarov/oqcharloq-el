import { YEAR_RANGE, ISBN_PATTERN, ERROR_MESSAGES } from './constants';

/**
 * Maydon bo'sh emasligini tekshirish
 */
export const validateRequired = (value, fieldName = 'Maydon') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} ${ERROR_MESSAGES.REQUIRED_FIELD}`;
  }
  return null;
};

/**
 * Yil validatsiyasi
 */
export const validateYear = (year) => {
  const yearNum = parseInt(year, 10);
  
  if (isNaN(yearNum)) {
    return 'Yil raqam bo\'lishi kerak';
  }
  
  if (yearNum < YEAR_RANGE.MIN || yearNum > YEAR_RANGE.MAX) {
    return ERROR_MESSAGES.INVALID_YEAR;
  }
  
  return null;
};

/**
 * ISBN validatsiyasi
 */
export const validateISBN = (isbn) => {
  // ISBN ixtiyoriy, bo'sh bo'lishi mumkin
  if (!isbn || isbn.trim() === '') {
    return null;
  }
  
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  if (!ISBN_PATTERN.test(cleanISBN)) {
    return ERROR_MESSAGES.INVALID_ISBN;
  }
  
  return null;
};

/**
 * Email validatsiyasi
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return 'Email manzil noto\'g\'ri formatda';
  }
  
  return null;
};

/**
 * Telefon raqam validatsiyasi (O'zbekiston formati)
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return null; // Telefon ixtiyoriy
  }
  
  const phonePattern = /^\+998\s?\d{2}\s?\d{3}-?\d{2}-?\d{2}$/;
  
  if (!phonePattern.test(phone)) {
    return 'Telefon raqam +998 XX XXX-XX-XX formatida bo\'lishi kerak';
  }
  
  return null;
};

/**
 * Kitob forma validatsiyasi
 */
export const validateBookForm = (formData) => {
  const errors = {};
  
  // Title
  const titleError = validateRequired(formData.title, 'Kitob nomi');
  if (titleError) errors.title = titleError;
  
  // Author
  const authorError = validateRequired(formData.author, 'Muallif');
  if (authorError) errors.author = authorError;
  
  // Genre
  const genreError = validateRequired(formData.genre, 'Janr');
  if (genreError) errors.genre = genreError;
  
  // Year
  const yearError = validateYear(formData.year);
  if (yearError) errors.year = yearError;
  
  // ISBN (ixtiyoriy)
  const isbnError = validateISBN(formData.isbn);
  if (isbnError) errors.isbn = isbnError;
  
  // Description
  const descError = validateRequired(formData.description, 'Tavsif');
  if (descError) errors.description = descError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Login forma validatsiyasi
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const usernameError = validateRequired(formData.username, 'Foydalanuvchi nomi');
  if (usernameError) errors.username = usernameError;
  
  const passwordError = validateRequired(formData.password, 'Parol');
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Fayl hajmi validatsiyasi (MB)
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return null;
  
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > maxSizeMB) {
    return `Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak`;
  }
  
  return null;
};

/**
 * Rasm fayl turi validatsiyasi
 */
export const validateImageType = (file) => {
  if (!file) return null;
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Faqat JPG, PNG yoki WebP formatdagi rasmlar qabul qilinadi';
  }
  
  return null;
};
