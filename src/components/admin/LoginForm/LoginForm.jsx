import { useState } from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { validateLoginForm } from '../../../utils/validators';
import './LoginForm.css';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    onSubmit(formData.username, formData.password);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h2 className="login-title">Admin Panel</h2>
          <p className="login-subtitle">Tizimga kirish</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-field">
            <div className="input-with-icon">
              <FiUser className="field-icon" />
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Foydalanuvchi nomi"
                error={errors.username}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <div className="input-with-icon">
              <FiLock className="field-icon" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Parol"
                error={errors.password}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={<FiLogIn />}
            loading={loading}
            fullWidth
            size="large"
          >
            Kirish
          </Button>

          <div className="login-hint">
            <p>Demo: admin / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
