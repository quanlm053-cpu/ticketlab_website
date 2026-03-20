# Tài liệu API

## URL Cơ Sở
- **Phát triển cục bộ:** `http://localhost:5000`

> **Lưu ý:** Tất cả các điểm cuối được xác thực yêu cầu tiêu đề mã thông báo bearer:
> `Authorization: Bearer <token>`

---

## Xác thực

### Đăng ký Người dùng
- **Phương thức:** `POST`
- **Điểm cuối:** `/api/auth/register`
- **Thân (JSON):**
  - `name` (chuỗi, bắt buộc)
  - `email` (chuỗi, bắt buộc)
  - `password` (chuỗi, bắt buộc, tối thiểu 6 ký tự)

**Phản hồi (201):**
```json
{
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "user_id": 1,
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

### Đăng nhập
- **Phương thức:** `POST`
- **Điểm cuối:** `/api/auth/login`
- **Thân (JSON):**
  - `email` (chuỗi, bắt buộc)
  - `password` (chuỗi, bắt buộc)

**Phản hồi (200):**
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "user_id": 1,
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

### Lấy Người dùng Hiện tại
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/auth/me`
- **Xác thực:** Bắt buộc

**Phản hồi (200):**
```json
{
  "user": {
    "user_id": 1,
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

---

## Sự kiện

### Lấy danh sách Sự kiện
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/events`
- **Tham số Truy vấn:**
  - `category` (tùy chọn)

**Phản hồi (200):**
```json
{
  "events": [ ... ],
  "total": 10
}
```

### Lấy Sự kiện Theo ID
- **Phương thức:** `GET` 
- **Điểm cuối:** `/api/events/:id`

**Phản hồi (200):**
```json
{ "event": { ... } }
```

### Tạo Sự kiện (Chỉ dành cho Quản trị viên)
- **Phương thức:** `POST`
- **Điểm cuối:** `/api/events`
- **Xác thực:** Bắt buộc (quản trị viên)
- **Thân (JSON):**
  - `name` (chuỗi)
  - `description` (chuỗi)
  - `location` (chuỗi)
  - `category` (chuỗi)
  - `date` (chuỗi, ví dụ: `2026-05-01`)
  - `price` (số)
  - `image` (chuỗi URL/đường dẫn)
  - `ticketTypes` (mảng các đối tượng)
    - `{ name, price, quantity }`

**Phản hồi (201):**
```json
{ "message": "Event created", "event": { ... } }
```

### Cập nhật Sự kiện (Chỉ dành cho Quản trị viên)
- **Phương thức:** `PUT`
- **Điểm cuối:** `/api/events/:id`
- **Xác thực:** Bắt buộc (quản trị viên)
- **Thân (JSON):**
  - `name`, `description`, `location`, `category`, `date`, `price`, `image`

**Phản hồi (200):**
```json
{ "message": "Event updated successfully" }
```

### Xóa Sự kiện (Chỉ dành cho Quản trị viên)
- **Phương thức:** `DELETE`
- **Điểm cuối:** `/api/events/:id`
- **Xác thực:** Bắt buộc (quản trị viên)

**Phản hồi (200):**
```json
{ "message": "Event deleted successfully" }
```

---

## Đơn hàng

### Tạo Đơn hàng
- **Phương thức:** `POST`
- **Điểm cuối:** `/api/orders`
- **Xác thực:** Bắt buộc
- **Thân (JSON):**
  - `event_id` (số)
  - `ticket_type_id` (số) HOẶC `ticket_type_name` (chuỗi)
  - `quantity` (số)
  - `total_price` (số)
  - `payment_method` (chuỗi, tùy chọn, mặc định: `credit-card`)

**Phản hồi (201):**
```json
{ "message": "Order created", "order": { ... } }
```

### Lấy Đơn hàng Của Riêng Tôi
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/orders/user/my-orders`
- **Xác thực:** Bắt buộc

**Phản hồi (200):**
```json
{ "orders": [ ... ] }
```

### Lấy Tất cả Đơn hàng (Chỉ dành cho Quản trị viên)
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/orders`
- **Xác thực:** Bắt buộc (quản trị viên)

**Phản hồi (200):**
```json
{ "orders": [ ... ] }
```

---

## Vé

### Lấy Vé Của Người dùng
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/tickets`
- **Xác thực:** Bắt buộc

**Phản hồi (200):**
```json
{ "tickets": [ ... ] }
```

### Lấy Tất cả Vé (Chỉ dành cho Quản trị viên)
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/tickets/admin/all`
- **Xác thực:** Bắt buộc (quản trị viên)

**Phản hồi (200):**
```json
{ "tickets": [ ... ] }
```

---

## Tải lên

### Tải lên Hình ảnh
- **Phương thức:** `POST`
- **Điểm cuối:** `/api/upload`
- **Xác thực:** Bắt buộc
- **Content-Type:** `multipart/form-data`
- **Trường biểu mẫu:** `image` (tệp)

**Phản hồi (200):**
```json
{ "imagePath": "/images/event-..." }
```

---

## Thống kê Quản trị

### Lấy Thống kê Bảng điều khiển (Chỉ dành cho Quản trị viên)
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/admin/stats`
- **Xác thực:** Bắt buộc (quản trị viên)

**Phản hồi (200):**
```json
{ "stats": { "totalEvents": 10, "totalTicketsSold": 200, "totalRevenue": 7500 } }
```

---

## Kiểm tra Sức khỏe

### Sức khỏe
- **Phương thức:** `GET`
- **Điểm cuối:** `/api/health`

**Phản hồi (200):**
```json
{ "status": "ok", "message": "Server is running" }
```

---

## Ghi chú
- Máy chủ sử dụng SQL Server với Xác thực Windows theo mặc định.
- Thông tin đăng nhập quản trị viên mặc định hiển thị trong bảng điều khiển khi máy chủ khởi động: `admin@ticketlab.com / admin`.
- Đặt `JWT_SECRET` trong `.env` để bảo mật mã thông báo JWT.
