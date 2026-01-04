import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Plus, Edit3, Trash2, Search, Book, Image, FileText, Youtube, Save, X } from 'lucide-react'

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [newBook, setNewBook] = useState({
    title: '', author: '', description: '', details: '',
    category: 'adabiyot', youtube_url: ''
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  // Cloudinary yuklash
  const uploadToCloudinary = async (file, folder = 'books') => {
    if (!file) return null
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('resource_type', file.type.includes('pdf') ? 'raw' : 'image')
    
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary xato:', error)
      alert('Fayl yuklashda xato!')
      return null
    } finally {
      setUploading(false)
    }
  }

  // YouTube ID ajratish
  const extractYouTubeId = (url) => {
    if (!url) return ''
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return (match && match[2].length === 11) ? match[2] : url
    } catch {
      return url
    }
  }

  const fetchBooks = async () => {
    try {
      const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false })
      setBooks(data || [])
    } catch (error) {
      console.error('Xato:', error)
    }
  }

  const addBook = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const youtube_id = extractYouTubeId(newBook.youtube_url)
      const image_url = await uploadToCloudinary(imageFile, 'covers')
      const pdf_url = await uploadToCloudinary(pdfFile, 'pdfs')

      await supabase.from('books').insert([{
        ...newBook,
        youtube_url: youtube_id,
        image_url,
        pdf_url
      }])

      setNewBook({ title: '', author: '', description: '', details: '', category: 'adabiyot', youtube_url: '' })
      setPdfFile(null)
      setImageFile(null)
      fetchBooks()
      alert('✅ Kitob qo\'shildi!')
    } catch (error) {
      alert('❌ Xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBook = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const youtube_id = extractYouTubeId(editingBook.youtube_url)
      const image_url = editingBook.image_url || (await uploadToCloudinary(imageFile, 'covers'))
      const pdf_url = editingBook.pdf_url || (await uploadToCloudinary(pdfFile, 'pdfs'))

      await supabase.from('books').update({
        ...editingBook,
        youtube_url: youtube_id,
        image_url,
        pdf_url
      }).eq('id', editingId)

      setEditingId(null)
      setEditingBook(null)
      setPdfFile(null)
      setImageFile(null)
      fetchBooks()
      alert('✅ Yangilandi!')
    } catch (error) {
      alert('❌ Xato: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (id) => {
    if (confirm('O\'chirishni xohlaysizmi?')) {
      await supabase.from('books').delete().eq('id', id)
      fetchBooks()
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

  return (
    <div className="pt-24 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Book className="w-9 h-9 text-white" />
        </div>
        <div>
          <h1 className="text-5xl font-black text-gray-900">Kitoblar Admin</h1>
          <p className="text-xl text-gray-600 mt-2">Cloudinary + Supabase</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200/50 mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-12">
          {editingId ? 'Tahrirlash' : 'Yangi kitob'}
        </h2>
        
        <form onSubmit={editingId ? updateBook : addBook} className="grid md:grid-cols-2 gap-8">
          {/* Title & Author */}
          <div>
            <label className="block text-xl font-bold mb-4">Kitob nomi *</label>
            <input
              value={editingId ? editingBook?.title || '' : newBook.title}
              onChange={(e) => editingId ? setEditingBook({...editingBook, title: e.target.value}) : setNewBook({...newBook, title: e.target.value})}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-xl font-bold mb-4">Muallif *</label>
            <input
              value={editingId ? editingBook?.author || '' : newBook.author}
              onChange={(e) => editingId ? setEditingBook({...editingBook, author: e.target.value}) : setNewBook({...newBook, author: e.target.value})}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg"
              required
            />
          </div>

          {/* Image & PDF */}
          <div>
            <label className="block text-xl font-bold mb-4">Rasm yuklash</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) editingId ? setEditingBook({...editingBook, image_url: file}) : setImageFile(file)
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
            />
          </div>

          <div>
            <label className="block text-xl font-bold mb-4">PDF yuklash</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) editingId ? setEditingBook({...editingBook, pdf_url: file}) : setPdfFile(file)
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            />
          </div>

          {/* Category & YouTube */}
          <div>
            <label className="block text-xl font-bold mb-4">Kategoriya</label>
            <select
              value={editingId ? editingBook?.category || 'adabiyot' : newBook.category}
              onChange={(e) => editingId ? setEditingBook({...editingBook, category: e.target.value}) : setNewBook({...newBook, category: e.target.value})}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg"
            >
              {['adabiyot', 'ilmiy', 'dasturlash', 'tarix', 'falsafa', 'psixologiya'].map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xl font-bold mb-4">YouTube havola</label>
            <input
              type="text"
              value={editingId ? editingBook?.youtube_url || '' : newBook.youtube_url}
              onChange={(e) => {
                const id = extractYouTubeId(e.target.value)
                editingId ? setEditingBook({...editingBook, youtube_url: id}) : setNewBook({...newBook, youtube_url: id})
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 shadow-lg"
              placeholder="https://youtube.com/watch?v=ID"
            />
          </div>

          {/* Description & Details */}
          <div className="md:col-span-2">
            <label className="block text-xl font-bold mb-4">Tavsif *</label>
            <textarea
              value={editingId ? editingBook?.description || '' : newBook.description}
              onChange={(e) => editingId ? setEditingBook({...editingBook, description: e.target.value}) : setNewBook({...newBook, description: e.target.value})}
              rows="4"
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-vertical shadow-lg"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xl font-bold mb-4">Batafsil ma'lumot</label>
            <textarea
              value={editingId ? editingBook?.details || '' : newBook.details}
              onChange={(e) => editingId ? setEditingBook({...editingBook, details: e.target.value}) : setNewBook({...newBook, details: e.target.value})}
              rows="6"
              className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-vertical shadow-lg"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-6">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 px-12 rounded-3xl text-2xl font-black shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-4 justify-center"
            >
              {uploading ? 'Yuklanmoqda...' : editingId ? 'Yangilash' : 'Qo\'shish'}
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
                className="px-12 py-8 bg-gray-500 hover:bg-gray-600 text-white rounded-3xl text-2xl font-black shadow-2xl hover:shadow-3xl transition-all"
              >
                Bekor
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="p-8 border-b border-gray-200/50 flex items-center justify-between">
          <h2 className="text-4xl font-black text-gray-900">Kitoblar ({filteredBooks.length})</h2>
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="px-8 py-4 bg-gray-100 rounded-2xl text-xl outline-none w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-6 text-left">Rasm</th>
                <th className="p-6 text-left">Kitob</th>
                <th className="p-6 text-left">Muallif</th>
                <th className="p-6 text-left">Kategoriya</th>
                <th className="p-6 text-left">Fayllar</th>
                <th className="p-6 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="border-t hover:bg-gray-50">
                  <td className="p-6">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="w-20 h-28 object-cover rounded-2xl" />
                    ) : (
                      <div className="w-20 h-28 bg-gray-200 rounded-2xl flex items-center justify-center">📖</div>
                    )}
                  </td>
                  <td className="p-6 max-w-md">
                    <div className="font-bold text-xl">{book.title}</div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{book.description}</p>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-lg text-indigo-700">{book.author}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold">{book.category}</span>
                  </td>
                  <td className="p-6">
                    <div className="space-y-2">
                      {book.pdf_url && <span className="text-green-600 font-medium">PDF ✓</span>}
                      {book.youtube_url && <span className="text-red-600 font-medium">Video ✓</span>}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => startEdit(book)} className="p-4 text-indigo-600 hover:bg-indigo-100 rounded-2xl">
                        <Edit3 className="w-6 h-6" />
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="p-4 text-red-600 hover:bg-red-100 rounded-2xl">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminBooks
