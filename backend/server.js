require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql/msnodesqlv8');
const multer = require('multer');
const path = require('path');

const app = express();

// Multer config — save to frontend's public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// SQL Server configuration (Windows Authentication)
const sqlConfig = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER || 'localhost'};Database=${process.env.DB_NAME || 'ticketlab'};Trusted_Connection=yes;`
};

let pool;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    console.log('[DATABASE] Connected to SQL Server successfully');
  } catch (error) {
    console.error('[DATABASE] Connection failed:', error);
    process.exit(1);
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
// Utilities
const hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

const comparePassword = (password, hash) => {
  return bcryptjs.compareSync(password, hash);
};

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Routes - Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const checkEmailQuery = 'SELECT COUNT(*) as count FROM users WHERE email = @email';
    const checkResult = await pool.request().input('email', sql.NVarChar, email).query(checkEmailQuery);
    
    if (checkResult.recordset[0].count > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = hashPassword(password);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES (@name, @email, @password, 'user');
      SELECT SCOPE_IDENTITY() as user_id;
    `;

    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(insertQuery);

    const userId = result.recordset[0].user_id;
    const newUser = { user_id: userId, name, email, role: 'user' };
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user from database
    const query = 'SELECT user_id, name, email, password, role FROM users WHERE email = @email';
    const result = await pool.request().input('email', sql.NVarChar, email).query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.recordset[0];

    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT user_id, name, email, role FROM users WHERE user_id = @userId';
    const result = await pool.request().input('userId', sql.Int, req.user.user_id).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.recordset[0];
    res.json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Routes - Events
app.get('/api/events', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM events';
    const request = pool.request();

    if (category) {
      query += ' WHERE category = @category';
      request.input('category', sql.NVarChar, category);
    }

    const result = await request.query(query);

    res.json({
      events: result.recordset,
      total: result.recordset.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const query = `
      SELECT e.*, 
             (SELECT * FROM ticket_types WHERE event_id = e.event_id FOR JSON PATH) as ticketTypes
      FROM events e
      WHERE e.event_id = @eventId
    `;
    
    const result = await pool.request().input('eventId', sql.Int, req.params.id).query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);

    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, description, location, category, date, price, image, ticketTypes } = req.body;

    const insertEventQuery = `
      INSERT INTO events (name, description, location, category, event_date, price, image)
      VALUES (@name, @description, @location, @category, @date, @price, @image);
      SELECT SCOPE_IDENTITY() as event_id;
    `;

    const eventResult = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('location', sql.NVarChar, location)
      .input('category', sql.NVarChar, category)
      .input('date', sql.NVarChar, date)
      .input('price', sql.Int, price)
      .input('image', sql.NVarChar, image)
      .query(insertEventQuery);

    const eventId = eventResult.recordset[0].event_id;

    // Insert ticket types
    if (ticketTypes && ticketTypes.length > 0) {
      for (const ticket of ticketTypes) {
        await pool.request()
          .input('eventId', sql.Int, eventId)
          .input('name', sql.NVarChar, ticket.name)
          .input('price', sql.Int, ticket.price)
          .input('quantity', sql.Int, ticket.quantity)
          .query('INSERT INTO ticket_types (event_id, name, price, quantity) VALUES (@eventId, @name, @price, @quantity)');
      }
    }

    res.status(201).json({ message: 'Event created', event: { event_id: eventId, ...req.body } });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event (admin only)
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);

    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, description, location, category, date, price, image } = req.body;
    const eventId = req.params.id;

    const updateQuery = `
      UPDATE events SET
        name = @name, description = @description, location = @location,
        category = @category, event_date = @date, price = @price, image = @image
      WHERE event_id = @eventId
    `;

    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('location', sql.NVarChar, location)
      .input('category', sql.NVarChar, category)
      .input('date', sql.NVarChar, date)
      .input('price', sql.Int, price)
      .input('image', sql.NVarChar, image)
      .input('eventId', sql.Int, eventId)
      .query(updateQuery);

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('[EVENTS] Update error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event (admin only)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);

    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const eventId = req.params.id;

    // Delete related records in order (FK constraints)
    await pool.request().input('eventId', sql.Int, eventId).query('DELETE FROM tickets WHERE event_id = @eventId');
    await pool.request().input('eventId', sql.Int, eventId).query('DELETE FROM orders WHERE event_id = @eventId');
    await pool.request().input('eventId', sql.Int, eventId).query('DELETE FROM ticket_types WHERE event_id = @eventId');
    await pool.request().input('eventId', sql.Int, eventId).query('DELETE FROM events WHERE event_id = @eventId');

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('[EVENTS] Delete error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Routes - Orders
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { event_id, ticket_type_id, ticket_type_name, quantity, total_price, payment_method } = req.body;

    // Check if event exists
    const eventCheck = await pool.request().input('eventId', sql.Int, event_id).query('SELECT event_id FROM events WHERE event_id = @eventId');
    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Resolve ticket_type_id from name if not provided
    let resolvedTicketTypeId = ticket_type_id || null;
    if (!resolvedTicketTypeId && ticket_type_name) {
      const ttResult = await pool.request()
        .input('eventId2', sql.Int, event_id)
        .input('ttName', sql.NVarChar, ticket_type_name)
        .query('SELECT ticket_type_id FROM ticket_types WHERE event_id = @eventId2 AND name = @ttName');
      if (ttResult.recordset.length > 0) {
        resolvedTicketTypeId = ttResult.recordset[0].ticket_type_id;
      }
    }

    // Create order
    const insertOrderQuery = `
      INSERT INTO orders (user_id, event_id, ticket_type_id, quantity, total_price, payment_method, status)
      VALUES (@userId, @eventId, @ticketTypeId, @quantity, @totalPrice, @paymentMethod, 'completed');
      SELECT SCOPE_IDENTITY() as order_id;
    `;

    const result = await pool.request()
      .input('userId', sql.Int, req.user.user_id)
      .input('eventId', sql.Int, event_id)
      .input('ticketTypeId', sql.Int, resolvedTicketTypeId)
      .input('quantity', sql.Int, quantity)
      .input('totalPrice', sql.Int, total_price)
      .input('paymentMethod', sql.NVarChar, payment_method || 'credit-card')
      .query(insertOrderQuery);

    const orderId = result.recordset[0].order_id;

    // Create tickets for each quantity
    for (let i = 0; i < quantity; i++) {
      const ticketCode = `TL${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      await pool.request()
        .input('orderId', sql.Int, orderId)
        .input('userId', sql.Int, req.user.user_id)
        .input('eventId', sql.Int, event_id)
        .input('ticketTypeId', sql.Int, resolvedTicketTypeId)
        .input('ticketCode', sql.NVarChar, ticketCode)
        .query('INSERT INTO tickets (order_id, user_id, event_id, ticket_type_id, ticket_code) VALUES (@orderId, @userId, @eventId, @ticketTypeId, @ticketCode)');
    }

    res.status(201).json({ message: 'Order created', order: { order_id: orderId, user_id: req.user.user_id, ...req.body } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/user/my-orders', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM orders WHERE user_id = @userId';
    const result = await pool.request().input('userId', sql.Int, req.user.user_id).query(query);
    res.json({ orders: result.recordset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);
    
    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.request().query('SELECT * FROM orders');
    res.json({ orders: result.recordset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Routes - Tickets (admin/all MUST be before /api/tickets to avoid param conflict)
app.get('/api/tickets/admin/all', authenticateToken, async (req, res) => {
  try {
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);

    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const query = `
      SELECT t.*, e.name as event_name, e.event_date,
             u.name as customer_name, u.email as customer_email,
             tt.name as ticket_type_name, tt.price as ticket_price
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.event_id
      LEFT JOIN users u ON t.user_id = u.user_id
      LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
    `;
    const result = await pool.request().query(query);
    res.json({ tickets: result.recordset });
  } catch (error) {
    console.error('[TICKETS] Admin all error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT t.*, e.name as event_name, e.image as event_image, e.location, e.event_date,
             tt.name as ticket_type_name, tt.price as ticket_price
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.event_id
      LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
      WHERE t.user_id = @userId
    `;
    const result = await pool.request().input('userId', sql.Int, req.user.user_id).query(query);
    res.json({ tickets: result.recordset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Routes - Upload image
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  const imagePath = '/images/' + req.file.filename;
  console.log('[UPLOAD] Saved:', imagePath);
  res.json({ imagePath });
});

// Routes - Admin Stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const userQuery = 'SELECT role FROM users WHERE user_id = @userId';
    const userResult = await pool.request().input('userId', sql.Int, req.user.user_id).query(userQuery);

    if (userResult.recordset.length === 0 || userResult.recordset[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM events) as totalEvents,
        (SELECT ISNULL(SUM(quantity), 0) FROM orders WHERE status = 'completed') as totalTicketsSold,
        (SELECT ISNULL(SUM(total_price), 0) FROM orders WHERE status = 'completed') as totalRevenue
    `;
    const result = await pool.request().query(statsQuery);
    res.json({ stats: result.recordset[0] });
  } catch (error) {
    console.error('[ADMIN] Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on http://localhost:${PORT}`);
      console.log(`[SERVER] Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`[SERVER] Database: ${sqlConfig.database}`);
      console.log(`[SERVER] Sample admin login: admin@ticketlab.com / admin`);
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
