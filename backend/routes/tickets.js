const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get user tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = getPool();

    const result = await pool.request()
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT ut.*, e.name as event_name, e.date as event_date, e.location, e.image
        FROM [UserTickets] ut
        JOIN [Events] e ON ut.event_id = e.event_id
        WHERE ut.user_id = @user_id
        ORDER BY ut.purchase_date DESC
      `);

    res.json({ tickets: result.recordset });
  } catch (error) {
    console.error('[TICKETS] Get user tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get single ticket
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const pool = getPool();

    const result = await pool.request()
      .input('user_ticket_id', sql.Int, id)
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT ut.*, e.name as event_name, e.date as event_date, e.location, e.image, e.description
        FROM [UserTickets] ut
        JOIN [Events] e ON ut.event_id = e.event_id
        WHERE ut.user_ticket_id = @user_ticket_id AND ut.user_id = @user_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket: result.recordset[0] });
  } catch (error) {
    console.error('[TICKETS] Get single ticket error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Get all tickets (Admin only)
router.get('/admin/all', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query(`
        SELECT ut.*, e.name as event_name, u.email, u.name as user_name
        FROM [UserTickets] ut
        JOIN [Events] e ON ut.event_id = e.event_id
        JOIN [Users] u ON ut.user_id = u.user_id
        ORDER BY ut.purchase_date DESC
      `);

    res.json({ tickets: result.recordset });
  } catch (error) {
    console.error('[TICKETS] Get all error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
