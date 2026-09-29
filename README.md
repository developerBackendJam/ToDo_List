# ToDo - Ứng Dụng Quản Lý Công Việc Đầy Đủ Chức Năng (Vite + React + Supabase)

Ứng dụng quản lý công việc hiện đại, bảo mật và trực quan được xây dựng bằng **Vite**, **React (JavaScript)** và **Supabase Backend as a Service (BaaS)**.

---

## 🚀 Các Tính Năng Chính

### 1. 🔐 Xác thực Người Dùng (Authentication)
- **Đăng ký & Đăng nhập Email/Mật khẩu**: Kiểm tra tính hợp lệ của mật khẩu và quản lý thông báo chi tiết.
- **Đăng nhập với Facebook OAuth**: Sử dụng `supabase.auth.signInWithOAuth({ provider: 'facebook' })`.
- **Quản lý Phiên (Session Management)**: Tự động lưu trạng thái đăng nhập, khôi phục khi tải lại trang và lắng nghe thay đổi phiên qua `onAuthStateChange`.
- **Đăng xuất an toàn**: Xóa phiên làm việc hiện tại và quay về màn hình đăng nhập.

### 2. 📝 Quản Lý Công Việc (Full CRUD)
- **Xem danh sách công việc**: Nhờ **Row Level Security (RLS)** trên Supabase, mỗi người dùng chỉ có thể xem và tương tác với công việc của chính mình.
- **Thêm công việc mới**: Nhập tiêu đề nhanh chóng với phím tắt `Enter`.
- **Chỉnh sửa tiêu đề**: Hỗ trợ chế độ sửa inline (nhấp đúp hoặc bấm nút Chỉnh sửa), lưu bằng `Enter` hoặc hủy bằng `Esc`.
- **Đánh dấu hoàn thành**: Toggle trạng thái với hiệu ứng gạch ngang và đổi màu trực quan.
- **Xóa công việc**: Xóa từng công việc hoặc dọn dẹp hàng loạt các công việc đã hoàn thành (Clear completed).
- **Bộ lọc thông minh**: Lọc tức thời theo *Tất cả*, *Đang làm*, *Đã xong* kèm bộ đếm số lượng công việc thời gian thực.

### 3. ✨ Giao Diện & Trải Nghiệm (UI/UX)
- Giao diện **Dark Glassmorphism** hiện đại, bo góc mềm mại, hiệu ứng viền sáng và ánh sáng nền (ambient glow).
- Phông chữ **Plus Jakarta Sans** sắc nét, sang trọng.
- **Phản hồi Optimistic Update**: Cập nhật trạng thái UI tức thì, tự động hoàn tác (rollback) nếu kết nối mạng gặp sự cố.
- **Hệ thống thông báo Toast**: Hiển thị thông báo thành công, lỗi và cảnh báo người dùng.
- **Hoàn toàn tương thích thiết bị di động (Responsive)**.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
c:/ToDo_List/
├── .env                     # File biến môi trường chứa Supabase URL & Anon Key (bảo mật, đã được gitignore)
├── .env.example             # File mẫu biến môi trường
├── .gitignore               # Loại bỏ node_modules, .env, dist để tránh rò rỉ Key
├── index.html               # Entry HTML với Google Fonts
├── package.json             # Khai báo thư viện & scripts
├── vite.config.js           # Cấu hình Vite React
├── README.md                # Tài liệu hướng dẫn chi tiết
└── src/
    ├── main.jsx             # Điểm khởi chạy React DOM
    ├── App.jsx              # Quản lý phiên làm việc & điều hướng Auth / Dashboard
    ├── index.css            # Toàn bộ hệ thống giao diện, theme, animations
    ├── supabaseClient.js    # Khởi tạo Supabase Client từ import.meta.env
    ├── services/            # Tầng xử lý logic & kết nối Backend
    │   ├── authService.js   # API xác thực (Email, Facebook, Session)
    │   └── todoService.js   # API CRUD cơ sở dữ liệu Supabase
    ├── components/          # Các thành phần giao diện dùng lại
    │   ├── Navbar.jsx       # Thanh điều hướng trên cùng, hiển thị email & Đăng xuất
    │   ├── TodoInput.jsx    # Ô nhập và nút thêm công việc
    │   ├── TodoItem.jsx     # Thẻ hiển thị công việc, chỉnh sửa & xóa
    │   ├── TodoFilter.jsx   # Thanh bộ lọc trạng thái và thống kê
    │   ├── Toast.jsx        # Hộp thông báo nổi
    │   └── LoadingSpinner.jsx # Vòng xoay tải trang
    └── pages/
        ├── AuthPage.jsx     # Trang đăng nhập & đăng ký
        └── TodoPage.jsx     # Trang quản lý danh sách công việc
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### Bước 1: Cài đặt thư viện
Mở Terminal tại thư mục dự án và chạy:
```bash
npm install
```

### Bước 2: Cấu hình Biến Môi Trường (.env)
Đảm bảo file `.env` tại thư mục gốc có định dạng sau:
```env
VITE_SUPABASE_URL=https://skmtlowzanxnppxwnydp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Lưu ý: URL của Supabase cần ở dạng root `https://<project-ref>.supabase.co`, không chứa hậu tố `/rest/v1/`)*

### Bước 3: Khởi chạy Development Server
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:5173`

### Bước 4: Đóng gói dự án (Production Build)
```bash
npm run build
```

---

## 🗄️ Cấu Trúc Database & Row Level Security (Supabase SQL)

Bảng `todos` đã được cấu hình với cấu trúc và chính sách bảo mật như sau:

```sql
-- 1. Tạo bảng todos
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Kích hoạt Row Level Security (RLS) & Phân quyền
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.todos TO authenticated, anon;

-- 3. Tạo các chính sách bảo mật RLS (Chỉ chủ sở hữu mới có quyền truy cập)

-- Xem công việc của chính mình
CREATE POLICY "Người dùng có thể xem danh sách công việc của mình"
  ON public.todos FOR SELECT
  USING (auth.uid() = user_id);

-- Thêm công việc mới
CREATE POLICY "Người dùng có thể thêm công việc mới"
  ON public.todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Cập nhật công việc của mình
CREATE POLICY "Người dùng có thể cập nhật công việc của mình"
  ON public.todos FOR UPDATE
  USING (auth.uid() = user_id);

-- Xóa công việc của mình
CREATE POLICY "Người dùng có thể xóa công việc của mình"
  ON public.todos FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🌐 Hướng Dẫn Cấu Hình Đăng Nhập Facebook OAuth

Để tính năng đăng nhập Facebook hoạt động:
1. Vào **Supabase Dashboard** -> Chọn dự án của bạn -> Mục **Authentication** -> **Providers**.
2. Tìm và kích hoạt **Facebook**.
3. Điền **Client ID** và **Client Secret** được lấy từ trang [Meta for Developers](https://developers.facebook.com/).
4. Sao chép đường dẫn **Redirect URL** do Supabase cung cấp và dán vào phần *Valid OAuth Redirect URIs* trong ứng dụng Meta Developer của bạn.
