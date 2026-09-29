import React, { useState } from 'react';
import { Check, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function TodoItem({
  todo,
  onToggleComplete,
  onUpdateTitle,
  onDeleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSaveEdit = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditTitle(todo.title);
      setIsEditing(false);
      return;
    }
    if (trimmed !== todo.title) {
      await onUpdateTitle(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <div className="todo-item-left">
        <button
          type="button"
          className={`custom-checkbox ${todo.is_completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(todo.id, todo.is_completed)}
          aria-label={todo.is_completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        >
          {todo.is_completed && <Check size={16} color="#fff" strokeWidth={3} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <input
              type="text"
              className="todo-edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              autoFocus
            />
          ) : (
            <>
              <div
                className={`todo-title ${todo.is_completed ? 'completed-text' : ''}`}
                onDoubleClick={() => setIsEditing(true)}
                title="Nhấp đúp chuột để chỉnh sửa"
              >
                {todo.title}
              </div>
              <div className="todo-date">{formatDate(todo.created_at)}</div>
            </>
          )}
        </div>
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn-icon edit-save"
              onClick={handleSaveEdit}
              title="Lưu thay đổi"
              aria-label="Lưu thay đổi"
            >
              <CheckCircle size={18} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => {
                setEditTitle(todo.title);
                setIsEditing(false);
              }}
              title="Hủy"
              aria-label="Hủy chỉnh sửa"
            >
              <XCircle size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              title="Chỉnh sửa công việc"
              aria-label="Chỉnh sửa công việc"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="btn-icon delete"
              onClick={() => onDeleteTodo(todo.id)}
              title="Xóa công việc"
              aria-label="Xóa công việc"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
