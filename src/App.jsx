import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import { AuthProvider } from './context/AuthContext';
import { SavedBooksProvider } from './context/SavedBooksContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import SavedBooksPage from './pages/SavedBooksPage';
import AboutPage from './pages/AboutPage';
import TextbooksPage from './pages/TextbooksPage';
import { useBooks } from './hooks/useBooks';
import './App.css';

// Layout wrapper component
const Layout = ({ children }) => {
  const { setSearchQuery } = useBooks();

  return (
    <div className="app-layout">
      <Header onSearch={setSearchQuery} />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
};

// App with providers
const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/book/:id"
          element={
            <Layout>
              <BookDetailPage />
            </Layout>
          }
        />
        <Route
          path="/saved"
          element={
            <Layout>
              <SavedBooksPage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/textbooks"
          element={
            <Layout>
              <TextbooksPage />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <div className="not-found">
                <h1>404</h1>
                <p>Sahifa topilmadi</p>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <SavedBooksProvider>
          <AppContent />
        </SavedBooksProvider>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
