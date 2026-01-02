import { useState } from 'react';
import { FiHeart, FiArrowLeft, FiBook, FiCalendar, FiTag, FiHash, FiEye, FiThumbsUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSavedBooks } from '../../../hooks/useSavedBooks';
import { getBookCoverPlaceholder } from '../../../utils/helpers';
import Button from '../../common/Button';
import Rating from '../../common/Rating';
import DownloadButton from '../../common/DownloadButton';
import AudioPlayer from '../../common/AudioPlayer';
import VideoPlayer from '../../common/VideoPlayer';
import ShareButton from '../../common/ShareButton';
import './BookDetail.css';

const BookDetail = ({ book }) => {
  const navigate = useNavigate();
  const { isBookSaved, toggleSavedBook } = useSavedBooks();
  const isSaved = isBookSaved(book.id);
  const placeholder = getBookCoverPlaceholder(book.title);
  
  const [likes, setLikes] = useState(book.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleSaveClick = () => {
    toggleSavedBook(book.id);
  };

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="book-detail">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon={<FiArrowLeft />}
        onClick={handleBack}
        className="back-btn"
      >
        Orqaga
      </Button>

      <div className="book-detail-content">
        {/* Cover */}
        <div className="book-detail-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="book-detail-image" />
          ) : (
            <div 
              className="book-detail-placeholder" 
              style={{ backgroundColor: placeholder.color }}
            >
              <span className="book-detail-letter">{placeholder.letter}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="book-detail-info">
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">{book.author}</p>

          {/* Rating */}
          {book.rating && (
            <div className="book-rating-section">
              <Rating 
                rating={book.rating} 
                reviewsCount={book.reviewsCount}
                size="large"
              />
            </div>
          )}

          {/* Meta */}
          <div className="book-detail-meta">
            <div className="meta-item">
              <FiTag />
              <span>{book.genre}</span>
            </div>
            <div className="meta-item">
              <FiCalendar />
              <span>{book.year}</span>
            </div>
            {book.isbn && (
              <div className="meta-item">
                <FiHash />
                <span>ISBN: {book.isbn}</span>
              </div>
            )}
            {book.views && (
              <div className="meta-item">
                <FiEye />
                <span>{book.views} ko'rilgan</span>
              </div>
            )}
            {book.grade && (
              <div className="meta-item">
                <FiBook />
                <span>{book.grade}</span>
              </div>
            )}
            {book.subject && (
              <div className="meta-item">
                <FiBook />
                <span>{book.subject}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="book-detail-actions">
            <Button
              variant={isSaved ? 'danger' : 'primary'}
              icon={<FiHeart />}
              onClick={handleSaveClick}
              size="large"
            >
              {isSaved ? 'Saqlanganlardan o\'chirish' : 'Saqlash'}
            </Button>
            
            <Button
              variant={isLiked ? 'secondary' : 'outline'}
              icon={<FiThumbsUp />}
              onClick={handleLikeClick}
              size="large"
            >
              {likes} Like
            </Button>
            
            <ShareButton title={book.title} />
          </div>

          {/* Description */}
          <div className="book-detail-description">
            <h3>
              <FiBook /> Kitob haqida
            </h3>
            <p>{book.description}</p>
          </div>

          {/* Excerpt - Asardan parcha */}
          {book.excerpt && (
            <div className="book-excerpt">
              <h3>
                📖 Asardan parcha
              </h3>
              <div className="excerpt-content">
                <p className="excerpt-text">{book.excerpt}</p>
                <div className="excerpt-footer">
                  <span className="excerpt-author">— {book.author}</span>
                </div>
              </div>
            </div>
          )}

          {/* Download */}
          {book.downloads && (
            <DownloadButton 
              downloads={book.downloads} 
              bookTitle={book.title}
            />
          )}

          {/* Audio Player */}
          {book.audioUrl && (
            <AudioPlayer 
              audioUrl={book.audioUrl} 
              title={book.title}
            />
          )}

          {/* Video Player */}
          {book.videoUrl && (
            <VideoPlayer 
              videoUrl={book.videoUrl} 
              title={book.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
