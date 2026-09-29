import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [toast, setToast] = useState(null);

  const showNotification = React.useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại khi ứng dụng khởi chạy
    authService
      .getSession()
      .then((currentSession) => {
        setSession(currentSession);
      })
      .catch((err) => {
        console.error('Session check error:', err);
      })
      .finally(() => {
        setIsInitializing(false);
      });

    // 2. Lắng nghe thay đổi trạng thái đăng nhập tự động
    const { data: authListener } = authService.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setIsInitializing(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      showNotification('Đã đăng xuất thành công!', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
      showNotification('Lỗi khi đăng xuất!', 'error');
    }
  };

  if (isInitializing) {
    return <LoadingSpinner text="Đang khởi tạo phiên làm việc..." fullScreen />;
  }

  return (
    <div className="app-container">
      {session ? (
        <>
          <Navbar user={session.user} onSignOut={handleSignOut} />
          <TodoPage user={session.user} onNotify={showNotification} />
        </>
      ) : (
        <AuthPage onNotify={showNotification} />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
