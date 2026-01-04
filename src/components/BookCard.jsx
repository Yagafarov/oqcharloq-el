import { useNavigate } from 'react-router-dom'
import { Download, Play, Star, Heart } from 'lucide-react'
import { useState } from 'react'

function BookCard({ book, delay = 0 }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleClick = (e) => {
    if (!e.target.closest('.like-btn') && !e.target.closest('.pdf-btn')) {
      navigate(`/books/${book.id}`)
    }
  }

  const toggleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handlePDF = (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = book.pdf_url
    link.download = `${book.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Cloudinary image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/300x400/6b7280/f8fafc?text=${encodeURIComponent(book.title.slice(0,15))}`
    
    // Cloudinarydan kelgan URL ni optimize qilish
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/w_300,h_400,c_fill,q_auto,f_auto/')
    }
    return imageUrl
  }

  return (
    <div 
      className="group relative bg-gradient-to-br from-white/95 to-indigo-50/50 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl/75 border border-white/70 hover:border-indigo-200/80 hover:bg-white/100 active:scale-[0.98] transition-all duration-700 overflow-hidden cursor-pointer max-h-[28rem]"
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover */}
      <div className="relative h-72 p-8 flex items-center justify-center z-10">
        <div className={`relative w-36 h-52 bg-gradient-to-br rounded-3xl shadow-2xl border-4 border-white/80 backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden ${
          isHovered ? 'from-indigo-400/40 shadow-indigo-500/40 ring-2 ring-indigo-200/50' : 'from-indigo-200/60 shadow-indigo-200/60'
        }`}>
          <img 
            src={getImageUrl(book.image_url)} 
            alt={book.title}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-8 pb-12 z-20">
        <h3 className="font-black text-2xl leading-tight mb-4 text-gray-900 group-hover:text-indigo-900 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-lg text-gray-600 mb-6 line-clamp-3">{book.description}</p>
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100/50">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg" />
          <span className="text-base font-bold text-indigo-800 uppercase tracking-wide">{book.author}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-6 py-3 rounded-2xl text-sm font-bold border shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap">
              O'qish
            </span>
            
            {book.pdf_url && (
              <button className="pdf-btn group/pdf bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-6 py-3 rounded-2xl text-sm font-bold border shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                      onClick={handlePDF}>
                <Download className="w-4 h-4 group-hover:translate-y-[-1px]" />
                PDF
              </button>
            )}
            
            {book.youtube_url && (
              <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-6 py-3 rounded-2xl text-sm font-bold border shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                Video
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-2xl shadow-md border">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-lg">4.8</span>
            </div>
            
            <button className={`like-btn p-4 rounded-2xl bg-white/80 shadow-lg hover:shadow-xl border transition-all flex items-center gap-2 group/like relative overflow-hidden ${
              isLiked ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' : 'hover:bg-gray-50 text-gray-700'
            }`} onClick={toggleLike}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current scale-110' : 'group-hover/like:scale-110'}`} />
              <span className="font-bold text-sm">42</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-white via-white/90 to-transparent" />
    </div>
  )
}

export default BookCard
