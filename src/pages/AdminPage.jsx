import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/admin/LoginForm';
import BookManager from '../components/admin/BookManager';
import Loader from '../components/common/Loader';
import './AdminPage.css';

const AdminPage = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError(null);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return <Loader fullscreen text="Yuklanmoqda..." />;
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onSubmit={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page-header">
          <h1>Admin Panel</h1>
          <p>Kutubxona kitoblarini boshqarish</p>
        </div>
        <BookManager />
      </div>
    </div>
  );
};

export default AdminPage;
