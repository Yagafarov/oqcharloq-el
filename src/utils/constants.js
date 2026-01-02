// Janrlar ro'yxati
export const GENRES = [
  'Badiiy adabiyot',
  'Ilmiy-ommabop',
  'Tarixiy',
  'Biografiya',
  'Fantastika',
  'Detektiv',
  'Sarguzasht',
  'She\'riyat',
  'Bolalar adabiyoti',
  'Darslik',
  'Ensiklopediya',
  'Psixologiya',
  'Falsafa',
  'Diniy',
  'San\'at'
];

// Sinflar ro'yxati
export const GRADES = [
  '1-sinf',
  '2-sinf',
  '3-sinf',
  '4-sinf',
  '5-sinf',
  '6-sinf',
  '7-sinf',
  '8-sinf',
  '9-sinf',
  '10-sinf',
  '11-sinf'
];

// Fanlar ro'yxati
export const SUBJECTS = [
  'Matematika',
  'Ona tili',
  'Adabiyot',
  'Ingliz tili',
  'Rus tili',
  'Fizika',
  'Kimyo',
  'Biologiya',
  'Tarix',
  'Geografiya',
  'Informatika',
  'Jismoniy tarbiya'
];

// Kitob turlari
export const BOOK_TYPES = {
  REGULAR: 'regular',      // Oddiy kitob
  TEXTBOOK: 'textbook',    // Darslik
  AUDIOBOOK: 'audiobook',  // Audio kitob
  VIDEO: 'video'           // Video dars
};

// Fayl formatlari
export const FILE_FORMATS = {
  PDF: 'pdf',
  EPUB: 'epub',
  DOCX: 'docx',
  MP3: 'mp3',
  MP4: 'mp4'
};

// Sahifalash
export const BOOKS_PER_PAGE = 20;

// Qidiruv debounce vaqti (ms)
export const SEARCH_DEBOUNCE_TIME = 300;

// LocalStorage kalitlari
export const STORAGE_KEYS = {
  SAVED_BOOKS: 'oqcharloq_saved_books',
  BOOKS_DATA: 'oqcharloq_books_data',
  RECENT_BOOKS: 'oqcharloq_recent_books',
  THEME: 'oqcharloq_theme',
  FONT_SIZE: 'oqcharloq_font_size',
  BOOK_REVIEWS: 'oqcharloq_reviews'
};

// Yil chegaralari
export const YEAR_RANGE = {
  MIN: 1900,
  MAX: new Date().getFullYear()
};

// ISBN regex pattern
export const ISBN_PATTERN = /^(?:\d{10}|\d{13})$/;

// Xato xabarlari
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Bu maydon to\'ldirilishi shart',
  INVALID_YEAR: `Yil ${YEAR_RANGE.MIN} va ${YEAR_RANGE.MAX} oralig'ida bo'lishi kerak`,
  INVALID_ISBN: 'ISBN 10 yoki 13 raqamdan iborat bo\'lishi kerak',
  BOOK_NOT_FOUND: 'Kitob topilmadi',
  NETWORK_ERROR: 'Tarmoq xatosi. Internetni tekshiring.',
  UNKNOWN_ERROR: 'Kutilmagan xato yuz berdi',
  DOWNLOAD_ERROR: 'Yuklab olishda xatolik yuz berdi',
  PLAY_ERROR: 'Ijro etishda xatolik yuz berdi'
};

// Muvaffaqiyat xabarlari
export const SUCCESS_MESSAGES = {
  BOOK_SAVED: 'Kitob saqlanganlar ro\'yxatiga qo\'shildi',
  BOOK_UNSAVED: 'Kitob saqlanganlar ro\'yxatidan o\'chirildi',
  REVIEW_ADDED: 'Sharh muvaffaqiyatli qo\'shildi',
  DOWNLOAD_SUCCESS: 'Fayl muvaffaqiyatli yuklandi',
  SHARED: 'Havola nusxalandi'
};

// Maktab ma'lumotlari
export const SCHOOL_INFO = {
  name: '48-maktab',
  fullName: '48-umumiy o\'rta ta\'lim maktabi',
  libraryName: 'Oqcharloq',
  address: 'Toshkent shahar, Yunusobod tumani',
  phone: '+998 71 123-45-67',
  email: 'library@school48.uz',
  workingHours: {
    weekdays: '9:00 - 17:00',
    saturday: '9:00 - 14:00',
    sunday: 'Dam olish kuni'
  }
};

// Shrift o'lchamlari
export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Mavzular (themes)
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Reyting
export const RATING_MAX = 5;

// Oxirgi ko'rilgan kitoblar soni
export const RECENT_BOOKS_LIMIT = 10;

// Tavsiya etiladigan kitoblar soni
export const RECOMMENDED_BOOKS_LIMIT = 6;
