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
      const { data } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setBook(data)
      }
    } catch (error) {
      console.error('Kitob yuklashda xato:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async (e) => {
    e.preventDefault()
    if (book.pdf_url) {
      const link = document.createElement('a')
      link.href = book.pdf_url
      link.download = `${book.title || 'kitob'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/books/${id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Toast uchun (keyinroq qo'shasiz)
      console.log('Ulashish havolasi nusxalandi:', shareUrl)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl">
            <BookOpen className="w-12 h-12 text-indigo-500" />
          </div>
          <p className="text-2xl text-gray-600 font-semibold">Kitob yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-28 h-28 bg-gradient-to-br from-gray-200/50 to-gray-300/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-gray-200/50">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">Kitob topilmadi</h1>
          <p className="text-2xl text-gray-600 mb-8">Kechirasiz, so'ralgan kitob mavjud emas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center lg:text-left mb-16">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100/90 to-green-100/90 px-8 py-4 rounded-3xl backdrop-blur-sm border border-emerald-200/60 shadow-xl mx-auto lg:mx-0 mb-8 max-w-max">
          <Tag className="w-6 h-6 text-emerald-700" />
          <span className="font-bold text-xl text-emerald-800 uppercase tracking-wide">{book.category}</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-[0.9] mb-8 px-4 -mx-4 lg:-mx-8 bg-white/50 py-4 rounded-3xl backdrop-blur-sm">
          {book.title}
        </h1>
        
        <div className="flex items-center gap-4 justify-center lg:justify-start">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-8 py-4 rounded-3xl backdrop-blur-sm border-2 border-indigo-200/50">
            <p className="text-3xl lg:text-4xl font-black text-indigo-800">{book.author}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Book Cover & Actions */}
        <div className="lg:sticky lg:top-32 space-y-10 lg:space-y-12">
          {/* Book Cover */}
          <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 border-4 border-white/70 hover:border-indigo-300/80 bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-xl p-6 lg:p-10">
            {book.image_url ? (
              <img 
                src={book.image_url} 
                alt={book.title}
                className="w-full aspect-[2/3] lg:aspect-[3/4] object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700 cursor-zoom-in block"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
            ) : null}
            
            <div className={`flex items-center justify-center aspect-[2/3] lg:aspect-[3/4] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-2xl shadow-2xl p-8 lg:p-12 transition-all duration-500 group-hover:scale-105 ${book.image_url ? 'hidden' : 'block'}`}>
              <div className="text-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-indigo-200/80 to-purple-200/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/50">
                  <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-indigo-600" />
                </div>
                <h3 className="font-black text-2xl lg:text-3xl text-gray-800 mb-2 truncate">{book.title}</h3>
                <p className="text-indigo-700 font-semibold text-lg">{book.author}</p>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_100%] animate-shimmer" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {book.pdf_url && (
              <button
                onClick={downloadPDF}
                className="w-full group bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 active:scale-[0.97] transition-all duration-500 flex items-center justify-center gap-4 text-xl font-black relative overflow-hidden hover:brightness-105"
              >
                <Download className="w-8 h-8 group-hover:-translate-y-1 transition-transform duration-300" />
                <span>PDF Yuklash</span>
                <div className="absolute inset-0 bg-white/20 blur animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={toggleLike}
                className={`group p-7 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 flex items-center justify-center gap-3 font-black text-lg relative overflow-hidden active:scale-[0.97] ${
                  isLiked
                    ? 'bg-gradient-to-r from-red-500/95 to-pink-500/95 text-white border-red-400/60 shadow-red-500/30 ring-4 ring-red-200/50 scale-[1.02]'
                    : 'bg-white/90 backdrop-blur-xl border-gray-200/60 hover:border-indigo-400/70 hover:bg-gradient-to-r hover:from-indigo-50/90 hover:to-purple-50/90 text-gray-800 hover:text-indigo-700'
                }`}
              >
                <Heart className={`w-9 h-9 transition-all duration-300 ${isLiked ? 'fill-current scale-110 drop-shadow-lg' : 'group-hover:scale-110'}`} />
                <span>{isLiked ? 'Sevimli ❤️' : 'Sevimlilarga'}</span>
                {isLiked && <div className="absolute inset-0 bg-red-400/20 blur-sm animate-ping" />}
              </button>

              <button
                onClick={copyShareLink}
                className="group bg-white/90 backdrop-blur-xl p-7 rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-gradient-to-r hover:from-indigo-50/90 hover:to-purple-50/90 transition-all duration-500 border border-gray-200/60 hover:border-indigo-400/70 flex items-center justify-center gap-3 font-black text-lg hover:text-indigo-700 active:scale-[0.97]"
              >
                <Share2 className="w-9 h-9 group-hover:rotate-180 transition-transform duration-500" />
                <span>Ulashish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Book Content */}
        <div className="space-y-16 lg:space-y-20">
          {/* Metadata */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-200/60">
            <div className="flex flex-wrap gap-6 lg:gap-8 items-center justify-center lg:justify-start text-sm">
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 rounded-3xl backdrop-blur-sm border border-indigo-200/50 shadow-lg">
                <Tag className="w-6 h-6 text-indigo-600" />
                <span className="font-bold text-lg text-indigo-800 uppercase tracking-wide">{book.category}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-50/90 to-green-50/90 rounded-3xl backdrop-blur-sm border border-emerald-200/50 shadow-lg">
                <Eye className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-lg text-emerald-800">Bepul yuklab olish</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 flex items-center gap-6 lg:gap-8">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-100/90 to-purple-100/90 p-4 lg:p-5 rounded-3xl shadow-xl flex items-center justify-center text-indigo-700">
                <BookOpen className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              Qisqacha ma'lumot
            </h2>
            <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 rounded-3xl shadow-2xl border border-gray-200/50 prose prose-xl max-w-none">
              <p className="text-2xl lg:text-3xl text-gray-700 leading-relaxed font-light">
                {book.description || "Bu kitob haqida batafsil ma'lumot kiritilmagan."}
              </p>
            </div>
          </div>

          {/* Details */}
          {book.details && (
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 flex items-center gap-6 lg:gap-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-100/90 to-green-100/90 p-4 lg:p-5 rounded-3xl shadow-xl flex items-center justify-center text-emerald-700">
                  <BookOpen className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                Batafsil ma'lumot
              </h2>
              <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 rounded-3xl shadow-2xl border border-gray-200/50 prose prose-xl max-w-none">
                <div className="text-xl lg:text-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.details}
                </div>
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {book.youtube_url && (
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 flex items-center gap-6 lg:gap-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-100/90 to-pink-100/90 p-4 lg:p-5 rounded-3xl shadow-xl flex items-center justify-center text-red-600">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                Video material
              </h2>
              <div className="bg-gradient-to-br from-gray-50/80 to-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200/50 overflow-hidden">
                <iframe
                  className="w-full h-[450px] lg:h-[600px] rounded-3xl shadow-2xl border-0"
                  src={`https://www.youtube.com/embed/${book.youtube_url}?autoplay=0&rel=0`}
                  title={`${book.title} - Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail
