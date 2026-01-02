import { FiStar } from 'react-icons/fi';
import './Rating.css';

const Rating = ({ rating, reviewsCount, size = 'medium', showCount = true }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <FiStar key={i} className="star star-filled" />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <div key={i} className="star star-half">
          <FiStar className="star-filled" />
          <FiStar className="star-empty" />
        </div>
      );
    } else {
      stars.push(
        <FiStar key={i} className="star star-empty" />
      );
    }
  }

  return (
    <div className={`rating rating-${size}`}>
      <div className="stars">
        {stars}
      </div>
      <span className="rating-value">{rating.toFixed(1)}</span>
      {showCount && reviewsCount > 0 && (
        <span className="reviews-count">({reviewsCount})</span>
      )}
    </div>
  );
};

export default Rating;
