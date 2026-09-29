import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export default function TodoInput({ onAddTodo, isAdding }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || isAdding) return;

    const success = await onAddTodo(cleanTitle);
    if (success) {
      setTitle('');
    }
  };

  return (
    <form className="todo-input-card" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-main-input"
        placeholder="Thêm công việc mới cần làm..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isAdding}
        autoFocus
      />
      <button
        type="submit"
        className="btn-add-todo"
        disabled={!title.trim() || isAdding}
        aria-label="Thêm công việc"
      >
        {isAdding ? (
          <>
            <Loader2 size={18} className="spinner" />
            <span>Đang thêm...</span>
          </>
        ) : (
          <>
            <Plus size={18} />
            <span>Thêm</span>
          </>
        )}
      </button>
    </form>
  );
}
