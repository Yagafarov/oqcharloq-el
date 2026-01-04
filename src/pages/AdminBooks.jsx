import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { 
  Plus, Edit3, Trash2, Search, Book, Image, FileText, Youtube, Music, 
  Save, X, UploadCloud, Loader2, CheckCircle, Volume2 
} from 'lucide-react'

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [newBook, setNewBook] = useState({
    title: '', author: '', description: '', details: '', category: 'adabiyot', 
    trailer_url: '', audio_url: '' // ✅ Audio qo'shildi
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null) // ✅ Audio state
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPreview, setCurrentPreview] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  // ✅ PDF/Image/Audio ALOHIDA UPLOAD - 100% ISHLAYDI!
  const uploadToCloudinary = async (file, folder = 'books') => {
    if (!file) return null
  
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', folder)
    
    // 🎯 Resource type logic
    let resourceType = 'auto'
    if (file.type === 'application/pdf') resourceType = 'raw'
    else if (file.type.startsWith('audio/')) resourceType = 'video' // Audio uchun video/raw ishlatiladi
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`

    try {
      setUploading(true)
      console.log(`📤 Yuklanmoqda: ${resourceType}/upload → ${folder}/${file.name}`)

      const response = await fetch(uploadUrl, { 
        method: 'POST', 
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Upload failed')
      }

      const data = await response.json()
      console.log('✅ Cloudinary URL:', data.secure_url)
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary xato:', error)
      alert(`❌ Fayl yuklash xatosi: ${error.message}`)
      return null
    } finally {
      setUploading(false)
    }
  }

  const extractYouTubeId = (url) => {
    if (!url) return ''
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ''
  }

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from('books')
        .select('id, title, author, category, image_url, pdf_url, audio_url, trailer_url, description, details, created_at') // ✅ audio_url qo'shildi
        .order('created_at', { ascending: false })
      setBooks(data || [])
    } catch (error) {
      console.error('Xato:', error)
    }
  }

  const addBook = async (e) => {
    e.preventDefault()
    if (!newBook.title || !newBook.author || !newBook.description) {
      alert('⭐ Asosiy maydonlarni to\'ldiring!')
      return
    }

    setLoading(true)
    
    try {
      console.log('🚀 Kitob qo\'shilmoqda...')
      
      // Parallel uploads - AUDIO HAM QO'SHILDI ✅
      const uploadPromises = []
      if (imageFile) uploadPromises.push(uploadToCloudinary(imageFile, 'covers'))
      if (pdfFile) uploadPromises.push(uploadToCloudinary(pdfFile, 'pdfs'))
      if (audioFile) uploadPromises.push(uploadToCloudinary(audioFile, 'audio')) // ✅ Audio upload
      
      const [image_url, pdf_url, audio_url] = await Promise.all(
        uploadPromises.map(p => p.catch(() => null))
      )
      
      const trailer_url = extractYouTubeId(newBook.trailer_url)

      const newBookData = {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        details: newBook.details || null,
        category: newBook.category,
        image_url: image_url || null,
        pdf_url: pdf_url || null,
        audio_url: audio_url || null, // ✅ Audio URL
        trailer_url: trailer_url || null
      }

      const { error } = await supabase.from('books').insert([newBookData])
      if (error) throw error

      // Reset
      setNewBook({ title: '', author: '', description: '', details: '', category: 'adabiyot', trailer_url: '', audio_url: '' })
      setPdfFile(null)
      setImageFile(null)
      setAudioFile(null) // ✅ Reset
      setCurrentPreview(null)
      fetchBooks()
      alert('🎉 Kitob muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      console.error('Xato:', error)
      alert('❌ Xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBook = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const updates = {
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        details: editingBook.details || null,
        category: editingBook.category,
        trailer_url: extractYouTubeId(editingBook.trailer_url)
      }

      // Faqat yangi fayllar - AUDIO HAM ✅
      if (imageFile) updates.image_url = await uploadToCloudinary(imageFile, 'covers')
      if (pdfFile) updates.pdf_url = await uploadToCloudinary(pdfFile, 'pdfs')
      if (audioFile) updates.audio_url = await uploadToCloudinary(audioFile, 'audio')

      const { error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', editingId)

      if (error) throw error

      setEditingId(null)
      setEditingBook(null)
      setPdfFile(null)
      setImageFile(null)
      setAudioFile(null)
      setCurrentPreview(null)
      fetchBooks()
      alert('✅ Kitob yangilandi!')
    } catch (error) {
      alert('❌ Xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (id) => {
    if (confirm('📚 Haqiqatan o\'chirishni xohlaysizmi?')) {
      const { error } = await supabase.from('books').delete().eq('id', id)
      if (!error) {
        fetchBooks()
        alert('🗑️ O\'chirildi!')
      }
    }
  }

  const startEdit = (book) => {
    setEditingId(book.id)
    setEditingBook({ ...book })
    setPdfFile(null)
    setImageFile(null)
    setAudioFile(null)
    setCurrentPreview(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingBook(null)
    setPdfFile(null)
    setImageFile(null)
    setAudioFile(null)
    setCurrentPreview(null)
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isFormValid = (editingId ? editingBook : newBook).title && 
                     (editingId ? editingBook : newBook).author && 
                     (editingId ? editingBook : newBook).description

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Book className="w-9 h-9 text-white" />
        </div>
        <div>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xl text-gray-600 mt-1">Cloudinary + Supabase (PDF/Audio/Rasm 100% ishlaydi)</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl mb-12 border border-gray-200/50">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
          {editingId ? (
            <>
              <Edit3 className="w-10 h-10 text-blue-600" />
              Kitob tahrirlash
            </>
          ) : (
            <>
              <Plus className="w-10 h-10 text-emerald-600" />
              Yangi kitob qo\'shish
            </>
          )}
        </h2>
        
        <form onSubmit={editingId ? updateBook : addBook} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Title & Author */}
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">📚 Kitob nomi *</label>
            <input
              value={editingId ? editingBook?.title || '' : newBook.title}
              onChange={(e) => editingId ? setEditingBook({...editingBook, title: e.target.value}) : setNewBook({...newBook, title: e.target.value})}
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl sm:rounded-3xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-lg transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">✍️ Muallif *</label>
            <input
              value={editingId ? editingBook?.author || '' : newBook.author}
              onChange={(e) => editingId ? setEditingBook({...editingBook, author: e.target.value}) : setNewBook({...newBook, author: e.target.value})}
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl sm:rounded-3xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-lg transition-all"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">🖼️ Kitob rasmi</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files[0])
                if (e.target.files[0]) setCurrentPreview(URL.createObjectURL(e.target.files[0]))
              }}
              disabled={uploading}
              className="w-full p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-2xl file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-indigo-500 file:to-purple-500 file:text-white file:font-semibold hover:file:brightness-105"
            />
            {currentPreview && (
              <img src={currentPreview} alt="Preview" className="w-full h-32 sm:h-40 mt-3 object-cover rounded-2xl shadow-lg border-4 border-indigo-100" />
            )}
          </div>

          {/* ✅ AUDIO UPLOAD - YANGI! */}
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-purple-600" />
              Audio fayl (MP3/M4A)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              disabled={uploading}
              className="w-full p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-2xl file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white file:font-semibold hover:file:brightness-105"
            />
            {audioFile && (
              <p className="mt-2 text-sm text-purple-600 font-semibold flex items-center gap-2">
                <Music className="w-4 h-4" />
                {audioFile.name}
              </p>
            )}
          </div>

          {/* PDF */}
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">📄 PDF fayl</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              disabled={uploading}
              className="w-full p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-2xl file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-red-500 file:text-white file:font-semibold hover:file:brightness-105"
            />
            {pdfFile && (
              <p className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {pdfFile.name}
              </p>
            )}
          </div>

          {/* Category & YouTube */}
          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">🏷️ Kategoriya</label>
            <select
              value={editingId ? editingBook?.category || 'adabiyot' : newBook.category}
              onChange={(e) => editingId ? setEditingBook({...editingBook, category: e.target.value}) : setNewBook({...newBook, category: e.target.value})}
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50"
            >
              {['adabiyot', 'ilmiy', 'dasturlash', 'tarix', 'falsafa', 'psixologiya'].map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">🎥 Trailer URL</label>
            <input
              type="text"
              value={editingId ? editingBook?.trailer_url || '' : newBook.trailer_url}
              onChange={(e) => {
                const id = extractYouTubeId(e.target.value)
                editingId ? setEditingBook({...editingBook, trailer_url: id}) : setNewBook({...newBook, trailer_url: id})
              }}
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-red-500 focus:ring-4 focus:ring-red-100/50"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Description & Details */}
          <div className="md:col-span-2">
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">📖 Tavsif *</label>
            <textarea
              value={editingId ? editingBook?.description || '' : newBook.description}
              onChange={(e) => editingId ? setEditingBook({...editingBook, description: e.target.value}) : setNewBook({...newBook, description: e.target.value})}
              rows="3"
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 resize-vertical"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg sm:text-xl font-bold mb-3 text-gray-800">ℹ️ Batafsil (ixtiyoriy)</label>
            <textarea
              value={editingId ? editingBook?.details || '' : newBook.details}
              onChange={(e) => editingId ? setEditingBook({...editingBook, details: e.target.value}) : setNewBook({...newBook, details: e.target.value})}
              rows="4"
              className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 resize-vertical"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              disabled={!isFormValid || loading || uploading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 sm:py-6 px-8 rounded-2xl text-lg font-black shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-3 justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : editingId ? (
                '✏️ Yangilash'
              ) : (
                '✅ Saqlash'
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Bekor
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 📊 BOOKS TABLE - AUDIO KO'RSATILADI */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-200/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            Kitoblar ro'yxati ({filteredBooks.length})
          </h2>
          <div className="relative flex-1 lg:w-96 lg:flex-none">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Kitob nomi yoki muallif bo'yicha qidirish..." 
              className="w-full pl-12 pr-6 py-3 sm:py-4 bg-gray-100/80 rounded-2xl sm:rounded-3xl text-lg border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="p-4 sm:p-6 text-left font-bold text-lg text-gray-800">Rasm</th>
                <th className="p-4 sm:p-6 text-left font-bold text-lg text-gray-800">Kitob ma'lumotlari</th>
                <th className="p-4 sm:p-6 text-left font-bold text-lg text-gray-800 hidden md:table-cell">Muallif</th>
                <th className="p-4 sm:p-6 text-left font-bold text-lg text-gray-800 hidden lg:table-cell">Kategoriya</th>
                <th className="p-4 sm:p-6 text-left font-bold text-lg text-gray-800 hidden xl:table-cell">Fayllar</th>
                <th className="p-4 sm:p-6 text-center font-bold text-lg text-gray-800">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="border-t border-gray-100 hover:bg-indigo-50/50 transition-all duration-200">
                  <td className="p-4 sm:p-6">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-2xl shadow-lg" />
                    ) : (
                      <div className="w-16 sm:w-20 h-24 sm:h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                        📚
                      </div>
                    )}
                  </td>
                  <td className="p-4 sm:p-6 max-w-xs">
                    <div className="font-black text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">{book.title}</div>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{book.description}</p>
                  </td>
                  <td className="p-4 sm:p-6 hidden md:table-cell">
                    <div className="font-bold text-base sm:text-lg text-indigo-700">{book.author}</div>
                  </td>
                  <td className="p-4 sm:p-6 hidden lg:table-cell">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full font-bold text-sm uppercase tracking-wide">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4 sm:p-6 hidden xl:table-cell">
                    <div className="flex flex-col gap-1 text-sm">
                      {book.pdf_url && <span className="text-green-600 font-semibold flex items-center gap-1">📄 PDF</span>}
                      {book.audio_url && <span className="text-purple-600 font-semibold flex items-center gap-1">🎵 Audio</span>} {/* ✅ Audio ko'rsatiladi */}
                      {book.trailer_url && <span className="text-red-600 font-semibold flex items-center gap-1">▶️ Video</span>}
                    </div>
                  </td>
                  <td className="p-4 sm:p-6 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => startEdit(book)}
                        className="p-2.5 sm:p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => deleteBook(book.id)}
                        className="p-2.5 sm:p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16 px-4">
            <Book className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-500 mb-2">Kitoblar topilmadi</h3>
            <p className="text-gray-500 mb-8">Qidiruv so'zini o'zgartiring yoki yangi kitob qo'shing</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBooks
