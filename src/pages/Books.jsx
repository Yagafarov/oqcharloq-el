import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import BookCard from '../components/BookCard'

function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 12

  useEffect(() => {
    fetchBooks()
  }, [search, category, currentPage])

  const fetchBooks = async () => {
    setLoading(true)
    let query = supabase.from('books').select('*', { count: 'exact' })
    
    if (search) query = query.ilike('title', `%${search}%`)
    if (category !== 'all') query = query.eq('category', category)
    
    const from = (currentPage - 1) * booksPerPage
    const to = from + booksPerPage - 1
    const { data } = await query.range(from, to)
    setBooks(data || [])
    setLoading(false)
  }

  const categories = ['all', 'adabiyot', 'ilmiy', 'dasturlash', 'tarix']

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text mb-6">
          Barcha Kitoblar
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          {books.length} ta kitob topildi
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
        <div className="flex-1 flex items-center gap-4 bg-gray-50/50 px-6 py-4 rounded-2xl">
          <Search className="w-6 h-6 text-gray-500" />
          <input
            type="text"
            placeholder="Kitob nomini yozing..."
            className="flex-1 bg-transparent outline-none text-xl placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/50 hover:bg-indigo-100 text-gray-700'
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'Hammasi' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${
        loading ? 'animate-pulse' : ''
      }`}>
        {loading ? (
          [...Array(12)].map((_, i) => <BookCard.Skeleton key={i} />)
        ) : (
          books.map(book => <BookCard key={book.id} book={book} />)
        )}
      </div>

      {/* Pagination */}
      {!loading && books.length > 0 && (
        <div className="flex justify-center mt-20">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-xl">
            <button className="p-3 hover:bg-indigo-100 rounded-2xl transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="px-6 py-3 font-semibold">{currentPage}</span>
            <button className="p-3 hover:bg-indigo-100 rounded-2xl transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Books
