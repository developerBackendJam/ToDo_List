import React from 'react';
import { CheckSquare, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onSignOut }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <CheckSquare size={22} />
        </div>
        <span>TaskMaster</span>
      </div>

      <div className="nav-user">
        {user?.email && (
          <div className="user-email-badge" title={user.email}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} />
              {user.email}
            </span>
          </div>
        )}
        <button
          className="btn-signout"
          onClick={onSignOut}
          title="Đăng xuất khỏi tài khoản"
          aria-label="Đăng xuất"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
