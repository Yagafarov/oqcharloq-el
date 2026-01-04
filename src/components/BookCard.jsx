// src/components/BookCard.jsx
import { useNavigate } from 'react-router-dom'
import { Download, Play, Star, Heart } from 'lucide-react'
import { useState } from 'react'

function BookCard({ book, delay = 0 }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  const handleClick = (e) => {
    // Like tugmasi yoki PDF tugmasi bosilmasa, kitob sahifasiga o'tish
    if (!e.target.closest('.like-btn') && !e.target.closest('.pdf-btn')) {
      navigate(`/books/${book.id}`)
    }
  }

  const toggleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handlePDF = (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = book.pdf_url
    link.download = `${book.title || 'kitob'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div 
      className="group relative bg-gradient-to-br from-white/95 to-indigo-50/50 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl/75 border border-white/70 hover:border-indigo-200/80 hover:bg-white/100 active:scale-[0.98] transition-all duration-700 overflow-hidden cursor-pointer max-h-[28rem]"
      style={{ animationDelay: `${delay}ms`, animation: 'float 6s ease-in-out infinite' }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 z-0 ${
        isHovered 
          ? 'from-indigo-500/25 via-purple-400/15 to-pink-400/20 opacity-100 scale-105 blur-sm' 
          : 'from-indigo-500/5 via-transparent to-transparent opacity-0'
      }`} />
      
      {/* Book cover */}
      <div className="relative h-72 p-6 md:p-8 flex items-center justify-center z-10">
        <div className={`relative w-32 md:w-36 h-44 md:h-52 bg-gradient-to-br rounded-3xl shadow-2xl border-4 border-white/80 backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:border-indigo-300/80 overflow-hidden ${
          isHovered 
            ? 'from-indigo-400/40 via-blue-400/30 to-purple-400/40 shadow-indigo-500/40 ring-2 ring-indigo-200/50' 
            : 'from-indigo-200/60 to-purple-200/60 shadow-indigo-200/60'
        }`}>
          {/* Book cover shine */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
          )}
          {/* Book cover pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_0%,transparent_50%)] opacity-50" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8 pb-12 z-20">
        {/* Title */}
        <h3 className="font-black text-xl md:text-2xl leading-tight mb-4 text-gray-900 group-hover:text-indigo-900 transition-all line-clamp-2 pr-2 bg-gradient-to-r bg-clip-text group-hover:from-indigo-900 group-hover:to-purple-900">
          {book.title || 'Nomaʼlum kitob'}
        </h3>
        
        {/* Description */}
        <p className={`text-base md:text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3 transition-all pr-2 ${
          isHovered ? 'drop-shadow-sm' : ''
        }`}>
          {book.description || 'Zamonaviy va qiziqarli kitob. Bepul o\'qing va bilim oling.'}
        </p>
        
        {/* Author */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100/50">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg" />
          <span className="text-sm md:text-base font-bold text-indigo-800 uppercase tracking-wide bg-indigo-50/60 px-2 py-1 rounded-full">
            {book.author || 'Muallif'}
          </span>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2.5 items-center flex-1">
            {/* Action badges */}
            <span className="group/badge bg-gradient-to-r from-indigo-100/90 to-purple-100/90 backdrop-blur-sm text-indigo-800 px-4 py-2.5 rounded-xl text-sm font-bold border border-indigo-200/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover/badge:animate-ping" />
              O'qish
            </span>
            
            {/* PDF Button - XATO TUZATILDI */}
            {book.pdf_url && (
              <button 
                className="pdf-btn group/pdf bg-gradient-to-r from-emerald-100/90 to-green-100/90 backdrop-blur-sm text-emerald-800 px-4 py-2.5 rounded-xl text-sm font-bold border border-emerald-200/60 shadow-lg hover:shadow-xl hover:scale-105 hover:brightness-105 transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:shadow-emerald-200/50"
                onClick={handlePDF}
              >
                <Download className="w-4 h-4 group-hover/pdf:translate-y-[-1px] transition-transform" />
                PDF
              </button>
            )}
            
            {book.youtube_url && (
              <span className="bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-sm text-amber-800 px-4 py-2.5 rounded-xl text-sm font-bold border border-amber-200/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                <Play className="w-4 h-4" />
                Video
              </span>
            )}
          </div>
          
          {/* Rating & Like */}
          <div className="flex items-center gap-3 ml-2">
            {/* Rating */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md border border-amber-200/50 hover:shadow-lg transition-all">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 drop-shadow-sm" />
              <span className="font-bold text-lg text-gray-900 tracking-tight">4.8</span>
              <span className="text-xs text-gray-500 font-medium">(127)</span>
            </div>
            
            {/* Like button */}
            <button
              className={`like-btn p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 transition-all duration-300 flex items-center gap-2 group/like relative overflow-hidden active:scale-95 ${
                isLiked 
                  ? 'bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white border-red-300/50 shadow-red-500/25 scale-105 ring-2 ring-red-200/50' 
                  : 'hover:bg-gray-50/80 hover:border-gray-300/60 text-gray-700 hover:ring-1 hover:ring-gray-200/50'
              }`}
              onClick={toggleLike}
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-red-500 scale-110' : 'group-hover/like:scale-110'}`} />
              <span className="font-bold text-sm md:text-base min-w-[1.5rem] text-center">
                {likeCount}
              </span>
              {isLiked && (
                <div className="absolute -inset-2 bg-red-400/30 rounded-2xl blur animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-white via-white/95 to-transparent z-10" />
    </div>
  )
}

// Skeleton komponenti
BookCard.Skeleton = function Skeleton({ count = 1 }) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gradient-to-br from-gray-100/70 to-gray-200/70 backdrop-blur-xl rounded-3xl shadow-2xl h-[28rem] overflow-hidden border border-gray-200/50">
          {/* Cover */}
          <div className="h-72 p-8 flex items-center justify-center">
            <div className="w-36 h-52 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl shadow-xl" />
          </div>
          
          {/* Content */}
          <div className="p-8 space-y-4">
            <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl w-4/5" />
            <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-3/5" />
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50">
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
              <div className="h-6 bg-gray-300 rounded-full w-24" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-20 bg-gray-300 rounded-xl" />
                <div className="h-10 w-16 bg-gray-300 rounded-xl" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-20 bg-gray-300 rounded-2xl" />
                <div className="h-12 w-14 bg-gray-300 rounded-2xl flex items-center gap-2 p-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
}

export default BookCard
