import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Menu, BookOpen, LogOut, User, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop + Tablet Header */}
        <div className="py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent hover:scale-105 transition-transform">
              Kitoblar
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">
                  Salom, {user.email.split('@')[0]}
                </span>
                <Link 
                  to="/admin" 
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold hover:bg-emerald-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Admin
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 sm:p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg"
                  title="Chiqish"
                >
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl text-sm sm:font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
              >
                Kirish / Ro'yxat
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 sm:p-2 bg-white/50 hover:bg-white rounded-lg shadow-md transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menyu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 px-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <User className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-800 truncate">
                    Salom, {user.email.split('@')[0]}
                  </span>
                </Link>
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="block w-full text-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Admin panel
                </Link>
                <button 
                  onClick={handleLogout}
                  
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold rounded-xl border border-red-200 hover:border-red-300 transition-all shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Chiqish
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="block w-full text-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Kirish / Ro'yxatdan o'tish
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
