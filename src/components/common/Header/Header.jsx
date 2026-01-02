import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookmark, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useSavedBooks } from '../../../hooks/useSavedBooks';
import { useAuth } from '../../../hooks/useAuth';
import './Header.css';

const Header = ({ onSearch, searchValue }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchValue || '');
  const { count } = useSavedBooks();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <div className="logo-icon">📚</div>
            <div className="logo-text">
              <span className="logo-title">Oqcharloq</span>
              <span className="logo-subtitle">48-maktab kutubxonasi</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Bosh sahifa</Link>
            <Link to="/textbooks" className="nav-link">Darsliklar</Link>
            <Link to="/saved" className="nav-link">
              <FiBookmark />
              Saqlangan
              {count > 0 && <span className="badge">{count}</span>}
            </Link>
            <Link to="/about" className="nav-link">Biz haqimizda</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Search Bar */}
        {onSearch && (
          <div className="search-container">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Kitob, muallif yoki janr bo'yicha qidirish..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="nav-mobile">
            <Link to="/" className="nav-link-mobile" onClick={closeMenu}>
              Bosh sahifa
            </Link>
            <Link to="/textbooks" className="nav-link-mobile" onClick={closeMenu}>
              Darsliklar
            </Link>
            <Link to="/saved" className="nav-link-mobile" onClick={closeMenu}>
              <FiBookmark />
              Saqlangan
              {count > 0 && <span className="badge">{count}</span>}
            </Link>
            <Link to="/about" className="nav-link-mobile" onClick={closeMenu}>
              Biz haqimizda
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
