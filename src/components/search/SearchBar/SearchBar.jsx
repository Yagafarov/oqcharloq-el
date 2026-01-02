import { FiSearch, FiX } from 'react-icons/fi';
import { useSearch } from '../../../hooks/useSearch';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Qidirish...' }) => {
  const { searchTerm, handleSearchChange, clearSearch, isSearching } = useSearch(onSearch);

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={clearSearch}
            aria-label="Tozalash"
          >
            <FiX />
          </button>
        )}
        {isSearching && (
          <div className="search-loading">
            <div className="search-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
