import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { ArrowRight, Download, Play, BookOpen } from 'lucide-react' // npm install lucide-react
import BookCard from '../components/BookCard'

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    const { data } = await supabase.from('books').select('*').limit(6)
    setBooks(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 px-6 md:px-12 lg:px-24 text-center z-10">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
            <span className="font-semibold text-indigo-700">50,000+ o'quvchilar</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-8 leading-tight">
            Kitoblar
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dunyosi
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Zamonaviy va klassik kitoblarning cheksiz kutubxonasi. 
            <span className="font-semibold text-indigo-700">Bepul o'qing, yuklab oling.</span>
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-20">
            <button className="group relative bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              Boshlash
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white/90 backdrop-blur-xl border-2 border-indigo-200 hover:border-indigo-300 text-indigo-800 hover:text-indigo-900 px-12 py-6 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <Play className="w-6 h-6" />
              Demo ko'rish
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <div className="w-px h-20 bg-linear-to-b from-indigo-400 to-purple-400 mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="px-6 md:px-12 lg:px-24 pb-28 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-linear-to-r from-indigo-100 to-purple-100 px-8 py-4 rounded-2xl backdrop-blur-sm mb-8">
            <div className="w-3 h-3 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full" />
            <span className="text-2xl font-bold text-gray-800">✨ Yangi va mashhur</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 bg-linear-to-r from-gray-900 to-slate-800 bg-clip-text">
            Tavsiya etilgan
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bugungi kunda o'quvchilar eng ko'p tanlagan kitoblar
          </p>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-linear-to-br from-gray-200 to-gray-300 h-96 rounded-3xl shadow-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} delay={index * 100} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-black bg-linear-to-b from-indigo-600 to-indigo-700 bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                10,000<span className="text-4xl">+</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">Kitoblar</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-black bg-linear-to-b from-purple-600 to-purple-700 bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                50,000<span className="text-4xl">+</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">O'quvchilar</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-black bg-linear-to-b from-emerald-600 to-emerald-700 bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                100<span className="text-4xl">+</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">Mualliflar</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-black bg-linear-to-b from-blue-600 to-blue-700 bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-2xl font-bold text-gray-800">Mavjud</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
