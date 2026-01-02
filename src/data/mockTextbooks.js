import { generateId } from '../utils/helpers';

export const mockTextbooks = [
  // 1-sinf
  {
    id: generateId(),
    title: 'Matematika 1-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '1-sinf',
    subject: 'Matematika',
    description: '1-sinf o\'quvchilari uchun matematika darsligi. Sonlar, qo\'shish, ayirish va geometriya asoslari.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/matematika-1.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.5,
    reviewsCount: 45,
    views: 890,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Ona tili 1-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '1-sinf',
    subject: 'Ona tili',
    description: '1-sinf o\'quvchilari uchun ona tili darsligi. Alifbo, o\'qish va yozish asoslari.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/ona-tili-1.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.7,
    reviewsCount: 52,
    views: 1120,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  
  // 5-sinf
  {
    id: generateId(),
    title: 'Matematika 5-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '5-sinf',
    subject: 'Matematika',
    description: '5-sinf o\'quvchilari uchun matematika darsligi. Kasrlar, o\'nli kasrlar, foizlar va geometriya.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/matematika-5.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.6,
    reviewsCount: 78,
    views: 1450,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Ingliz tili 5-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '5-sinf',
    subject: 'Ingliz tili',
    description: '5-sinf o\'quvchilari uchun ingliz tili darsligi. Grammar, vocabulary va reading skills.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/english-5.pdf'
    },
    audioUrl: 'https://example.com/english-5-audio.mp3',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.4,
    reviewsCount: 65,
    views: 1230,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Tarix 5-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '5-sinf',
    subject: 'Tarix',
    description: '5-sinf o\'quvchilari uchun tarix darsligi. Qadimgi dunyo tarixi va O\'rta Osiyo tarixi.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/tarix-5.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.5,
    reviewsCount: 58,
    views: 980,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },

  // 7-sinf
  {
    id: generateId(),
    title: 'Fizika 7-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '7-sinf',
    subject: 'Fizika',
    description: '7-sinf o\'quvchilari uchun fizika darsligi. Mexanika, issiqlik va elektr asoslari.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/fizika-7.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.3,
    reviewsCount: 72,
    views: 1340,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Algebra 7-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '7-sinf',
    subject: 'Matematika',
    description: '7-sinf o\'quvchilari uchun algebra darsligi. Tenglamalar, funksiyalar va grafik.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/algebra-7.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.4,
    reviewsCount: 68,
    views: 1280,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Biologiya 7-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '7-sinf',
    subject: 'Biologiya',
    description: '7-sinf o\'quvchilari uchun biologiya darsligi. O\'simliklar va hayvonlar dunyosi.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/biologiya-7.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.6,
    reviewsCount: 61,
    views: 1150,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },

  // 9-sinf
  {
    id: generateId(),
    title: 'Kimyo 9-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '9-sinf',
    subject: 'Kimyo',
    description: '9-sinf o\'quvchilari uchun kimyo darsligi. Organik va noorganik kimyo asoslari.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/kimyo-9.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.5,
    reviewsCount: 84,
    views: 1560,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Informatika 9-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '9-sinf',
    subject: 'Informatika',
    description: '9-sinf o\'quvchilari uchun informatika darsligi. Dasturlash va algoritmlar asoslari.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/informatika-9.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.7,
    reviewsCount: 92,
    views: 1780,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Geografiya 9-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '9-sinf',
    subject: 'Geografiya',
    description: '9-sinf o\'quvchilari uchun geografiya darsligi. Jahon geografiyasi va iqtisodiyot.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/geografiya-9.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.4,
    reviewsCount: 76,
    views: 1420,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },

  // 11-sinf
  {
    id: generateId(),
    title: 'Matematika 11-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '11-sinf',
    subject: 'Matematika',
    description: '11-sinf o\'quvchilari uchun matematika darsligi. Oliy matematika asoslari va tayyorgarlik.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/matematika-11.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.8,
    reviewsCount: 105,
    views: 2100,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: generateId(),
    title: 'Fizika 11-sinf',
    author: 'O\'zbekiston Respublikasi Xalq Ta\'limi Vazirligi',
    genre: 'Darslik',
    year: 2023,
    grade: '11-sinf',
    subject: 'Fizika',
    description: '11-sinf o\'quvchilari uchun fizika darsligi. Kvant fizikasi va atom fizikasi.',
    cover: '',
    type: 'textbook',
    downloads: {
      pdf: 'https://example.com/fizika-11.pdf'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.6,
    reviewsCount: 98,
    views: 1890,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
