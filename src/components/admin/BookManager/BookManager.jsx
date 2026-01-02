import { useState } from 'react';
import AdminPanel from '../AdminPanel';
import BookForm from '../../books/BookForm';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { useBooks } from '../../../hooks/useBooks';
import { generateId } from '../../../utils/helpers';
import { SUCCESS_MESSAGES } from '../../../utils/constants';
import './BookManager.css';

const BookManager = () => {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    
    try {
      if (selectedBook) {
        // Update existing book
        const updatedBook = {
          ...selectedBook,
          ...formData,
          updatedAt: Date.now()
        };
        updateBook(updatedBook);
        showNotification(SUCCESS_MESSAGES.BOOK_UPDATED);
      } else {
        // Add new book
        const newBook = {
          ...formData,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        addBook(newBook);
        showNotification(SUCCESS_MESSAGES.BOOK_ADDED);
      }
      
      setIsFormOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error saving book:', error);
      showNotification('Xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBook) {
      deleteBook(selectedBook.id);
      showNotification(SUCCESS_MESSAGES.BOOK_DELETED);
      setIsDeleteModalOpen(false);
      setSelectedBook(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedBook(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="book-manager">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Admin Panel */}
      <AdminPanel
        books={books}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Book Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={selectedBook ? 'Kitobni tahrirlash' : 'Yangi kitob qo\'shish'}
        size="large"
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Kitobni o'chirish"
        size="small"
      >
        <div className="delete-confirmation">
          <p>
            <strong>{selectedBook?.title}</strong> kitobini o'chirishni xohlaysizmi?
          </p>
          <p className="delete-warning">
            Bu amalni qaytarib bo'lmaydi!
          </p>
          <div className="delete-actions">
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Ha, o'chirish
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
            >
              Bekor qilish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookManager;
