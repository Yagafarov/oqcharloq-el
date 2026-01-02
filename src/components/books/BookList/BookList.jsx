import { useState, useEffect } from 'react';
import BookCard from '../BookCard';
import Loader from '../../common/Loader';
import { paginateBooks } from '../../../utils/helpers';
import { BOOKS_PER_PAGE } from '../../../utils/constants';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './BookList.css';

const BookList = ({ books, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState({
    books: [],
    totalPages: 1,
    currentPage: 1,
    totalBooks: 0
  });

  useEffect(() => {
    const data = paginateBooks(books, currentPage, BOOKS_PER_PAGE);
    setPaginatedData(data);
  }, [books, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [books]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (loading) {
    return <Loader text="Kitoblar yuklanmoqda..." />;
  }

  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        <div className="empty-icon">📚</div>
        <h3>Kitoblar topilmadi</h3>
        <p>Qidiruv yoki filtr shartlaringizni o'zgartiring</p>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      {/* Books Grid */}
      <div className="book-grid">
        {paginatedData.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {paginatedData.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
            Oldingi
          </button>

          <div className="pagination-pages">
            {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === paginatedData.totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-dots">...</span>;
              }
              return null;
            })}
          </div>

          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === paginatedData.totalPages}
          >
            Keyingi
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        {paginatedData.totalBooks} ta kitobdan {((currentPage - 1) * BOOKS_PER_PAGE) + 1}-
        {Math.min(currentPage * BOOKS_PER_PAGE, paginatedData.totalBooks)} ko'rsatilmoqda
      </div>
    </div>
  );
};

export default BookList;
