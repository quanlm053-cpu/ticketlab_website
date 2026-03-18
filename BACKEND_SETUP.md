# Backend Setup Guide

## Installation and Running

### Step 1: Install Dependencies

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create or verify the `.env` file in the backend folder with:

```
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start the Server

Run the backend server:

```bash
npm run dev
```

or for production:

```bash
npm start
```

The server will run on `http://localhost:3001`

## Default Admin Account

- Email: `admin@ticketlab.com`
- Password: `admin`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Events
- `GET /api/events` - Get all events
- `GET /api/events?category=music` - Get events by category
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders/user/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (admin only)

### Tickets
- `GET /api/tickets` - Get user's tickets

## Troubleshooting

If you get a "Failed to fetch" error:
1. Make sure the backend server is running on port 3001
2. Check that the `NEXT_PUBLIC_API_URL` in the frontend is set to `http://localhost:3001/api`
3. Verify CORS is enabled (it is by default in this setup)
