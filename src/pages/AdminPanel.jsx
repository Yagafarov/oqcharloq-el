import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart3, Book, Users, Upload, Settings, Download, ArrowRight } from 'lucide-react'

function AdminPanel() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    todayViews: 0,
    totalDownloads: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { count: totalBooks } = await supabase.from('books').select('*', { count: 'exact', head: true })
    setStats({
      totalBooks: totalBooks || 0,
      todayViews: Math.floor(Math.random() * 1000),
      totalDownloads: Math.floor(Math.random() * 5000)
    })
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-xl text-gray-600 mt-1">Kitoblar va statistikani boshqaring</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="group bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm uppercase tracking-wide">Jami kitoblar</p>
              <p className="text-4xl font-black mt-2">{stats.totalBooks}</p>
            </div>
            <BarChart3 className="w-12 h-12 opacity-75 group-hover:rotate-12 transition-all" />
          </div>
        </div>

        <div className="group bg-gradient-to-br from-emerald-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm uppercase tracking-wide">Bugun ko'rishlar</p>
              <p className="text-4xl font-black mt-2">{stats.todayViews.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 opacity-75 group-hover:rotate-12 transition-all" />
          </div>
        </div>

        <div className="group bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm uppercase tracking-wide">Yuklab olinganlar</p>
              <p className="text-4xl font-black mt-2">{stats.totalDownloads.toLocaleString()}</p>
            </div>
            <Download className="w-12 h-12 opacity-75 group-hover:rotate-12 transition-all" />
          </div>
        </div>

        <div className="group bg-gradient-to-br from-slate-500 to-gray-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-100 text-sm uppercase tracking-wide">Faol foydalanuvchilar</p>
              <p className="text-4xl font-black mt-2">2,847</p>
            </div>
            <Settings className="w-12 h-12 opacity-75 group-hover:rotate-12 transition-all" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <a href="/admin/books" className="group bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl hover:shadow-3xl border border-gray-200/50 hover:border-indigo-300 transition-all hover:-translate-y-2">
          <Book className="w-16 h-16 text-indigo-600 mx-auto mb-6 group-hover:scale-110 transition-all" />
          <h3 className="text-3xl font-black text-gray-900 text-center mb-4">Kitoblarni boshqarish</h3>
          <p className="text-xl text-gray-600 text-center mb-8">Yangi kitob qo'shish, tahrirlash va o'chirish</p>
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-semibold text-lg">
            Boshqarish
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all" />
          </div>
        </a>

        <div className="group bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2">
          <Upload className="w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-all" />
          <h3 className="text-3xl font-black text-center mb-4">PDF yuklash</h3>
          <p className="text-xl text-indigo-100 text-center mb-8 opacity-90">Yangi kitob PDF'ini yuklang va tezkor qo'shing</p>
          <div className="flex items-center justify-center gap-2 text-indigo-100 font-semibold text-lg bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all">
            Yuklash
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
