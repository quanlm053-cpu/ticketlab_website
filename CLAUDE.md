# CLAUDE.md — TicketLab

## Quick Commands

### Frontend (root directory)
```bash
npm run dev      # Start Next.js dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

### Backend (`/backend`)
```bash
npm run dev      # Start with nodemon (localhost:5000)
npm start        # Start without watch
```

### Full stack dev
Start both frontend and backend simultaneously. Backend must be running for API calls to work.

## Architecture

**Monorepo**: Next.js 16 frontend + Express.js backend + SQL Server

```
├── app/              # Next.js App Router pages (Vietnamese route slugs)
├── components/       # React components + shadcn/ui library in /components/ui/
├── lib/              # Zustand store, API client, utilities
├── hooks/            # Custom React hooks
├── styles/           # Global CSS (Tailwind v4, OKLCh color variables)
├── backend/
│   ├── server.js     # Express entry point (also has inline routes)
│   ├── routes/       # auth, events, orders, tickets
│   ├── middleware/    # JWT auth, role authorization, error handler
│   ├── config/       # SQL Server connection pool
│   └── utils/        # bcrypt, JWT helpers
├── database/
│   └── schema.sql    # SQL Server schema
└── public/           # Static assets
```

## Key Tech Stack

| Layer | Tech |
|-------|------|
| Frontend framework | Next.js 16.1.6 (App Router, React 19) |
| UI components | shadcn/ui (new-york style) + Radix primitives |
| State management | Zustand (`useAuthStore` in `lib/store.ts`) |
| Styling | Tailwind CSS v4 |
| Forms | react-hook-form + zod validation |
| Backend | Express.js 4.18 |
| Database | SQL Server via `mssql` package (raw SQL, no ORM) |
| Auth | JWT (7-day expiry), bcrypt passwords, Bearer token header |

## Conventions

### Vietnamese Route Names
All public-facing routes use Vietnamese slugs:
- `/dang-nhap` (login), `/dang-ky` (register)
- `/trang-chu` (home), `/tim-kiem` (search)
- `/chi-tiet-su-kien/[id]` (event detail), `/dat-ve/[id]` (booking)
- `/thanh-toan` (payment), `/xac-nhan-thanh-toan` (confirmation)
- `/quan-ly-ve` (ticket management), `/tai-khoan` (account)
- `/admin/dashboard`, `/admin/quan-ly-su-kien`, `/admin/quan-ly-ve`

### Component Patterns
- `"use client"` directive on all interactive components
- Props interfaces defined above component
- PascalCase component names, kebab-case file names
- Route protection via `useEffect` checking `isAuthenticated` and `user.role`

### Backend Patterns
- Parameterized SQL queries via `pool.request().input().query()`
- Console logging with `[TAG]` prefixes (e.g., `[AUTH]`, `[EVENTS]`)
- JWT claims: `{ userId, role }`
- Order flow: Pending → Completed (creates UserTickets)

### Path Alias
`@/*` maps to project root (configured in tsconfig.json)

## Environment Variables

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:5000/api`)

**Backend** (`.env`, see `.env.example`):
- `DB_SERVER`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — SQL Server connection
- `PORT` — Express port (default: 5000)
- `JWT_SECRET` — Token signing key
- `FRONTEND_URL` — For CORS config

## Database
- SQL Server 2019+
- Schema in `/database/schema.sql`
- Tables: `Users`, `Events`, `TicketTypes`, `Orders`, `UserTickets`
- IDENTITY primary keys, foreign key constraints
- Indexes on email, category, event_id, user_id, status

## API Endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/events`, `GET /api/events/:id`
- `POST /api/orders`, `GET /api/orders/user/my-orders`, `POST /api/orders/:id/complete`
- `GET /api/tickets`, `GET /api/tickets/:id`, `GET /api/tickets/admin/all`

## Color Scheme
- Primary: `#2d5f5d` (dark teal)
- Accent: `#c8a96e` (gold)
- Dark text: `#1a1a1a`
