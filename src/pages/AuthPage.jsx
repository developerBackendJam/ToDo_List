import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Mail, Lock, CheckSquare, Loader2 } from 'lucide-react';

export default function AuthPage({ onNotify }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFbLoading, setIsFbLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      onNotify('Vui lòng điền đầy đủ Email và Mật khẩu', 'error');
      return;
    }
    if (password.length < 6) {
      onNotify('Mật khẩu cần ít nhất 6 ký tự', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isLoginMode) {
        await authService.signIn(email, password);
        onNotify('Đăng nhập thành công!', 'success');
      } else {
        const data = await authService.signUp(email, password);
        // Supabase có thể yêu cầu xác thực email hoặc tự động đăng nhập nếu tắt email confirmation
        if (data.session) {
          onNotify('Đăng ký và đăng nhập thành công!', 'success');
        } else {
          onNotify('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', 'info');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      let errorMsg = err.message || 'Đã có lỗi xảy ra';
      if (err.message.includes('Invalid login credentials')) {
        errorMsg = 'Sai email hoặc mật khẩu!';
      } else if (err.message.includes('User already registered')) {
        errorMsg = 'Email này đã được đăng ký tài khoản!';
      }
      onNotify(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsFbLoading(true);
    try {
      await authService.signInWithFacebook();
    } catch (err) {
      console.error('Facebook OAuth error:', err);
      onNotify(err.message || 'Lỗi khi kết nối Facebook OAuth', 'error');
      setIsFbLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckSquare size={36} color="#fff" />
          </div>
          <h1 className="auth-title">TaskMaster</h1>
          <p className="auth-subtitle">
            {isLoginMode ? 'Đăng nhập để quản lý công việc của bạn' : 'Tạo tài khoản mới hoàn toàn miễn phí'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Địa chỉ Email
            </label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Mật khẩu
            </label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading || isFbLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>{isLoginMode ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}</span>
            )}
          </button>
        </form>

        <div className="divider">
          <span>Hoặc tiếp tục với</span>
        </div>

        <button
          type="button"
          className="btn-facebook"
          onClick={handleFacebookLogin}
          disabled={isLoading || isFbLoading}
        >
          {isFbLoading ? (
            <Loader2 size={18} className="spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>Đăng nhập với Facebook</span>
        </button>
      </div>
    </div>
  );
}
