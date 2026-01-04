import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Download, Play, Heart, Share2, BookOpen, Tag, Eye } from 'lucide-react'

function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from('books').select('*').eq('id', id).single()
      if (data) setBook(data)
    } catch (error) {
      console.error('Xato:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = (e) => {
    e.preventDefault()
    if (book.pdf_url) {
      const link = document.createElement('a')
      link.href = book.pdf_url
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleLike = () => setIsLiked(!isLiked)
  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/books/${id}`)
  }

  // Cloudinary image optimization
  const getImageUrl = (imageUrl, width = 400, height = 600) => {
    if (!imageUrl) return `https://via.placeholder.com/${width}x${height}/6b7280/f8fafc?text=${encodeURIComponent(book.title.slice(0,15))}`
    
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`)
    }
    return imageUrl
  }

  if (loading) return <div className="min-h-screen pt-32 text-center"><div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" /><p className="text-2xl">Yuklanmoqda...</p></div>
  if (!book) return <div className="min-h-screen pt-32 text-center"><h1 className="text-5xl font-black text-gray-900 mb-4">Kitob topilmadi</h1></div>

  return (
    <div className="pt-24 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-emerald-100 px-8 py-4 rounded-3xl mx-auto mb-8">
          <Tag className="w-6 h-6 text-emerald-700" />
          <span className="font-bold text-xl text-emerald-800">{book.category}</span>
        </div>
        <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-8">{book.title}</h1>
        <p className="text-4xl font-bold text-indigo-700">{book.author}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Cover & Actions */}
        <div className="lg:sticky lg:top-32 space-y-8">
          <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 overflow-hidden">
            <img 
              src={getImageUrl(book.image_url, 500, 700)} 
              alt={book.title}
              className="w-full h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
          </div>

          <div className="space-y-4">
            {book.pdf_url && (
              <button onClick={downloadPDF} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-xl font-black flex items-center gap-4 justify-center">
                <Download className="w-8 h-8" />
                PDF Yuklash
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={toggleLike} className={`p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-4 flex items-center justify-center gap-4 font-bold ${
                isLiked ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300' : 'bg-white border-gray-200 hover:bg-indigo-50'
              }`}>
                <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Sevimli ❤️' : 'Sevimlilarga'}</span>
              </button>
              
              <button onClick={copyShareLink} className="p-8 bg-white shadow-xl hover:shadow-2xl rounded-3xl transition-all border border-gray-200 hover:bg-indigo-50 flex items-center justify-center gap-4 font-bold">
                <Share2 className="w-8 h-8" />
                <span>Ulashish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl">
            <p className="text-2xl text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          {book.details && (
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl">
              <h3 className="text-3xl font-bold mb-6">Batafsil ma'lumot</h3>
              <div className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">{book.details}</div>
            </div>
          )}

          {book.youtube_url && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 overflow-hidden shadow-xl">
              <iframe
                className="w-full h-[500px] rounded-3xl"
                src={`https://www.youtube.com/embed/${book.youtube_url}`}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail
