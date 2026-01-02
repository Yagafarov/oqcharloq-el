import { Link } from 'react-router-dom';
import { FiHeart, FiBookOpen } from 'react-icons/fi';
import { useSavedBooks } from '../../../hooks/useSavedBooks';
import { getBookCoverPlaceholder } from '../../../utils/helpers';
import Rating from '../../common/Rating';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { isBookSaved, toggleSavedBook } = useSavedBooks();
  const isSaved = isBookSaved(book.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    toggleSavedBook(book.id);
  };

  const placeholder = getBookCoverPlaceholder(book.title);

  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        {/* Cover */}
        <div className="book-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="book-cover-image" />
          ) : (
            <div 
              className="book-cover-placeholder" 
              style={{ backgroundColor: placeholder.color }}
            >
              <span className="book-cover-letter">{placeholder.letter}</span>
            </div>
          )}
          
          {/* Save Button */}
          <button
            className={`book-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Saqlanganlardan o\'chirish' : 'Saqlash'}
          >
            <FiHeart />
          </button>
        </div>

        {/* Info */}
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
          
          {book.rating && (
            <div className="book-rating">
              <Rating 
                rating={book.rating} 
                reviewsCount={book.reviewsCount}
                size="small"
                showCount={false}
              />
            </div>
          )}
          
          <div className="book-meta">
            <span className="book-genre">{book.genre}</span>
            <span className="book-year">{book.year}</span>
          </div>

          <div className="book-action">
            <FiBookOpen />
            <span>Batafsil</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
