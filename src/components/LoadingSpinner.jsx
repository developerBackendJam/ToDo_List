import React from 'react';

export default function LoadingSpinner({ text = 'Đang tải...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loading-screen" role="status">
        <div className="spinner spinner-lg"></div>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }} role="status">
      <div className="spinner"></div>
      {text && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</span>}
    </div>
  );
}
