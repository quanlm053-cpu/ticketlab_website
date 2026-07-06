# TicketLab - Full Stack Ticket Booking System

A complete web application for online event ticket booking built with Next.js 16, Express.js, and SQL Server.

## Project Overview

**TicketLab** is a full-featured ticketing platform with:
- User authentication (register/login)
- Event browsing and filtering by category
- Ticket purchase workflow
- Payment integration
- User ticket management
- Admin dashboard for event and order management
- Real-time database persistence

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Fetch API
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQL Server 2019+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **API Testing**: Postman

## Directory Structure

```
ticketlab/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── dang-nhap/               # Login page
│   ├── dang-ky/                 # Register page
│   ├── trang-chu/               # Home page
│   ├── tim-kiem/                # Search/browse page
│   ├── dat-ve/[id]/             # Ticket booking page
│   ├── thanh-toan/              # Payment page
│   ├── xac-nhan-thanh-toan/     # Payment confirmation
│   ├── quan-ly-ve/              # User ticket management
│   └── admin/                   # Admin dashboard
│       ├── dashboard/
│       ├── quan-ly-ve/
│       └── quan-ly-su-kien/
├── components/                   # React components
├── lib/
│   ├── store.ts                 # Zustand store with API integration
│   ├── api.ts                   # API client utility
│   ├── events.ts                # Event data structures
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
├── backend/                      # Express.js backend
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
│   └── schema.sql               # SQL Server database schema
├── .env.local                   # Frontend environment variables
└── FULLSTACK_README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js v16+ and npm/yarn
- SQL Server 2019+
- Git

### 1. Database Setup

1. Open SQL Server Management Studio (SSMS)
2. Create a new database or use existing one
3. Execute `database/schema.sql` to create tables and sample data:
   ```sql
   -- Open database/schema.sql and run in SSMS
   ```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your SQL Server credentials
# DB_SERVER=localhost
# DB_USER=sa
# DB_PASSWORD=your_password
# DB_NAME=TicketLab
# JWT_SECRET=your_secret_key

# Start backend server
npm start
# or for development
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# In root directory
npm install

# Create/update .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register
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

#### Login
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

### Events Endpoints

#### Get All Events
```http
GET /events
GET /events?category=music
```

#### Get Single Event
```http
GET /events/:id
```

#### Create Event (Admin)
```http
POST /events
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Event Name",
  "description": "Event description",
  "location": "Venue",
  "category": "music",
  "date": "15/07/2026",
  "price": 500000,
  "ticketTypes": [
    { "name": "VIP", "price": 500000, "quantity": 100 }
  ]
}
```

### Orders Endpoints

#### Create Order
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

#### Complete Order
```http
POST /orders/:order_id/complete
Authorization: Bearer {token}
```

### Tickets Endpoints

#### Get My Tickets
```http
GET /tickets
Authorization: Bearer {token}
```

## Postman Testing

1. Import `backend/postman_collection.json` into Postman
2. Set environment variables:
   - `token`: From user login response
   - `admin_token`: From admin login response
3. Test all endpoints

### Sample Test Accounts
- **User**: test@example.com / 123456
- **Admin**: admin@ticketlab.com / admin

## Features

### User Features
- ✅ User registration and login
- ✅ Browse events by category
- ✅ Search and filter events
- ✅ Book tickets with multiple types (VIP, Standard, Economy)
- ✅ Simulated payment process
- ✅ Payment confirmation
- ✅ View purchased tickets
- ✅ Responsive mobile design

### Admin Features
- ✅ Admin dashboard with stats
- ✅ Create, read, update, delete events
- ✅ Manage event ticket types and pricing
- ✅ View all orders and sales
- ✅ View all user tickets
- ✅ Role-based access control

### Technical Features
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Real-time database operations
- ✅ CORS enabled for cross-origin requests
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Admin role verification

## User Flows

### Registration & Login Flow
1. User registers with email, password, and name
2. Backend hashes password and stores in SQL Server
3. JWT token issued
4. Token stored in localStorage
5. User redirected based on role (admin → dashboard, user → home)

### Event Booking Flow
1. Browse events on home or search page
2. Click "Dat ve" (Buy ticket) button
3. Select ticket type and quantity
4. Proceed to payment page
5. Simulate payment process
6. Receive payment confirmation
7. Ticket added to user's ticket management
8. Can view ticket details anytime

### Admin Event Management
1. Login with admin credentials
2. Access admin dashboard
3. Create, edit, or delete events
4. Manage ticket types and pricing
5. View all orders and user tickets

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
# Database
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

## Common Issues & Solutions

### Backend Won't Connect to SQL Server
- Check if SQL Server is running
- Verify credentials in .env
- Ensure TCP/IP is enabled in SQL Server Configuration Manager
- Check firewall settings

### Port Already in Use
- Change PORT in backend .env
- Or kill the process: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)

### CORS Errors
- Check backend CORS configuration
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Ensure Authorization header is properly formatted

### Token Errors
- Token may be expired (7 days default)
- Re-login to get a new token
- Check that JWT_SECRET is consistent across server restarts

## API Security

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Admin endpoints require role verification
- All sensitive data is sent over HTTP (use HTTPS in production)
- CORS enabled only for frontend URL

## Database Schema

### Tables
- `Users` - User accounts with email, hashed password, role
- `Events` - Event information (name, location, category, date)
- `TicketTypes` - Ticket categories for each event (VIP, Standard, etc.)
- `Orders` - Purchase orders with status (pending, completed)
- `UserTickets` - Confirmed user tickets from completed orders

### Relationships
- Users (1) → Many Orders
- Events (1) → Many TicketTypes, Orders, UserTickets
- TicketTypes (1) → Many Orders
- Orders (1) → Many UserTickets

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Backend (VPS/Server)
1. Install Node.js and SQL Server on server
2. Clone repository
3. Configure .env with production values
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ticketlab-backend
   ```
5. Set up reverse proxy with Nginx

## Support & Documentation

- Backend API docs: See `backend/SETUP.md`
- Postman Collection: `backend/postman_collection.json`
- Database Schema: `database/schema.sql`

## License

Private Project - TicketLab 2026

## Contributors

Built with Next.js, Express.js, and SQL Server ❤️
