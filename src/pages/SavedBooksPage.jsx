import { useSavedBooks } from '../hooks/useSavedBooks';
import BookList from '../components/books/BookList';
import { FiBookmark } from 'react-icons/fi';
import './SavedBooksPage.css';

const SavedBooksPage = () => {
  const { getSavedBooksDetails, count } = useSavedBooks();
  const savedBooks = getSavedBooksDetails();

  return (
    <div className="saved-books-page">
      <div className="container">
        <div className="saved-header">
          <h1>
            <FiBookmark />
            Saqlangan kitoblar
          </h1>
          <p className="saved-subtitle">
            {count} ta kitob saqlangan
          </p>
        </div>

        {savedBooks.length > 0 ? (
          <BookList books={savedBooks} />
        ) : (
          <div className="saved-empty">
            <div className="empty-icon">📚</div>
            <h3>Saqlangan kitoblar yo'q</h3>
            <p>Kitoblarni saqlash uchun yurak belgisini bosing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBooksPage;
