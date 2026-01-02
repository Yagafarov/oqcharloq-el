import { useParams, Navigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookDetail from '../components/books/BookDetail';
import Loader from '../components/common/Loader';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const { getBookById, loading } = useBooks();
  
  const book = getBookById(id);

  if (loading) {
    return <Loader fullscreen text="Kitob yuklanmoqda..." />;
  }

  if (!book) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <BookDetail book={book} />
      </div>
    </div>
  );
};

export default BookDetailPage;
