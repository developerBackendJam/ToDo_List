import { supabase } from '../supabaseClient';

/**
 * Dịch vụ Xác thực người dùng (Auth Service)
 */
export const authService = {
  /**
   * Đăng ký tài khoản mới bằng Email và Mật khẩu
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Đăng nhập bằng Email và Mật khẩu
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Đăng nhập bằng Facebook OAuth
   */
  async signInWithFacebook() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Đăng xuất
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Lấy phiên đăng nhập hiện tại
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Lắng nghe sự kiện thay đổi trạng thái đăng nhập
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
