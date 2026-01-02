import { useState } from 'react';
import { mockTextbooks } from '../data/mockTextbooks';
import { GRADES, SUBJECTS } from '../utils/constants';
import BookCard from '../components/books/BookCard';
import { FiBook } from 'react-icons/fi';
import './TextbooksPage.css';

const TextbooksPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const filteredTextbooks = mockTextbooks.filter(book => {
    if (selectedGrade && book.grade !== selectedGrade) return false;
    if (selectedSubject && book.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="textbooks-page">
      <div className="container">
        <div className="textbooks-header">
          <h1>
            <FiBook />
            Maktab darsliklari
          </h1>
          <p className="textbooks-subtitle">
            Barcha sinflar va fanlar bo'yicha darsliklar
          </p>
        </div>

        {/* Filters */}
        <div className="textbooks-filters">
          <div className="filter-group">
            <label>Sinf:</label>
            <select 
              value={selectedGrade} 
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="filter-select"
            >
              <option value="">Barcha sinflar</option>
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fan:</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="filter-select"
            >
              <option value="">Barcha fanlar</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {(selectedGrade || selectedSubject) && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSelectedGrade('');
                setSelectedSubject('');
              }}
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Results */}
        <div className="textbooks-results">
          <p className="results-count">
            {filteredTextbooks.length} ta darslik topildi
          </p>

          {filteredTextbooks.length > 0 ? (
            <div className="textbooks-grid">
              {filteredTextbooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>Darsliklar topilmadi</h3>
              <p>Boshqa sinf yoki fanni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextbooksPage;
