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
          average_rating: reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
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
    const categoryMatch = selectedCategory === 'barchasi' || book.category === selectedCategory
    const searchMatch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8" />
          <p className="text-2xl text-gray-600 font-semibold">Kitoblar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-8">
          Kitoblar kutubxonasi
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          Bepul kitoblar yuklab oling va o'qing. {books.length} ta kitob
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16 space-y-8">
        <div className="relative">
          <Search className="w-8 h-8 text-gray-400 absolute left-6 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Kitob nomi yoki muallif bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white/80 backdrop-blur-xl rounded-3xl text-xl border-2 border-gray-200/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-xl transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-3xl font-bold text-lg shadow-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/50 ring-4 ring-indigo-200 scale-105'
                  : 'bg-white/80 backdrop-blur-xl text-gray-700 hover:bg-indigo-50 hover:shadow-xl border'
              }`}
            >
              {cat === 'barchasi' ? 'Hammasi' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-2xl font-bold text-gray-700 mb-12">
        {filteredBooks.length} ta natija
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book, index) => (
          <BookCard key={book.id} book={book} delay={index * 100} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-32">
          <BookOpen className="w-32 h-32 text-gray-300 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl font-black text-gray-500 mb-4">Hech narsa topilmadi</h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Qidiruv so'zini o'zgartiring yoki boshqa kategoriyani tanlang
          </p>
        </div>
      )}
    </div>
  )
}
