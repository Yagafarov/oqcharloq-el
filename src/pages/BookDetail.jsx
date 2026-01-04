import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { 
  Download, Heart, Share2, BookOpen, Tag, Star, Send, User, Loader2, 
  Plus, Eye, MessageCircle, FileText, Play, Clock 
} from 'lucide-react'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Auth + Review states
  const [user, setUser] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)



  useEffect(() => {
    fetchBookAndReviews()
    checkAuth()
  }, [id])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const fetchBookAndReviews = async () => {
    setLoading(true)
    try {
      const { data: bookData } = await supabase
        .from('books')
        .select('id, title, author, category, image_url, pdf_url, description, details, created_at, trailer_url')
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

  const goToLogin = () => {
    navigate('/login', { replace: true })
  }

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

  const downloadPDF = () => {
    if (book?.pdf_url) {
      window.open(book.pdf_url, '_blank')
    } else {
      alert('PDF fayl mavjud emas')
    }
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('📎 Havola nusxalandi!')
    } catch {
      alert('Havola ko\'chirildi!')
    }
  }

  const toggleLike = () => setIsLiked(!isLiked)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8" />
          <p className="text-xl text-gray-600 font-semibold">Kitob yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4">
          <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-8 animate-pulse" />
          <h1 className="text-3xl font-black text-gray-500 mb-6">Kitob topilmadi</h1>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all"
          >
            ← Bosh sahifaga
          </button>
        </div>
      </div>
    )
  }
  


  return (
    <div className="min-h-screen pt-16 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* 🏷️ HEADER */}
      <div className="text-center mb-12 lg:mb-20">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-emerald-100/80 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl mx-auto mb-6 sm:mb-8 backdrop-blur-xl shadow-lg max-w-max">
          <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
          <span className="font-bold text-lg sm:text-xl text-emerald-800">{book.category}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-4">
          {book.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center mb-8 sm:mb-12 px-4">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl px-6 sm:px-10 py-4 sm:py-6 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-200/50">
            <p className="text-xl sm:text-3xl lg:text-4xl font-black text-indigo-900 text-center">{book.author}</p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 bg-white/90 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-all ${
                    i < book.average_rating 
                      ? 'text-amber-400 fill-amber-400 drop-shadow-lg' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <div className="text-center sm:text-left min-w-0">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">{book.average_rating}</p>
              <p className="text-lg sm:text-xl text-gray-600 font-semibold">({book.review_count} taassurot)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 lg:mb-24 max-w-6xl mx-auto">
        {/* 📚 CHAP: Cover + Actions */}
        <div className="space-y-6 lg:space-y-8 lg:sticky lg:top-24 lg:h-fit">
          <div className="group relative bg-white/90 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {book.image_url ? (
              <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all">
                <img 
                  src={book.image_url} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
                <BookOpen className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 text-white/90" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={downloadPDF}
              disabled={!book.pdf_url}
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 font-black text-lg sm:text-xl flex items-center gap-3 sm:gap-4 justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Download className="w-7 h-7 sm:w-9 sm:h-9 group-hover:animate-bounce" />
              <span>PDF Yuklash</span>
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={copyShareLink}
                className="p-6 sm:p-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
              >
                <Share2 className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
                <span>Ulashish</span>
              </button>
              
              <button
                onClick={toggleLike}
                className={`p-6 sm:p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all ${
                  isLiked 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-pink-50 hover:to-rose-50'
                }`}
              >
                <Heart className={`w-6 h-6 sm:w-8 sm:h-8 ${isLiked ? 'fill-rose-400' : ''}`} />
                <span>{isLiked ? 'Yoqtirdi' : 'Yoqtirish'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 📝 O'NG: Content */}
        <div className="space-y-6 lg:space-y-8 lg:pt-4">
          {/* 🎥 YOUTUBE TRAILER - THUMBNAIL + CLICK (DNS FIX) */}
            <a 
              href={`https://youtube.com/watch?v=${book.trailer_url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-200/50 hover:shadow-3xl hover:-translate-y-2 transition-all group overflow-hidden"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 flex items-center gap-3 sm:gap-4 text-gray-900 group-hover:text-red-600 transition-colors">
                <Play className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                Rasmiy treyler
              </h2>
              <div className="relative aspect-video w-full bg-black/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={`https://img.youtube.com/vi/${book.trailer_url}/maxresdefault.jpg`} 
                  alt="Trailer thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-red-800/30 flex items-center justify-center">
                  <Play className="w-24 h-24 text-white drop-shadow-2xl group-hover:scale-110 transition-all" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm font-bold">
                  YANGI Oyna ochish →
                </div>
              </div>
            </a>

          {/* 📄 Description */}
          <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-200/50">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 flex items-center gap-3 sm:gap-4 text-gray-900">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-indigo-600 flex-shrink-0" />
              Qisqacha mazmun
            </h2>
            <div className="prose prose-lg sm:prose-xl max-w-none text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              {book.description || 'Bu kitob haqida batafsil ma\'lumot kiritilmagan.'}
            </div>
          </div>

          {book.details && (
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-200/50">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 text-gray-900">Batafsil ma'lumot</h2>
              <div className="text-lg sm:text-xl lg:text-2xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                {book.details}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ REVIEWS SECTION */}
      <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl p-2 sm:p-3 lg:p-4 flex-shrink-0">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-gray-900 to-amber-900 bg-clip-text text-transparent mb-2 px-2">
              Foydalanuvchi taassurotlari
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 font-semibold">{reviews.length} ta haqiqiy fikr</p>
          </div>
        </div>

        {/* ➕ ADD REVIEW FORM */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-amber-200/50 mb-8 lg:mb-12">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="group flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl lg:text-3xl font-black text-amber-800 hover:text-amber-900 mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:bg-amber-100/50 backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-amber-200/30 w-full sm:w-auto"
          >
            <Plus className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-transform ${showReviewForm ? 'rotate-45 scale-110' : ''}`} />
            <span>{showReviewForm ? 'Bekor qilish' : 'Yangi taassurot qoldirish +'}</span>
          </button>

          {showReviewForm && user ? (
            <form onSubmit={submitReview} className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/30">
                <label className="text-xl sm:text-2xl font-black text-gray-800 whitespace-nowrap flex-shrink-0 min-w-[5rem] sm:min-w-[8rem]">
                  Reytingingiz:
                </label>
                <div className="flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className={`relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group/like ${
                        rating >= i + 1
                          ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white shadow-amber-500/50 scale-110 ring-4 ring-amber-200/50'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 hover:from-amber-100 hover:to-orange-100 hover:text-amber-600 hover:scale-105 hover:shadow-xl'
                      }`}
                    >
                      <Star className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
                    </button>
                  ))}
                </div>
                <div className="text-center sm:ml-6 sm:text-left">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">{rating}</p>
                  <p className="text-lg sm:text-xl text-gray-600 font-semibold">/ 5 yulduz</p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Kitob haqida fikringizni yozing... (ixtiyoriy)"
                  rows="4"
                  maxLength="1000"
                  className="w-full p-6 sm:p-8 border-2 border-gray-200/50 rounded-3xl text-lg sm:text-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 resize-vertical shadow-xl backdrop-blur-xl bg-white/70 transition-all placeholder-gray-500"
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl shadow-lg">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <span className={`text-lg font-semibold ${comment.length > 900 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                    {comment.length}/1000
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingReview || (!comment.trim() && rating < 5)}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white py-6 sm:py-8 px-8 sm:px-12 rounded-3xl text-xl sm:text-2xl lg:text-3xl font-black shadow-3xl hover:shadow-4xl hover:-translate-y-2 transition-all duration-500 flex items-center gap-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin" />
                    <span className="tracking-wide">Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 group-hover:translate-x-2 transition-transform" />
                    <span>Taassurotni e'lon qilish</span>
                  </>
                )}
              </button>
            </form>
          ) : showReviewForm ? (
            <div className="text-center py-16 px-4">
              <User className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-black text-gray-700 mb-4">Tizimga kiring!</h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Taassurot qoldirish uchun hisobingizga kiring
              </p>
              <button 
                onClick={goToLogin}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 sm:px-12 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
              >
                Tizimga kirish →
              </button>
            </div>
          ) : null}
        </div>

        {/* 📋 REVIEWS LIST */}
        <div className="space-y-6 lg:space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-20 sm:py-32 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 px-4">
              <Star className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-gray-300 mx-auto mb-8 sm:mb-12 animate-pulse" />
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-400 mb-4 sm:mb-6">Hali taassurot yo'q</h3>
              <p className="text-lg sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-12">
                Siz birinchi bo'lib fikringizni bildirsangiz, boshqa o'quvchilar uchun foydali bo'ladi!
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-8 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                Birinchi taassurot
              </button>
            </div>
          ) : (
            reviews.map((review) => (
              <div 
                key={review.id}
                className="group bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200/30 hover:border-amber-200/50 hover:-translate-y-2"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 mb-6 lg:mb-8">
                  <div className="flex items-center gap-1 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl mt-1 flex-shrink-0 order-2 lg:order-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-all ${
                          i < review.rating 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-lg shadow-amber-500/25' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>

                  <div className="flex-1 min-w-0 order-1 lg:order-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        <User className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 truncate group-hover:text-amber-600 transition-colors mb-1 sm:mb-2">
                          Foydalanuvchi
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 font-semibold">
                          <span className="whitespace-nowrap">
                            {new Date(review.created_at).toLocaleDateString('uz-UZ', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <div className="w-px h-5 sm:h-6 bg-gray-300 hidden sm:block" />
                          <span className="whitespace-nowrap">{review.rating}/5 yulduz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <div className="ml-0 lg:ml-20 pl-0 lg:pl-8 border-l-0 lg:border-l-4 border-amber-300/60">
                    <p className="text-lg sm:text-2xl lg:text-3xl text-gray-700 leading-relaxed font-medium italic group-hover:text-gray-900 transition-colors">
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
  )
}
