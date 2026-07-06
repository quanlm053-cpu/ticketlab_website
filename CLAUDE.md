# CLAUDE.md — TicketLab

## Các Lệnh Nhanh

### Frontend (thư mục gốc)
```bash
npm run dev      # Khởi động Next.js dev server (localhost:3000)
npm run build    # Build cho production
npm run start    # Chạy server production
npm run lint     # ESLint
```

### Backend (`/backend`)
```bash
npm run dev      # Chạy với nodemon (localhost:5000)
npm start        # Chạy không watch mode
```

### Full stack dev
Khởi động cả frontend và backend cùng lúc. Backend phải chạy để các API call hoạt động.

## Kiến Trúc

**Monorepo**: Frontend Next.js 16 + Backend Express.js + SQL Server

```
├── app/              # Trang Next.js App Router (route slug tiếng Việt)
├── components/       # React components + thư viện shadcn/ui trong /components/ui/
├── lib/              # Zustand store, API client, utilities
├── hooks/            # Custom React hooks
├── styles/           # Global CSS (Tailwind v4, biến màu OKLCh)
├── backend/
│   ├── server.js     # Express entry point (cũng chứa inline routes)
│   ├── routes/       # auth, events, orders, tickets
│   ├── middleware/    # JWT auth, role authorization, error handler
│   ├── config/       # SQL Server connection pool
│   └── utils/        # bcrypt, JWT helpers
├── database/
│   └── schema.sql    # Schema SQL Server
└── public/           # Tài nguyên tĩnh
```

## Tech Stack Chính

| Lớp | Công Nghệ |
|-------|------|
| Frontend framework | Next.js 16.1.6 (App Router, React 19) |
| UI components | shadcn/ui (kiểu new-york) + Radix primitives |
| State management | Zustand (`useAuthStore` trong `lib/store.ts`) |
| Styling | Tailwind CSS v4 |
| Forms | react-hook-form + zod validation |
| Backend | Express.js 4.18 |
| Database | SQL Server qua `mssql` package (raw SQL, không ORM) |
| Auth | JWT (hết hạn 7 ngày), bcrypt passwords, Bearer token header |

## Quy Ước

### Tên Route Tiếng Việt
Tất cả route công khai dùng slug tiếng Việt:
- `/dang-nhap` (đăng nhập), `/dang-ky` (đăng ký)
- `/trang-chu` (trang chủ), `/tim-kiem` (tìm kiếm)
- `/chi-tiet-su-kien/[id]` (chi tiết sự kiện), `/dat-ve/[id]` (đặt vé)
- `/thanh-toan` (thanh toán), `/xac-nhan-thanh-toan` (xác nhận thanh toán)
- `/quan-ly-ve` (quản lý vé), `/tai-khoan` (tài khoản)
- `/admin/dashboard`, `/admin/quan-ly-su-kien`, `/admin/quan-ly-ve`

### Quy Ước Component
- Directive `"use client"` trên tất cả interactive components
- Props interfaces được định nghĩa trước component
- Tên component PascalCase, tên file kebab-case
- Route protection qua `useEffect` kiểm tra `isAuthenticated` và `user.role`

### Quy Ước Backend
- Parameterized SQL queries qua `pool.request().input().query()`
- Console logging với tiền tố `[TAG]` (ví dụ: `[AUTH]`, `[EVENTS]`)
- JWT claims: `{ userId, role }`
- Quy trình Order: Pending → Completed (tạo UserTickets)

### Path Alias
`@/*` ánh xạ đến thư mục gốc dự án (cấu hình trong tsconfig.json)

## Biến Môi Trường

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` — URL cơ sở API Backend (mặc định: `http://localhost:5000/api`)

**Backend** (`.env`, xem `.env.example`):
- `DB_SERVER`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — Kết nối SQL Server
- `PORT` — Cổng Express (mặc định: 5000)
- `JWT_SECRET` — Khóa ký token
- `FRONTEND_URL` — Cho cấu hình CORS

## Database
- SQL Server 2019+
- Schema trong `/database/schema.sql`
- Bảng: `Users`, `Events`, `TicketTypes`, `Orders`, `UserTickets`
- IDENTITY primary keys, foreign key constraints
- Index trên email, category, event_id, user_id, status

## API Endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/events`, `GET /api/events/:id`
- `POST /api/orders`, `GET /api/orders/user/my-orders`, `POST /api/orders/:id/complete`
- `GET /api/tickets`, `GET /api/tickets/:id`, `GET /api/tickets/admin/all`

## Bảng Màu
- Màu chính: `#2d5f5d` (xanh teal đậm)
- Màu nhấn: `#c8a96e` (vàng gold)
- Văn bản tối: `#1a1a1a`
