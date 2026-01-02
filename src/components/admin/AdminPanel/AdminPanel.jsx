import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import Button from '../../common/Button';
import './AdminPanel.css';

const AdminPanel = ({ books, onAdd, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2 className="admin-title">Kitoblarni boshqarish</h2>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={onAdd}
        >
          Yangi kitob
        </Button>
      </div>

      <div className="admin-search">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Kitob yoki muallif bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kitob nomi</th>
              <th>Muallif</th>
              <th>Janr</th>
              <th>Yil</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td className="book-title-cell">{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <span className="genre-badge">{book.genre}</span>
                </td>
                <td>{book.year}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(book)}
                      title="Tahrirlash"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(book)}
                      title="O'chirish"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBooks.length === 0 && (
          <div className="empty-state">
            <p>Kitoblar topilmadi</p>
          </div>
        )}
      </div>

      <div className="admin-footer">
        <p>Jami: {filteredBooks.length} ta kitob</p>
      </div>
    </div>
  );
};

export default AdminPanel;
