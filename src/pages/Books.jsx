import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import BookCard from '../components/BookCard'
import { Search, BookOpen } from 'lucide-react'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['barchasi'])
  const [selectedCategory, setSelectedCategory] = useState('barchasi')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from('books')
        .select('*, reviews(rating)')
        .order('created_at', { ascending: false })
      
      const booksWithStats = data?.map(book => {
        const reviews = book.reviews || []
        return {
          ...book,
          review_count: reviews.length,
          average_rating: reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0
        }
      }) || []
      
      setBooks(booksWithStats)
    } catch (error) {
      console.error('Xato:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('books').select('category')
      const cats = ['barchasi', ...new Set(data?.map(b => b.category))]
      setCategories(cats)
    } catch (error) {
      console.error('Kategoriya xatosi:', error)
    }
  }

  const filteredBooks = books.filter(book => {
    const categoryMatch =
      selectedCategory === 'barchasi' || book.category === selectedCategory
    const searchMatch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg sm:text-2xl text-gray-600 font-semibold">
            Kitoblar yuklanmoqda...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12 sm:mb-16 lg:mb-20 px-2">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black bg-linear-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 sm:mb-6">
          48-umumiy o‘rta ta'lim maktabi kutubxonasi
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
          Bepul kitoblar yuklab oling va o&apos;qing. {books.length} ta kitob
        </p>
      </div>

      {/* Search + Categories */}
      <div className="max-w-4xl mx-auto mb-10 sm:mb-14 lg:mb-16 space-y-6 sm:space-y-8">
        <div className="relative">
          <Search className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 absolute left-4 sm:left-6 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kitob nomi yoki muallif bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl text-base sm:text-lg border-2 border-gray-200/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-lg sm:shadow-xl transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 sm:px-7 lg:px-8 py-2.5 sm:py-3.5 rounded-2xl sm:rounded-3xl font-semibold sm:font-bold text-sm sm:text-base lg:text-lg shadow-md sm:shadow-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/50 ring-2 sm:ring-4 ring-indigo-200 scale-100 sm:scale-105'
                  : 'bg-white/80 backdrop-blur-xl text-gray-700 hover:bg-indigo-50 hover:shadow-xl border'
              }`}
            >
              {cat === 'barchasi'
                ? 'Hammasi'
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-center text-lg sm:text-xl font-semibold sm:font-bold text-gray-700 mb-8 sm:mb-12">
        {filteredBooks.length} ta natija
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredBooks.map((book, index) => (
          <BookCard key={book.id} book={book} delay={index * 100} />
        ))}
      </div>

      {/* Empty state */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-20 sm:py-28">
          <BookOpen className="w-20 h-20 sm:w-28 sm:h-28 text-gray-300 mx-auto mb-6 sm:mb-8 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-500 mb-3 sm:mb-4">
            Hech narsa topilmadi
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto px-4">
            Qidiruv so&apos;zini o&apos;zgartiring yoki boshqa kategoriyani tanlang
          </p>
        </div>
      )}
    </div>
  )
}
