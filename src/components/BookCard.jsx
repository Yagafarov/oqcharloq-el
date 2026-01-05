import { useNavigate } from 'react-router-dom'
import { Download, Star, Heart, Volume2, FileText, Play } from 'lucide-react'
import { useState } from 'react'

function BookCard({ book, delay = 0 }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleClick = (e) => {
    if (!e.target.closest('.action-btn') && !e.target.closest('.like-btn')) {
      navigate(`/books/${book.id}`)
    }
  }

  const toggleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handlePDF = (e) => {
    e.stopPropagation()
    if (book.pdf_url) {
      const link = document.createElement('a')
      link.href = book.pdf_url
      link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAudio = (e) => {
    e.stopPropagation()
    if (book.audio_url) {
      window.open(book.audio_url, '_blank')
    }
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return `https://placehold.co/340x480/f8fafc/334155?text=${encodeURIComponent(book.title.slice(0,12))}&font=inter`
    }
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/w_340,h_480,c_fill,q_auto:eco,f_auto/')
    }
    return imageUrl
  }

  const rating = book.average_rating || 4.8

  return (
    <div 
      className="group relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-white/70 hover:border-indigo-200/60 hover:bg-white transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2 max-h-full w-full"
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      {/* 🖼️ RASM - Cover */}
      <div className="relative h-56 sm:h-64 lg:h-80 flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="relative w-32 sm:w-36 lg:w-44 h-48 sm:h-52 lg:h-60 bg-gradient-to-br from-white/90 to-indigo-50/60 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white/95 overflow-hidden ring-1 ring-transparent group-hover:ring-indigo-200/60 transition-all duration-700 group-hover:scale-102 sm:group-hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] sm:hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
          <img 
            src={getImageUrl(book.image_url)} 
            alt={book.title}
            className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:brightness-105 transition-all"
            loading="lazy"
          />
        </div>
      </div>

      {/* 📝 CONTENT */}
      <div className="relative p-4 sm:p-5 lg:p-6 pb-12 sm:pb-14 lg:pb-16">
        {/* 1️⃣ TIP (Kategoriya) */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl border border-indigo-200/60 uppercase tracking-wide">
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-indigo-500 rounded-full" />
          {book.category}
        </div>

        {/* 2️⃣ ASAR NOMI */}
        <h3 className="font-black text-xl sm:text-2xl lg:text-2xl leading-tight sm:leading-snug mb-2 sm:mb-3 line-clamp-2 lg:line-clamp-2 text-gray-900 group-hover:text-indigo-900">
          {book.title}
        </h3>

        {/* 3️⃣ MUALLIF */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-gray-100/60">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <span className="text-base sm:text-lg font-bold text-indigo-800 tracking-wide">{book.author}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          {/* Files */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
            {book.pdf_url && (
              <button 
                className="action-btn pdf-btn bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold border hover:border-emerald-300 transition-all flex items-center gap-1 group min-w-[68px] sm:min-w-0" 
                onClick={handlePDF}
              >
                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
            {book.audio_url && (
              <button 
                className="action-btn bg-purple-100/80 hover:bg-purple-200 text-purple-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold border hover:border-purple-300 transition-all flex items-center gap-1 group min-w-[68px] sm:min-w-0" 
                onClick={handleAudio}
              >
                <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">Audio</span>
              </button>
            )}
          </div>

          {/* Rating + Like */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-amber-50/90 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border">
              <Star className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-500 fill-amber-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-gray-900">{rating}</span>
            </div>
            <button 
              className={`like-btn p-1.5 sm:p-2.5 rounded-md sm:rounded-lg border transition-all flex items-center justify-center group/like min-w-9 sm:min-w-10 shrink-0 ${
                isLiked 
                  ? 'bg-rose-500/90 text-white border-rose-200 shadow-md scale-105' 
                  : 'bg-white/80 hover:bg-gray-50 text-gray-700 shadow-sm'
              }`}
              onClick={toggleLike}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform ${isLiked ? 'fill-current scale-110' : 'group-hover/like:scale-110'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none bg-gradient-to-t from-white via-white/95 to-transparent" />
    </div>
  )
}

export default BookCard
