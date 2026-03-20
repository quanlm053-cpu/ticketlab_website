# TicketLab - Hệ thống Đặt Vé Sự kiện Full Stack

Một ứng dụng web hoàn chỉnh để đặt vé sự kiện trực tuyến, được xây dựng bằng Next.js 16, Express.js và SQL Server.

## Tổng quan Dự án

**TicketLab** là một nền tảng vé đầy đủ tính năng với:
- Xác thực người dùng (đăng ký/đăng nhập)
- Duyệt và lọc sự kiện theo danh mục
- Quy trình mua vé
- Tích hợp thanh toán mô phỏng
- Quản lý vé của người dùng
- Bảng điều khiển quản trị để quản lý sự kiện và đơn hàng
- Lưu trữ cơ sở dữ liệu thời gian thực

## Ngăn xếp Công nghệ

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Thư viện UI**: shadcn/ui + Tailwind CSS v4
- **Quản lý Trạng thái**: Zustand chứa dữ liệu dùng chung
- **HTTP Client**: Fetch API
- **Ngôn ngữ**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Cơ sở dữ liệu**: SQL Server 2019+
- **Xác thực**: JWT (jsonwebtoken)
- **Mã hóa Mật khẩu**: bcryptjs
- **Kiểm tra API**: Postman

## Cấu trúc Thư mục

```
ticketlab/
├── app/                          # Thư mục app Next.js
│   ├── api/                      # API routes
│   ├── dang-nhap/               # Trang đăng nhập
│   ├── dang-ky/                 # Trang đăng ký
│   ├── trang-chu/               # Trang chủ
│   ├── tim-kiem/                # Trang tìm kiếm/duyệt
│   ├── dat-ve/[id]/             # Trang đặt vé
│   ├── thanh-toan/              # Trang thanh toán
│   ├── xac-nhan-thanh-toan/     # Xác nhận thanh toán
│   ├── quan-ly-ve/              # Quản lý vé người dùng
│   └── admin/                   # Bảng điều khiển quản trị
│       ├── dashboard/
│       ├── quan-ly-ve/
│       └── quan-ly-su-kien/
├── components/                   # Components React
├── lib/
│   ├── store.ts                 # Store Zustand với tích hợp API
│   ├── api.ts                   # Utility client API
│   ├── events.ts                # Cấu trúc dữ liệu sự kiện
│   └── utils.ts                 # Hàm utility
├── public/                       # Tài sản tĩnh
├── backend/                      # Backend Express.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── orders.js
│   │   └── tickets.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── database.js
│   ├── utils/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── SETUP.md
│   └── postman_collection.json
├── database/
│   └── schema.sql               # Schema cơ sở dữ liệu SQL Server
├── .env.local                   # Biến môi trường frontend
└── FULLSTACK_README.md          # File này
```

## Bắt đầu Nhanh

### Điều kiện Tiên quyết

- Node.js v16+ và npm/yarn
- SQL Server 2019+
- Git

### 1. Thiết lập Cơ sở dữ liệu

1. Mở SQL Server Management Studio (SSMS)
2. Tạo cơ sở dữ liệu mới hoặc sử dụng cơ sở dữ liệu hiện có
3. Thực thi `database/schema.sql` để tạo bảng và dữ liệu mẫu:
   ```sql
   -- Mở database/schema.sql và chạy trong SSMS
   ```

### 2. Thiết lập Backend

```bash
# Điều hướng đến thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env với thông tin đăng nhập SQL Server của bạn
# DB_SERVER=localhost
# DB_USER=sa
# DB_PASSWORD=your_password
# DB_NAME=TicketLab
# JWT_SECRET=your_secret_key

# Khởi động server backend
npm start
# hoặc cho phát triển
npm run dev
```

Backend sẽ chạy trên `http://localhost:3001`

### 3. Thiết lập Frontend

```bash
# Trong thư mục gốc
npm install

# Tạo/cập nhật .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Khởi động server dev frontend
npm run dev
```

Frontend sẽ chạy trên `http://localhost:3000`

## Tài liệu API

### URL Cơ sở
```
http://localhost:3001/api
```

### Điểm cuối Xác thực

#### Đăng ký
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "eyJhbGc..."
}
```

#### Đăng nhập
```http
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### Điểm cuối Sự kiện

#### Lấy Tất cả Sự kiện
```http
GET /events
GET /events?category=music
```

#### Lấy Sự kiện Đơn lẻ
```http
GET /events/:id
```

#### Tạo Sự kiện (Quản trị)
```http
POST /events
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tên Sự kiện",
  "description": "Mô tả sự kiện",
  "location": "Địa điểm",
  "category": "music",
  "date": "15/07/2026",
  "price": 500000,
  "ticketTypes": [
    { "name": "VIP", "price": 500000, "quantity": 100 }
  ]
}
```

### Điểm cuối Đơn hàng

#### Tạo Đơn hàng
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "event_id": 1,
  "ticket_type_id": 1,
  "quantity": 2,
  "total_price": 1000000,
  "payment_method": "credit_card"
}
```

#### Hoàn thành Đơn hàng
```http
POST /orders/:order_id/complete
Authorization: Bearer {token}
```

### Điểm cuối Vé

#### Lấy Vé Của Tôi
```http
GET /tickets
Authorization: Bearer {token}
```

## Kiểm tra Postman

1. Nhập `backend/postman_collection.json` vào Postman
2. Đặt biến môi trường:
   - `token`: Từ phản hồi đăng nhập người dùng
   - `admin_token`: Từ phản hồi đăng nhập quản trị
3. Kiểm tra tất cả điểm cuối

### Tài khoản Kiểm tra Mẫu
- **Người dùng**: test@example.com / 123456
- **Quản trị**: admin@ticketlab.com / admin

## Tính năng

### Tính năng Người dùng
- ✅ Đăng ký và đăng nhập người dùng
- ✅ Duyệt sự kiện theo danh mục
- ✅ Tìm kiếm và lọc sự kiện
- ✅ Đặt vé với nhiều loại (VIP, Tiêu chuẩn, Kinh tế)
- ✅ Quy trình thanh toán mô phỏng
- ✅ Xác nhận thanh toán
- ✅ Xem vé đã mua
- ✅ Thiết kế đáp ứng trên di động

### Tính năng Quản trị
- ✅ Bảng điều khiển quản trị với thống kê
- ✅ Tạo, đọc, cập nhật, xóa sự kiện
- ✅ Quản lý loại vé và giá cả sự kiện
- ✅ Xem tất cả đơn hàng và doanh số
- ✅ Xem tất cả vé người dùng
- ✅ Kiểm soát truy cập dựa trên vai trò

### Tính năng Kỹ thuật
- ✅ Xác thực dựa trên JWT
- ✅ Mã hóa mật khẩu an toàn (bcrypt)
- ✅ Hoạt động cơ sở dữ liệu thời gian thực
- ✅ CORS được bật cho yêu cầu chéo nguồn gốc
- ✅ Xử lý lỗi và xác thực
- ✅ Thiết kế đáp ứng
- ✅ Xác minh vai trò quản trị

## Luồng Người dùng

### Luồng Đăng ký & Đăng nhập
1. Người dùng đăng ký với email, mật khẩu và tên
2. Backend mã hóa mật khẩu và lưu trong SQL Server
3. Token JWT được phát hành
4. Token được lưu trong localStorage
5. Người dùng được chuyển hướng dựa trên vai trò (quản trị → bảng điều khiển, người dùng → trang chủ)

### Luồng Đặt Vé Sự kiện
1. Duyệt sự kiện trên trang chủ hoặc trang tìm kiếm
2. Nhấp nút "Dat ve" (Mua vé)
3. Chọn loại vé và số lượng
4. Tiến hành đến trang thanh toán
5. Mô phỏng quy trình thanh toán
6. Nhận xác nhận thanh toán
7. Vé được thêm vào quản lý vé của người dùng
8. Có thể xem chi tiết vé bất cứ lúc nào

### Quản lý Sự kiện Quản trị
1. Đăng nhập với thông tin quản trị
2. Truy cập bảng điều khiển quản trị
3. Tạo, chỉnh sửa hoặc xóa sự kiện
4. Quản lý loại vé và giá cả
5. Xem tất cả đơn hàng và vé người dùng

## Biến Môi trường

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
# Cơ sở dữ liệu
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=TicketLab

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_secure_secret
JWT_EXPIRE=7d

# API
FRONTEND_URL=http://localhost:3000
```

## Vấn đề Thường gặp & Giải pháp

### Backend Không thể Kết nối với SQL Server
- Kiểm tra xem SQL Server có đang chạy không
- Xác minh thông tin đăng nhập trong .env
- Đảm bảo TCP/IP được bật trong SQL Server Configuration Manager
- Kiểm tra cài đặt firewall

### Cổng Đã được Sử dụng
- Thay đổi PORT trong backend .env
- Hoặc giết tiến trình: `lsof -i :3001` (Mac/Linux) hoặc `netstat -ano | findstr :3001` (Windows)

### Lỗi CORS
- Kiểm tra cấu hình CORS backend
- Xác minh FRONTEND_URL trong backend .env khớp với URL frontend của bạn
- Đảm bảo tiêu đề Authorization được định dạng đúng

### Lỗi Token
- Token có thể đã hết hạn (mặc định 7 ngày)
- Đăng nhập lại để nhận token mới
- Kiểm tra JWT_SECRET nhất quán qua các lần khởi động server

## Bảo mật API

- Mật khẩu được mã hóa với bcrypt (10 vòng salt)
- Token JWT hết hạn sau 7 ngày
- Điểm cuối quản trị yêu cầu xác minh vai trò
- Tất cả dữ liệu nhạy cảm được gửi qua HTTP (sử dụng HTTPS trong sản xuất)
- CORS chỉ bật cho URL frontend

## Schema Cơ sở dữ liệu

### Bảng
- `Users` - Tài khoản người dùng với email, mật khẩu mã hóa, vai trò
- `Events` - Thông tin sự kiện (tên, địa điểm, danh mục, ngày)
- `TicketTypes` - Danh mục vé cho mỗi sự kiện (VIP, Tiêu chuẩn, v.v.)
- `Orders` - Đơn hàng mua với trạng thái (đang chờ, hoàn thành)
- `UserTickets` - Vé người dùng đã xác nhận từ đơn hàng hoàn thành

### Mối quan hệ
- Users (1) → Nhiều Orders
- Events (1) → Nhiều TicketTypes, Orders, UserTickets
- TicketTypes (1) → Nhiều Orders
- Orders (1) → Nhiều UserTickets

## Triển khai Sản xuất

### Frontend (Vercel)
1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Đặt biến môi trường
4. Triển khai tự động

### Backend (VPS/Server)
1. Cài đặt Node.js và SQL Server trên server
2. Clone repository
3. Cấu hình .env với giá trị sản xuất
4. Sử dụng PM2 để quản lý tiến trình:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ticketlab-backend
   ```
5. Thiết lập reverse proxy với Nginx

## Hỗ trợ & Tài liệu

- Tài liệu API backend: Xem `backend/SETUP.md`
- Bộ sưu tập Postman: `backend/postman_collection.json`
- Schema Cơ sở dữ liệu: `database/schema.sql`

## Giấy phép

Dự án Riêng tư - TicketLab 2026

## Người đóng góp

Được xây dựng với Next.js, Express.js và SQL Server ❤️
