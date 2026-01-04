import { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // ✅ Qo'shildi
import { supabase } from '../supabaseClient'
import { Mail, Lock, BookOpen, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' yoki 'signup'
  const navigate = useNavigate()  // ✅ HashRouter navigatsiyasi

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        })
        if (error) throw error
        
        // ✅ HashRouter uchun to'g'ri redirect
        navigate('/', { replace: true })
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin + '/'
          }
        })
        if (error) throw error
        
        alert('✅ Email tasdiqlash yuborildi! Spam papkani tekshiring.')
        setMode('signin')  // Signin rejimiga o'tkazish
        return
      }
    } catch (error) {
      console.error('Auth xatosi:', error)
      alert('❌ ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">
            {mode === 'signin' ? 'Tizimga kirish' : 'Ro\'yxatdan o\'tish'}
          </h1>
          <p className="text-xl text-gray-600">Taassurot qoldirish uchun</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <div className="relative mb-2">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email manzilingiz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-5 border-2 border-gray-200 rounded-2xl text-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-lg transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative mb-6">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Parol (8+ belgi)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-5 border-2 border-gray-200 rounded-2xl text-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-lg transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 px-8 rounded-2xl text-xl font-black shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {mode === 'signin' ? 'Kirilmoqda...' : 'Ro\'yxatdan o\'tmoqda...'}
              </>
            ) : mode === 'signin' ? (
              'Tizimga kirish'
            ) : (
              'Ro\'yxatdan o\'tish'
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg transition-colors w-full py-2"
            >
              {mode === 'signin' 
                ? 'Yangi hisob yarating →' 
                : 'Allaqaçhona hisobingiz bormi? ←'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
