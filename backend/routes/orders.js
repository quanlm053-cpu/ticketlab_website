const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { event_id, ticket_type_id, quantity, total_price, payment_method } = req.body;
    const userId = req.user.userId;

    if (!event_id || !ticket_type_id || !quantity || !total_price) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const pool = getPool();

    // Generate order number
    const orderNumber = `TL${Date.now()}`;

    // Create order
    const result = await pool.request()
      .input('order_number', sql.NVarChar, orderNumber)
      .input('user_id', sql.Int, userId)
      .input('event_id', sql.Int, event_id)
      .input('ticket_type_id', sql.Int, ticket_type_id)
      .input('quantity', sql.Int, quantity)
      .input('total_price', sql.Int, total_price)
      .input('payment_method', sql.NVarChar, payment_method || 'credit_card')
      .input('status', sql.NVarChar, 'pending')
      .query(`
        INSERT INTO [Orders] (order_number, user_id, event_id, ticket_type_id, quantity, total_price, payment_method, status)
        VALUES (@order_number, @user_id, @event_id, @ticket_type_id, @quantity, @total_price, @payment_method, @status)
        SELECT SCOPE_IDENTITY() as order_id
      `);

    const orderId = result.recordset[0].order_id;

    res.status(201).json({
      message: 'Order created successfully',
      order_id: orderId,
      order_number: orderNumber
    });
  } catch (error) {
    console.error('[ORDERS] Create error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/user/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = getPool();

    const result = await pool.request()
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT o.*, e.name as event_name, tt.name as ticket_type_name
        FROM [Orders] o
        JOIN [Events] e ON o.event_id = e.event_id
        JOIN [TicketTypes] tt ON o.ticket_type_id = tt.ticket_type_id
        WHERE o.user_id = @user_id
        ORDER BY o.created_at DESC
      `);

    res.json({ orders: result.recordset });
  } catch (error) {
    console.error('[ORDERS] Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Complete order (create user ticket)
router.post('/:order_id/complete', authenticateToken, async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user.userId;
    const pool = getPool();

    // Get order details
    const orderResult = await pool.request()
      .input('order_id', sql.Int, order_id)
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT o.*, e.name as event_name, tt.name as ticket_type_name
        FROM [Orders] o
        JOIN [Events] e ON o.event_id = e.event_id
        JOIN [TicketTypes] tt ON o.ticket_type_id = tt.ticket_type_id
        WHERE o.order_id = @order_id AND o.user_id = @user_id
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.recordset[0];

    // Create user ticket
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('order_id', sql.Int, order_id)
      .input('event_id', sql.Int, order.event_id)
      .input('ticket_type', sql.NVarChar, order.ticket_type_name)
      .input('quantity', sql.Int, order.quantity)
      .input('total_price', sql.Int, order.total_price)
      .query(`
        INSERT INTO [UserTickets] (user_id, order_id, event_id, ticket_type, quantity, total_price)
        VALUES (@user_id, @order_id, @event_id, @ticket_type, @quantity, @total_price)
      `);

    // Update order status
    await pool.request()
      .input('order_id', sql.Int, order_id)
      .query(`
        UPDATE [Orders]
        SET status = 'completed', updated_at = GETDATE()
        WHERE order_id = @order_id
      `);

    // Update ticket type quantity sold
    await pool.request()
      .input('ticket_type_id', sql.Int, order.ticket_type_id)
      .input('quantity', sql.Int, order.quantity)
      .query(`
        UPDATE [TicketTypes]
        SET quantity_sold = quantity_sold + @quantity
        WHERE ticket_type_id = @ticket_type_id
      `);

    res.json({ 
      message: 'Order completed successfully',
      order: order
    });
  } catch (error) {
    console.error('[ORDERS] Complete error:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

// Get all orders (Admin only)
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query(`
        SELECT o.*, e.name as event_name, u.email, u.name as user_name
        FROM [Orders] o
        JOIN [Events] e ON o.event_id = e.event_id
        JOIN [Users] u ON o.user_id = u.user_id
        ORDER BY o.created_at DESC
      `);

    res.json({ orders: result.recordset });
  } catch (error) {
    console.error('[ORDERS] Get all error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
