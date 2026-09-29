import { supabase } from '../supabaseClient';

/**
 * Dịch vụ Quản lý công việc (Todo CRUD Service)
 */
export const todoService = {
  /**
   * Lấy danh sách công việc của người dùng hiện tại
   */
  async getTodos(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Thêm một công việc mới
   */
  async createTodo(userId, title) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          is_completed: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cập nhật tiêu đề hoặc trạng thái công việc
   */
  async updateTodo(id, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Đảo trạng thái hoàn thành của công việc
   */
  async toggleComplete(id, currentStatus) {
    return this.updateTodo(id, { is_completed: !currentStatus });
  },

  /**
   * Xóa một công việc
   */
  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Xóa tất cả công việc đã hoàn thành
   */
  async clearCompleted(userId) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (error) throw error;
  },
};
