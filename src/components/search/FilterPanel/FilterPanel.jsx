import { FiFilter, FiX } from 'react-icons/fi';
import { GENRES } from '../../../utils/constants';
import { countBooksByGenre } from '../../../utils/helpers';
import Button from '../../common/Button';
import './FilterPanel.css';

const FilterPanel = ({ books, selectedGenres, onFilterChange }) => {
  const genreCounts = countBooksByGenre(books);

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      onFilterChange(selectedGenres.filter(g => g !== genre));
    } else {
      onFilterChange([...selectedGenres, genre]);
    }
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const hasActiveFilters = selectedGenres.length > 0;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">
          <FiFilter />
          Filtrlash
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="small"
            icon={<FiX />}
            onClick={handleClearAll}
          >
            Tozalash
          </Button>
        )}
      </div>

      <div className="filter-section">
        <h4 className="filter-subtitle">Janrlar</h4>
        <div className="filter-options">
          {GENRES.map(genre => {
            const count = genreCounts[genre] || 0;
            const isSelected = selectedGenres.includes(genre);
            
            return (
              <label
                key={genre}
                className={`filter-option ${isSelected ? 'selected' : ''} ${count === 0 ? 'disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGenreToggle(genre)}
                  disabled={count === 0}
                />
                <span className="filter-option-text">
                  {genre}
                  <span className="filter-count">({count})</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-summary">
          <p>{selectedGenres.length} ta janr tanlangan</p>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
