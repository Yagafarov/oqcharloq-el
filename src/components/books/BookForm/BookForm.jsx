import { useState, useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { GENRES } from '../../../utils/constants';
import { validateBookForm } from '../../../utils/validators';
import { fileToBase64 } from '../../../utils/helpers';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import './BookForm.css';

const BookForm = ({ book = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: new Date().getFullYear(),
    isbn: '',
    description: '',
    cover: ''
  });

  const [errors, setErrors] = useState({});
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        year: book.year || new Date().getFullYear(),
        isbn: book.isbn || '',
        description: book.description || '',
        cover: book.cover || ''
      });
      setCoverPreview(book.cover || '');
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData(prev => ({
          ...prev,
          cover: base64
        }));
        setCoverPreview(base64);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateBookForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Title */}
        <div className="form-field full-width">
          <Input
            label="Kitob nomi"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Kitob nomini kiriting"
            error={errors.title}
            required
          />
        </div>

        {/* Author */}
        <div className="form-field full-width">
          <Input
            label="Muallif"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Muallif nomini kiriting"
            error={errors.author}
            required
          />
        </div>

        {/* Genre */}
        <div className="form-field">
          <label className="input-label">
            Janr
            <span className="input-required">*</span>
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={`input ${errors.genre ? 'input-error' : ''}`}
            required
          >
            <option value="">Janrni tanlang</option>
            {GENRES.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          {errors.genre && <span className="input-error-message">{errors.genre}</span>}
        </div>

        {/* Year */}
        <div className="form-field">
          <Input
            label="Nashr yili"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="Yilni kiriting"
            error={errors.year}
            required
          />
        </div>

        {/* ISBN */}
        <div className="form-field full-width">
          <Input
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="ISBN raqamini kiriting (ixtiyoriy)"
            error={errors.isbn}
          />
        </div>

        {/* Description */}
        <div className="form-field full-width">
          <Input
            label="Tavsif"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Kitob haqida qisqacha ma'lumot"
            error={errors.description}
            rows={5}
            required
          />
        </div>

        {/* Cover Upload */}
        <div className="form-field full-width">
          <label className="input-label">Muqova rasmi</label>
          <div className="cover-upload">
            {coverPreview && (
              <div className="cover-preview">
                <img src={coverPreview} alt="Preview" />
              </div>
            )}
            <label className="upload-btn">
              <FiUpload />
              <span>Rasm yuklash</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          icon={<FiSave />}
          loading={loading}
          size="large"
        >
          {book ? 'Yangilash' : 'Qo\'shish'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          icon={<FiX />}
          onClick={onCancel}
          size="large"
        >
          Bekor qilish
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
