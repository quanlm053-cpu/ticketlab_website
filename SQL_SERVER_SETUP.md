# SQL Server Setup Guide

## Chuẩn bị

Đảm bảo SQL Server đang chạy trên máy của bạn.

### Connection Details
- **Server**: localhost
- **Database**: ticketlab  
- **User**: sa
- **Password**: Quan@12345

## Bước 1: Tạo Database

Chạy lệnh sau trong SQL Server Management Studio (SSMS):

```sql
CREATE DATABASE ticketlab;
```

## Bước 2: Chạy SQL Setup Script

Mở file `/backend/database/create-tables.sql` trong SSMS và chạy nó. Script này sẽ:
- Tạo các bảng (users, events, orders, tickets, ticket_types)
- Thêm dữ liệu mẫu (admin user, sample event)

## Bước 3: Cài đặt Dependencies

Vào thư mục backend và chạy:

```bash
cd backend
npm install
```

Nếu chưa có file `package.json`, chạy:

```bash
npm init -y
npm install express cors mssql bcryptjs jsonwebtoken dotenv
```

## Bước 4: Chạy Backend Server

```bash
cd backend
npm run dev
```

hoặc

```bash
node server.js
```

Server sẽ chạy trên `http://localhost:5000`

## Thông tin đăng nhập mẫu

- **Email**: admin@ticketlab.com
- **Password**: admin

## Troubleshooting

### Lỗi "Server không tìm thấy"
- Kiểm tra SQL Server có đang chạy
- Kiểm tra connection string trong `.env`

### Lỗi "Authentication failed"
- Kiểm tra username và password
- Đảm bảo SQL Server được cấu hình để cho phép SQL Server Authentication

### Lỗi "Database không tìm thấy"
- Chạy CREATE DATABASE ticketlab trước
- Chạy file `create-tables.sql`

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin người dùng (cần JWT)

### Events
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/events/:id` - Lấy chi tiết sự kiện
- `POST /api/events` - Tạo sự kiện (cần admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/user/my-orders` - Lấy đơn hàng của bản thân
- `GET /api/orders` - Lấy tất cả đơn hàng (cần admin)

### Tickets
- `GET /api/tickets` - Lấy vé của bản thân
