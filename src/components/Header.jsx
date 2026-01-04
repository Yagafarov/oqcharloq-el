import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Menu, BookOpen, LogOut, User } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // User holatini kuzatish
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            Kitoblar
          </h1>
        </a>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-lg font-semibold text-gray-700 hidden md:block">
                Salom, {user.email.split('@')[0]}
              </span>
              <a href="/admin" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                Admin
              </a>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Chiqish"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <a href="/login" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              Kirish / Ro'yxat
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
