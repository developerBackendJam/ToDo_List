import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

// Đảm bảo URL là root URL (loại bỏ /rest/v1/ nếu có từ trước)
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').trim();

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Cảnh báo: Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env!'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
