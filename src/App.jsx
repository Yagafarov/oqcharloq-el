import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import HomePg from './pages/Home'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'

import { BookOpen, Search, Menu, Shield, Sun, Moon, Home  } from 'lucide-react'
import { motion } from 'framer-motion' 
import AdminPanel from './pages/AdminPanel'
import AdminBooks from './pages/AdminBooks'

function Layout({ children }) {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      {/* Navbar */}
     <nav className="bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-100/50 sticky top-0 z-50 supports-[backdrop-filter:blur(20px)]:bg-white/90">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 lg:h-20">
      {/* Logo */}
      <Link 
        to="/" 
        className="flex items-center gap-3 group font-black text-2xl lg:text-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
      >
        <div className="relative p-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:rotate-3 transition-all duration-300">
          <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
        </div>
        <span className="hidden lg:inline">KitobXona</span>
        <span className="lg:hidden font-extrabold text-2xl">KX</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-3">
        <Link 
          to="/" 
          className={`group relative flex items-center gap-2.5 px-5 py-2.5 lg:px-6 lg:py-3 rounded-2xl font-semibold text-base lg:text-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-indigo-200/50 ${
            location.pathname === '/' 
              ? 'bg-gradient-to-r from-indigo-100/80 via-purple-100/60 to-indigo-100/80 text-indigo-800 shadow-lg shadow-indigo-200/50 scale-105' 
              : 'text-gray-700 hover:text-indigo-800 hover:bg-indigo-50/80 hover:shadow-md'
          }`}
        >
          <span className="relative z-10">🏠 Bosh sahifa</span>
          {location.pathname === '/' && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -inset-1 rounded-2xl blur opacity-75 animate-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>

        <Link 
          to="/books" 
          className={`group relative flex items-center gap-2.5 px-5 py-2.5 lg:px-6 lg:py-3 rounded-2xl font-semibold text-base lg:text-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-indigo-200/50 ${
            location.pathname === '/books' 
              ? 'bg-gradient-to-r from-indigo-100/80 via-purple-100/60 to-indigo-100/80 text-indigo-800 shadow-lg shadow-indigo-200/50 scale-105' 
              : 'text-gray-700 hover:text-indigo-800 hover:bg-indigo-50/80 hover:shadow-md'
          }`}
        >
          <Search className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">Kitoblar</span>
          {location.pathname === '/books' && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -inset-1 rounded-2xl blur opacity-75 animate-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>

        {/* Admin Link */}
        <Link 
          to="/admin" 
          className="group relative flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-2xl font-semibold text-base lg:text-lg bg-gradient-to-r from-red-100/80 via-pink-100/60 to-red-100/80 text-red-800 border border-red-200/50 shadow-md hover:shadow-xl hover:shadow-red-200/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
        >
          <Shield className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-all" />
          <span className="relative z-10">Admin</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Search button */}
        <button className="p-2.5 lg:p-3 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-indigo-50/80 hover:shadow-md border border-gray-200/50 hover:border-indigo-200/50 transition-all duration-300 lg:hidden">
          <Search className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-hover:scale-110" />
        </button>

        {/* Theme toggle */}
        <button className="p-2.5 lg:p-3 bg-gradient-to-br from-gray-100/80 to-gray-200/80 hover:from-gray-200/90 hover:to-gray-300/90 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/50 hover:border-gray-300/60 transition-all duration-300">
          <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 hidden dark:inline" />
          <Moon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 inline dark:hidden" />
        </button>

        {/* Mobile menu button */}
        <button className="md:hidden p-2.5 lg:p-3 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 hover:from-indigo-200/90 hover:to-purple-200/90 text-indigo-800 rounded-2xl shadow-md hover:shadow-xl border border-indigo-200/50 hover:border-indigo-300/60 transition-all duration-300 font-semibold">
          <Menu className="w-6 h-6 lg:w-7 lg:h-7" />
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100/50">
    <div className="px-4 pt-2 pb-4 space-y-2">
      <Link 
        to="/" 
        className={`flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all group ${
          location.pathname === '/' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl' 
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 hover:shadow-lg'
        }`}
      >
        <HomePg className="w-6 h-6 flex-shrink-0" />
        Bosh sahifa
      </Link>
      
      <Link 
        to="/books" 
        className={`flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all group ${
          location.pathname === '/books' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl' 
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 hover:shadow-lg'
        }`}
      >
        <Search className="w-6 h-6 flex-shrink-0" />
        Kitoblar
      </Link>

      <Link 
        to="/admin" 
        className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
      >
        <Shield className="w-6 h-6 flex-shrink-0" />
        Admin panel
      </Link>
    </div>
  </div>
</nav>


      <main>{children}</main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePg /></Layout>} />
        <Route path="/books" element={<Layout><Books /></Layout>} />
        <Route path="/books/:id" element={<Layout><BookDetail /></Layout>} />
       
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
        <Route path="/admin/books" element={<Layout><AdminBooks /></Layout>} />

        <Route path="*" element={<Layout><HomePg /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
