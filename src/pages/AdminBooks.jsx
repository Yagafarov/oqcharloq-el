import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Plus, Edit3, Trash2, Search, Upload, Book, Image, FileText, Youtube, Save, X } from 'lucide-react'

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    details: '',
    category: 'adabiyot',
    youtube_url: ''
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchBooks()
  }, [])

  // YouTube URL dan video ID ajratish
  const extractYouTubeId = (url) => {
    if (!url) return ''
    try {
      // https://youtu.be/DOkXgU-_cKU?si=...
      if (url.includes('youtu.be/')) {
        const u = new URL(url.includes('?') ? url.split('?')[0] : url)
        return u.pathname.slice(1)
      }
      // https://www.youtube.com/watch?v=DOkXgU-_cKU&...
      if (url.includes('youtube.com/watch?v=')) {
        const u = new URL(url)
        return u.searchParams.get('v') || ''
      }
      return url // Agar ID bo'lsa
    } catch {
      return url
    }
  }

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
      setBooks(data || [])
    } catch (error) {
      console.error('Kitoblar yuklashda xato:', error)
    }
  }

  // Fayl yuklash
  const uploadFile = async (file, folder) => {
    if (!file) return null
    setUploading(true)
    setUploadProgress(0)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

      const { data, error } = await supabase.storage
        .from('books')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Fayl yuklashda xato:', error)
      alert('Fayl yuklashda xato yuz berdi!')
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const addBook = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // YouTube ID ajratish
      const youtube_id = extractYouTubeId(newBook.youtube_url)

      // Fayllarni yuklash
      const pdf_url = await uploadFile(pdfFile, 'pdfs')
      const image_url = await uploadFile(imageFile, 'covers')

      const bookData = {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        details: newBook.details,
        category: newBook.category,
        youtube_url: youtube_id,
        pdf_url: pdf_url,
        image_url: image_url
      }

      const { error } = await supabase.from('books').insert([bookData])
      if (error) throw error

      // Formani tozalash
      setNewBook({
        title: '', author: '', description: '', details: '',
        category: 'adabiyot', youtube_url: ''
      })
      setPdfFile(null)
      setImageFile(null)
      fetchBooks()

      alert('✅ Kitob muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      console.error('Xato:', error)
      alert('❌ Kitob qo\'shishda xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBook = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const youtube_id = extractYouTubeId(editingBook.youtube_url)
      const pdf_url = editingBook.pdf_url || (await uploadFile(pdfFile, 'pdfs'))
      const image_url = editingBook.image_url || (await uploadFile(imageFile, 'covers'))

      const bookData = {
        ...editingBook,
        youtube_url: youtube_id,
        pdf_url,
        image_url
      }

      const { error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', editingId)

      if (error) throw error

      setEditingId(null)
      setEditingBook(null)
      setPdfFile(null)
      setImageFile(null)
      fetchBooks()

      alert('✅ Kitob muvaffaqiyatli yangilandi!')
    } catch (error) {
      console.error('Xato:', error)
      alert('❌ Yangilashda xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (id) => {
    if (confirm('🗑️ Bu kitobni o\'chirishni xohlaysizmi?')) {
      try {
        await supabase.from('books').delete().eq('id', id)
        fetchBooks()
        alert('✅ Kitob o\'chirildi!')
      } catch (error) {
        alert('❌ O\'chirishda xato!')
      }
    }
  }

  const startEdit = (book) => {
    setEditingId(book.id)
    setEditingBook({ ...book })
    setPdfFile(null)
    setImageFile(null)
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = ['adabiyot', 'ilmiy', 'dasturlash', 'tarix', 'falsafa', 'psixologiya', 'chegara']

  return (
    <div className="pt-24 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <Book className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent">
            Kitoblar boshqaruvi
          </h1>
          <p className="text-xl text-gray-600 mt-2">Rasmlar, PDF va YouTube videolarini yuklang</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200/50 mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-10 flex items-center gap-3">
          {editingId ? (
            <>
              <Edit3 className="w-8 h-8 text-blue-600" />
              Kitobni tahrirlash
            </>
          ) : (
            <>
              <Plus className="w-8 h-8 text-emerald-600" />
              Yangi kitob qo'shish
            </>
          )}
        </h2>

        <form onSubmit={editingId ? updateBook : addBook} className="grid md:grid-cols-2 gap-8">
          {/* Asosiy ma'lumotlar */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4">📚 Kitob nomi *</label>
            <input
              type="text"
              value={editingId ? editingBook?.title || '' : newBook.title}
              onChange={(e) => editingId 
                ? setEditingBook({...editingBook, title: e.target.value})
                : setNewBook({...newBook, title: e.target.value})
              }
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-lg hover:shadow-xl"
              placeholder="Kitob nomini kiriting..."
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4">✍️ Muallif *</label>
            <input
              type="text"
              value={editingId ? editingBook?.author || '' : newBook.author}
              onChange={(e) => editingId 
                ? setEditingBook({...editingBook, author: e.target.value})
                : setNewBook({...newBook, author: e.target.value})
              }
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-lg hover:shadow-xl"
              placeholder="Muallif ismini kiriting..."
              required
            />
          </div>

          {/* Rasm yuklash */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              🖼️ Kitob rasmi
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  if (editingId) setEditingBook({...editingBook, image_url: file})
                  else setImageFile(file)
                }
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:text-xl file:font-bold file:bg-gradient-to-r file:from-emerald-100 file:to-green-100 file:text-emerald-800 hover:file:from-emerald-200 hover:file:to-green-200 transition-all shadow-lg hover:shadow-xl"
            />
          </div>

          {/* PDF yuklash */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              📄 PDF fayl
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  if (editingId) setEditingBook({...editingBook, pdf_url: file})
                  else setPdfFile(file)
                }
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:text-xl file:font-bold file:bg-gradient-to-r file:from-orange-100 file:to-red-100 file:text-orange-800 hover:file:from-orange-200 hover:file:to-red-200 transition-all shadow-lg hover:shadow-xl"
            />
            {pdfFile && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
            )}
          </div>

          {/* Kategoriya va YouTube */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4">🏷️ Kategoriya</label>
            <select
              value={editingId ? editingBook?.category || 'adabiyot' : newBook.category}
              onChange={(e) => editingId 
                ? setEditingBook({...editingBook, category: e.target.value})
                : setNewBook({...newBook, category: e.target.value})
              }
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-lg hover:shadow-xl"
            >
              {['adabiyot', 'ilmiy', 'dasturlash', 'tarix', 'falsafa', 'psixologiya', 'chegara'].map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              ▶️ YouTube havola yoki ID
            </label>
            <input
              type="text"
              value={editingId ? editingBook?.youtube_url || '' : newBook.youtube_url}
              onChange={(e) => {
                const id = extractYouTubeId(e.target.value)
                if (editingId) setEditingBook({...editingBook, youtube_url: id})
                else setNewBook({...newBook, youtube_url: id})
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100/50 transition-all shadow-lg hover:shadow-xl"
              placeholder="https://youtube.com/watch?v=DOkXgU-_cKU yoki DOkXgU-_cKU"
            />
          </div>

          {/* Tavsiflar */}
          <div className="md:col-span-2">
            <label className="block text-xl font-bold text-gray-800 mb-4">📝 Qisqacha tavsif *</label>
            <textarea
              value={editingId ? editingBook?.description || '' : newBook.description}
              onChange={(e) => editingId 
                ? setEditingBook({...editingBook, description: e.target.value})
                : setNewBook({...newBook, description: e.target.value})
              }
              rows="3"
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all resize-vertical shadow-lg hover:shadow-xl"
              placeholder="Kitob haqida qisqacha ma'lumot..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xl font-bold text-gray-800 mb-4">📚 Batafsil ma'lumot</label>
            <textarea
              value={editingId ? editingBook?.details || '' : newBook.details}
              onChange={(e) => editingId 
                ? setEditingBook({...editingBook, details: e.target.value})
                : setNewBook({...newBook, details: e.target.value})
              }
              rows="5"
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all resize-vertical shadow-lg hover:shadow-xl"
              placeholder="Kitob haqida batafsil ma'lumot..."
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-6 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 justify-center h-16"
            >
              {uploading && (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
              )}
              {loading || uploading ? (
                'Saqlanmoqda...'
              ) : editingId ? (
                <>
                  <Save className="w-6 h-6" />
                  Yangilash
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Kitob qo'shish
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setEditingBook(null)
                  setPdfFile(null)
                  setImageFile(null)
                }}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-6 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 justify-center h-16"
              >
                <X className="w-6 h-6" />
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="p-8 border-b border-gray-200/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                Mavjud kitoblar ({filteredBooks.length})
              </h2>
              <p className="text-lg text-gray-600 mt-1">
                Jami: {books.length} ta kitob
              </p>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-2xl flex-1 lg:flex-none">
                <Search className="w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Kitob nomi yoki muallif bo'yicha qidirish..." 
                  className="bg-transparent outline-none text-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="p-6 text-left text-xl font-bold text-gray-800">Rasm</th>
                <th className="p-6 text-left text-xl font-bold text-gray-800">Kitob & Tavsif</th>
                <th className="p-6 text-left text-xl font-bold text-gray-800">Muallif</th>
                <th className="p-6 text-left text-xl font-bold text-gray-800">Kategoriya</th>
                <th className="p-6 text-left text-xl font-bold text-gray-800">PDF / YouTube</th>
                <th className="p-6 text-center text-xl font-bold text-gray-800 w-32">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-t border-gray-200/30 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300">
                  <td className="p-6">
                    {book.image_url ? (
                      <img 
                        src={book.image_url} 
                        alt={book.title} 
                        className="w-20 h-28 object-cover rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all cursor-pointer"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg hidden">
                        📖
                      </div>
                    )}
                  </td>
                  <td className="p-6 max-w-lg">
                    <div className="font-black text-xl text-gray-900 mb-2 line-clamp-1">{book.title}</div>
                    <p className="text-gray-600 text-base leading-relaxed line-clamp-2">{book.description}</p>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-lg bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-xl inline-block">
                      {book.author}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-bold rounded-xl">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="space-y-2">
                      {book.pdf_url ? (
                        <a 
                          href={book.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 hover:from-emerald-200 hover:to-green-200 rounded-xl font-semibold hover:shadow-md transition-all text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          PDF ({(new URL(book.pdf_url).pathname.split('/').pop().length > 20 ? '...' : 'mavjud')})
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">PDF yo'q</span>
                      )}
                      {book.youtube_url ? (
                        <a 
                          href={`https://youtube.com/watch?v=${book.youtube_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 rounded-xl font-semibold hover:shadow-md transition-all text-sm"
                        >
                          <Youtube className="w-4 h-4" />
                          Video
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">Video yo'q</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3 justify-center">
                      <button 
                        onClick={() => startEdit(book)}
                        className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => deleteBook(book.id)}
                        className="p-4 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        title="O'chirish"
                      >
                        <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-24 px-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Book className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-500 mb-4">Kitoblar topilmadi</h3>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              Qidiruv so'zini o'zgartiring yoki yangi kitob qo'shing
            </p>
            <button 
              onClick={() => {
                setEditingId(null)
                setEditingBook(null)
                setSearchTerm('')
              }}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-10 py-4 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl transition-all"
            >
              Yangi kitob qo'shish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBooks
