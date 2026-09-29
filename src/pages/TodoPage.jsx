import React, { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';
import TodoInput from '../components/TodoInput';
import TodoItem from '../components/TodoItem';
import TodoFilter from '../components/TodoFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function TodoPage({ user, onNotify }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Tải danh sách todos từ Supabase
  const fetchTodos = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setFetchError(null);
      const data = await todoService.getTodos(user.id);
      setTodos(data);
    } catch (err) {
      console.error('Fetch todos error:', err);
      const msg = err.message || 'Không thể kết nối với cơ sở dữ liệu Supabase';
      setFetchError(msg);
      onNotify(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, onNotify]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Thêm todo mới
  const handleAddTodo = async (title) => {
    setIsAdding(true);
    try {
      const newTodo = await todoService.createTodo(user.id, title);
      setTodos((prev) => [newTodo, ...prev]);
      onNotify('Đã thêm công việc mới thành công!', 'success');
      return true;
    } catch (err) {
      console.error('Add todo error:', err);
      onNotify(err.message || 'Lỗi khi thêm công việc mới', 'error');
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Đổi trạng thái Hoàn thành / Chưa hoàn thành
  const handleToggleComplete = async (id, currentStatus) => {
    // Cập nhật giao diện lập tức (Optimistic Update)
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: !currentStatus } : t))
    );

    try {
      await todoService.toggleComplete(id, currentStatus);
    } catch (err) {
      console.error('Toggle todo error:', err);
      onNotify('Lỗi cập nhật trạng thái công việc', 'error');
      // Rollback nếu thất bại
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: currentStatus } : t))
      );
    }
  };

  // Cập nhật nội dung tiêu đề
  const handleUpdateTitle = async (id, newTitle) => {
    const originalTodo = todos.find((t) => t.id === id);
    if (!originalTodo || originalTodo.title === newTitle) return;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );

    try {
      await todoService.updateTodo(id, { title: newTitle });
      onNotify('Đã cập nhật công việc thành công!', 'success');
    } catch (err) {
      console.error('Update todo title error:', err);
      onNotify('Lỗi khi cập nhật công việc', 'error');
      if (originalTodo) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? originalTodo : t))
        );
      }
    }
  };

  // Xóa todo
  const handleDeleteTodo = async (id) => {
    const backupTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
      onNotify('Đã xóa công việc khỏi danh sách', 'info');
    } catch (err) {
      console.error('Delete todo error:', err);
      onNotify('Không thể xóa công việc', 'error');
      setTodos(backupTodos);
    }
  };

  // Dọn dẹp các todo đã hoàn thành
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.is_completed);
    if (completedTodos.length === 0) return;

    const backupTodos = [...todos];
    setTodos((prev) => prev.filter((t) => !t.is_completed));

    try {
      await todoService.clearCompleted(user.id);
      onNotify(`Đã dọn dẹp ${completedTodos.length} công việc đã xong`, 'info');
    } catch (err) {
      console.error('Clear completed error:', err);
      onNotify('Lỗi khi dọn dẹp công việc', 'error');
      setTodos(backupTodos);
    }
  };

  // Thống kê số lượng
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.is_completed).length;
  const activeCount = totalCount - completedCount;

  // Lọc theo trạng thái
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
    return true;
  });

  return (
    <main className="main-content">
      <div className="todo-hero">
        <h1>Công Việc Của Bạn</h1>
        <p>Tổ chức và theo dõi hiệu suất làm việc mỗi ngày</p>
      </div>

      <TodoInput onAddTodo={handleAddTodo} isAdding={isAdding} />

      {totalCount > 0 && (
        <TodoFilter
          currentFilter={filter}
          onChangeFilter={setFilter}
          totalCount={totalCount}
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
        />
      )}

      {isLoading ? (
        <LoadingSpinner text="Đang đồng bộ với Supabase..." />
      ) : fetchError ? (
        <div className="empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: '#f87171' }}>Đồng bộ thất bại</h3>
          <p style={{ marginBottom: '1.25rem' }}>{fetchError}</p>
          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', display: 'inline-flex', margin: '0 auto' }}
            onClick={fetchTodos}
          >
            Thử kết nối lại
          </button>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {filter === 'completed' ? (
              <CheckCircle2 size={48} color="#6366f1" />
            ) : (
              <Sparkles size={48} color="#6366f1" />
            )}
          </div>
          <h3>
            {filter === 'completed'
              ? 'Chưa có công việc nào hoàn thành'
              : filter === 'active'
              ? 'Tuyệt vời! Không còn công việc nào đang dang dở'
              : 'Chưa có công việc nào'}
          </h3>
          <p>
            {totalCount === 0
              ? 'Hãy nhập mục tiêu đầu tiên của bạn ở trên để bắt đầu!'
              : 'Hãy thay đổi bộ lọc hoặc thêm công việc mới.'}
          </p>
        </div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onUpdateTitle={handleUpdateTitle}
              onDeleteTodo={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </main>
  );
}
