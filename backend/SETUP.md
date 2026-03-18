# TicketLab Backend Setup Guide

## Prerequisites

- Node.js v14+ installed
- SQL Server 2019+ installed and running
- npm or yarn package manager

## Installation Steps

### 1. Setup SQL Server Database

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open the `database/schema.sql` file
4. Execute the entire script to create the database, tables, and insert sample data

Alternative using command line:
```bash
sqlcmd -S localhost -U sa -P YourPassword -i database/schema.sql
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and update the following values:
```
DB_SERVER=localhost          # Your SQL Server address
DB_USER=sa                   # Your SQL Server username
DB_PASSWORD=YourPassword     # Your SQL Server password
DB_NAME=TicketLab           # Database name

JWT_SECRET=your_secret_key   # Change this to a secure random string
PORT=3001                    # Backend server port
FRONTEND_URL=http://localhost:3000  # Frontend URL
```

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server should start on `http://localhost:3001`

## Testing with Postman

### 1. Import Postman Collection

1. Open Postman
2. Click "Import" in the top-left corner
3. Select the `postman_collection.json` file from the backend folder
4. The collection will be imported with all endpoints

### 2. Set Up Variables

1. In Postman, click on the collection name and go to "Variables"
2. Set `token` and `admin_token` variables (you'll get these from login responses)

### 3. Test Endpoints

#### Authentication Flow:
1. **Register**: POST `/api/auth/register` - Create a new user account
2. **Login**: POST `/api/auth/login` - Login with email and password
3. Save the returned `token` in the Postman variable

#### Events:
- **Get All Events**: GET `/api/events` - Browse all events
- **Get Events by Category**: GET `/api/events?category=music` - Filter by category
- **Get Single Event**: GET `/api/events/1` - View event details
- **Create Event** (Admin): POST `/api/events` - Add new event
- **Update Event** (Admin): PUT `/api/events/1` - Edit event
- **Delete Event** (Admin): DELETE `/api/events/1` - Remove event

#### Orders:
- **Create Order**: POST `/api/orders` - Book a ticket
- **Get My Orders**: GET `/api/orders/user/my-orders` - View purchase history
- **Complete Order**: POST `/api/orders/1/complete` - Confirm purchase and create ticket
- **Get All Orders** (Admin): GET `/api/orders` - View all orders

#### Tickets:
- **Get My Tickets**: GET `/api/tickets` - View purchased tickets
- **Get Single Ticket**: GET `/api/tickets/1` - View ticket details
- **Get All Tickets** (Admin): GET `/api/tickets/admin/all` - View all user tickets

## Default Test Accounts

### Regular User
- Email: `test@example.com`
- Password: `123456`

### Admin User
- Email: `admin@ticketlab.com`
- Password: `admin`

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

## Common Issues

### Connection to SQL Server Failed
- Check if SQL Server is running
- Verify credentials in `.env` file
- Ensure SQL Server is configured to accept TCP/IP connections
- Check firewall settings

### Port 3001 Already in Use
- Change the PORT in `.env` to another number
- Or kill the process using port 3001:
  - Windows: `netstat -ano | findstr :3001` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -i :3001` then `kill -9 <PID>`

### Authentication Errors
- Ensure JWT_SECRET is set in `.env`
- Check that Authorization header has format: `Bearer <token>`
- Token may have expired (default is 7 days)

## Project Structure

```
backend/
├── config/
│   └── database.js          # SQL Server connection pool
├── middleware/
│   └── auth.js              # Authentication & error handling
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── events.js            # Event CRUD endpoints
│   ├── orders.js            # Order management endpoints
│   └── tickets.js           # Ticket endpoints
├── utils/
│   └── auth.js              # JWT & password utilities
├── server.js                # Express server setup
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── postman_collection.json  # Postman API collection
├── SETUP.md                 # This file
└── database/
    └── schema.sql           # SQL Server database schema
```

## Next Steps

1. Setup the frontend to use these API endpoints by updating the store to make HTTP calls instead of using mock data
2. Replace all mock data calls with actual API requests
3. Implement proper error handling in the frontend
4. Add loading states and user feedback

## Support

For issues or questions, refer to the API documentation in the Postman collection.
