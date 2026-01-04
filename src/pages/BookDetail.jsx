import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import {
  Download, Heart, Share2, BookOpen, Tag, Star, Send, User, Loader2,
  Plus, Eye, MessageCircle, FileText, Play, Pause, Volume2, Clock,
  ChevronLeft
} from 'lucide-react'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchBookAndReviews()
    checkAuth()
  }, [id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const fetchBookAndReviews = async () => {
    setLoading(true)
    try {
      const { data: bookData } = await supabase
        .from('books')
        .select('id, title, author, category, image_url, pdf_url, audio_url, description, details, created_at, trailer_url')
        .eq('id', id)
        .maybeSingle()

      if (!bookData) {
        setBook(null)
        setLoading(false)
        return
      }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('book_id', id)
        .order('created_at', { ascending: false })

      const reviewCount = reviewsData?.length || 0
      const avgRating = reviewCount
        ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
        : 0

      setBook({
        ...bookData,
        review_count: reviewCount,
        average_rating: parseFloat(avgRating)
      })
      setReviews(reviewsData || [])
    } catch (error) {
      console.error('Xato:', error)
    } finally {
      setLoading(false)
    }
  }

  // Audio controls...
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = e.target.value
      setCurrentTime(e.target.value)
    }
  }

  const handleVolumeChange = (e) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = e.target.value
      setVolume(e.target.value)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const goToLogin = () => navigate('/login', { replace: true })
  const downloadPDF = () => book?.pdf_url ? window.open(book.pdf_url, '_blank') : alert('PDF fayl mavjud emas')
  const downloadAudio = () => book?.audio_url ? window.open(book.audio_url, '_blank') : alert('Audio fayl mavjud emas')
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('📎 Havola nusxalandi!')
    } catch {
      alert('Havola ko\'chirildi!')
    }
  }
  const toggleLike = () => setIsLiked(!isLiked)

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Taassurot qoldirish uchun tizimga kiring!')
      goToLogin()
      return
    }

    setSubmittingReview(true)
    try {
      const { error } = await supabase.from('reviews').insert([{
        book_id: id,
        rating,
        comment: comment.trim()
      }])

      if (error) throw error

      setComment('')
      setRating(5)
      setShowReviewForm(false)
      fetchBookAndReviews()
      alert('✅ Taassurotingiz saqlandi!')
    } catch (error) {
      alert('❌ Xato: ' + error.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-gray-600 font-semibold">Kitob yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-sm w-full mx-4">
          <BookOpen className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-black text-gray-500 mb-6">Kitob topilmadi</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-indigo-700 transition-all"
          >
            ← Bosh sahifaga
          </button>
        </div>
      </div>
    )
  }

  const hasAudio = book.audio_url

  return (
    <div className="min-h-screen pt-4 sm:pt-8 lg:pt-16 pb-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* 🔙 MOBILE BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-6 lg:mb-12 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 border hover:border-indigo-200 transition-all duration-300 text-base font-semibold text-gray-800 hover:text-indigo-700"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 group-hover:-translate-x-1 transition-transform" />
          Orqaga
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 🏷️ HEADER - RESPONSIVE */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20">
          {/* Category */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-100/90 backdrop-blur-xl rounded-2xl shadow-lg mx-auto mb-6 max-w-max">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            <span className="font-bold text-sm sm:text-base text-emerald-800">{book.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2 sm:px-4">
            {book.title}
          </h1>

          {/* Author + Rating */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center px-2 sm:px-4 mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4 lg:py-5 rounded-2xl shadow-xl border border-indigo-200/50">
              <p className="text-lg sm:text-2xl lg:text-3xl font-black text-indigo-900 text-center">{book.author}</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 bg-white/95 backdrop-blur-xl p-3 sm:p-5 lg:p-6 rounded-2xl shadow-2xl border border-gray-200/50">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 transition-all ${
                      i < book.average_rating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-lg'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">{book.average_rating}</p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold">({book.review_count} taassurot)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📱 DESKTOP BACK BUTTON */}
        <div className="hidden lg:block mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 border hover:border-indigo-200 transition-all duration-300 text-lg font-semibold text-gray-800 hover:text-indigo-700 max-w-max"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            Orqaga qaytish
          </button>
        </div>

        {/* 🎯 MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 mb-12 lg:mb-20">
          {/* Left: Cover + Actions (3/12 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:space-y-6 lg:sticky lg:top-24 lg:h-fit">
            {/* Cover Image */}
            <div className="group relative bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {book.image_url ? (
                <div className="aspect-[2.5/4] sm:aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2.5/4] sm:aspect-[3/4] bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white/90" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              {hasAudio && (
                <button
                  onClick={downloadAudio}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-sm sm:text-base flex items-center gap-2 justify-center transition-all group"
                >
                  <Download className="w-4 h-4 sm:w-5 group-hover:animate-bounce" />
                  Audio yuklash
                </button>
              )}

              <button
                onClick={downloadPDF}
                disabled={!book.pdf_url}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-sm sm:text-base flex items-center gap-2 justify-center transition-all disabled:opacity-50 group"
              >
                <Download className="w-4 h-4 sm:w-5 group-hover:animate-bounce" />
                PDF yuklash
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyShareLink}
                  className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4 sm:w-5" />
                  Ulashish
                </button>

                <button
                  onClick={toggleLike}
                  className={`p-4 sm:p-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isLiked
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 ${isLiked ? 'fill-rose-400' : ''}`} />
                  {isLiked ? 'Yoqtirdi' : 'Yoqtirish'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Content (9/12 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:space-y-8">
            {/* Trailer */}
              <a
                href={`https://youtube.com/watch?v=${book.trailer_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-200/50 hover:shadow-3xl hover:-translate-y-2 transition-all overflow-hidden"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 group-hover:text-red-600">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 text-red-600 flex-shrink-0" />
                  Video parcha
                </h2>
                <div className="relative aspect-video w-full bg-black/10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={`https://img.youtube.com/vi/${book.trailer_url}/maxresdefault.jpg`}
                    alt="Trailer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 to-transparent flex items-center justify-center">
                    <Play className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-2xl" />
                  </div>
                </div>
              </a>

            {/* Audio Player */}
            {hasAudio && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-purple-200/50">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 flex items-center gap-2 text-purple-900">
                  <Volume2 className="w-6 h-6 sm:w-8 text-purple-600 flex-shrink-0" />
                  Audio Kitob
                </h2>
                
                <audio ref={audioRef} src={book.audio_url} preload="metadata" className="hidden" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center text-purple-600 p-3 transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 sm:w-6" /> : <Play className="w-5 h-5 sm:w-6" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[3.5rem]">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1.5 sm:h-2 bg-purple-200/60 rounded-full overflow-hidden">
                          <input
                            type="range"
                            min="0" max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-full accent-purple-600 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((currentTime / duration) * 100) || 0}%, #e0e7ff 100%)`
                            }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[3.5rem]">{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Volume2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <input
                      type="range"
                      min="0" max="1" step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1.5 sm:h-2 bg-purple-200/60 rounded-full accent-purple-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-200/50">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 flex items-center gap-2 text-gray-900">
                <FileText className="w-6 h-6 sm:w-8 text-indigo-600 flex-shrink-0" />
                Qisqacha mazmun
              </h2>
              <div className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {book.description || 'Bu kitob haqida batafsil ma\'lumot kiritilmagan.'}
              </div>
            </div>

            {book.details && (
              <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-200/50">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-gray-900">Batafsil ma'lumot</h2>
                <div className="text-base sm:text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {book.details}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ⭐ REVIEWS SECTION */}
        <div className="space-y-6 lg:space-y-12">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl p-2 sm:p-3">
              <Star className="w-6 h-6 sm:w-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-amber-900 bg-clip-text text-transparent mb-1 px-1">
                Foydalanuvchi taassurotlari
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-semibold">{reviews.length} ta haqiqiy fikr</p>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50/60 backdrop-blur-xl p-4 sm:p-6 lg:p-6 rounded-3xl shadow-2xl border border-amber-200/50 mb-8 lg:mb-8">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="group flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-amber-800 hover:text-amber-900 mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl hover:bg-amber-100 transition-all shadow-lg border border-amber-200/30 w-full sm:w-auto"
            >
              <Plus className={`w-5 h-5 sm:w-6 transition-transform ${showReviewForm ? 'rotate-45 scale-110' : ''}`} />
              <span>{showReviewForm ? 'Bekor qilish' : 'Yangi taassurot'}</span>
            </button>

            {showReviewForm && user ? (
              <form onSubmit={submitReview} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/30">
                  <label className="text-lg font-bold text-gray-800 whitespace-nowrap min-w-[6rem]">Reyting:</label>
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className={`p-2 sm:p-3 rounded-xl shadow-lg transition-all w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center ${
                          rating >= i + 1
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-amber-500/50 scale-105'
                            : 'bg-gray-200 text-gray-500 hover:from-amber-100 hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        <Star className="w-5 h-5 sm:w-6" />
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-black text-gray-900">{rating}</p>
                    <p className="text-sm text-gray-600">/ 5 yulduz</p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Kitob haqida fikringizni yozing..."
                    rows="3"
                    maxLength="1000"
                    className="w-full p-4 sm:p-6 border-2 border-gray-200/50 rounded-2xl text-base sm:text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 resize-vertical shadow-xl backdrop-blur-xl bg-white/80"
                  />
                  <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-xl shadow-lg">
                    <span className={`text-sm font-semibold ${comment.length > 900 ? 'text-red-500' : 'text-gray-600'}`}>
                      {comment.length}/1000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview || (!comment.trim() && rating < 5)}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 sm:py-6 px-6 sm:px-8 rounded-2xl text-lg sm:text-xl font-bold shadow-3xl hover:shadow-4xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
                >
                  {submittingReview ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 sm:w-6" />
                      <span>Taassurotni e'lon qilish</span>
                    </>
                  )}
                </button>
              </form>
            ) : showReviewForm ? (
              <div className="text-center py-12 px-4">
                <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">Tizimga kiring!</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-md mx-auto">
                  Taassurot qoldirish uchun hisobingizga kiring
                </p>
                <button
                  onClick={goToLogin}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
                >
                  Tizimga kirish →
                </button>
              </div>
            ) : null}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 lg:space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 px-4">
                <Star className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl sm:text-3xl font-black text-gray-400 mb-4">Hali taassurot yo'q</h3>
                <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto mb-8">
                  Siz birinchi bo'lib fikringizni bildirsangiz, boshqa o'quvchilar uchun foydali bo'ladi!
                </p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4 sm:w-5" />
                  Birinchi taassurot
                </button>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="group bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all border border-gray-200/30 hover:border-amber-200/50 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                    <div className="flex items-center gap-1 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg flex-shrink-0 order-2 lg:order-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 transition-all ${
                            i < review.rating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-lg'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex-1 min-w-0 order-1 lg:order-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105">
                          <User className="w-5 h-5 sm:w-6 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-amber-600 mb-1">
                            Foydalanuvchi
                          </p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 font-semibold">
                            <span>{new Date(review.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="sm:ml-4">{review.rating}/5 yulduz</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <div className="ml-0 lg:ml-16 pl-0 lg:pl-6 border-l-0 lg:border-l-3 border-amber-300/60 pt-2 lg:pt-4">
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium italic">
                        "{review.comment}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
