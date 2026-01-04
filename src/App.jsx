import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import AdminBooks from './pages/AdminBooks'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50">
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/admin" element={<AdminBooks />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Books />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
