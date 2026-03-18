const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const pool = getPool();

    let query = `
      SELECT e.*, 
        (SELECT COUNT(*) FROM [TicketTypes] WHERE event_id = e.event_id) as ticket_type_count
      FROM [Events] e
    `;
    
    if (category) {
      query += ` WHERE e.category = @category`;
    }

    query += ` ORDER BY e.created_at DESC`;

    const request = pool.request();
    if (category) {
      request.input('category', sql.NVarChar, category);
    }

    const result = await request.query(query);

    // Fetch ticket types for each event
    const events = await Promise.all(result.recordset.map(async (event) => {
      const ticketResult = await pool.request()
        .input('event_id', sql.Int, event.event_id)
        .query('SELECT ticket_type_id, name, price, quantity_available, quantity_sold FROM [TicketTypes] WHERE event_id = @event_id');
      
      return {
        ...event,
        ticketTypes: ticketResult.recordset
      };
    }));

    res.json({ events });
  } catch (error) {
    console.error('[EVENTS] Get all error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('event_id', sql.Int, id)
      .query('SELECT * FROM [Events] WHERE event_id = @event_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = result.recordset[0];

    // Get ticket types
    const ticketResult = await pool.request()
      .input('event_id', sql.Int, id)
      .query('SELECT ticket_type_id, name, price, quantity_available, quantity_sold FROM [TicketTypes] WHERE event_id = @event_id');

    res.json({
      event: {
        ...event,
        ticketTypes: ticketResult.recordset
      }
    });
  } catch (error) {
    console.error('[EVENTS] Get single error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, image, location, category, date, price, ticketTypes } = req.body;

    if (!name || !location || !category || !date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const pool = getPool();

    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || '')
      .input('image', sql.NVarChar, image || '')
      .input('location', sql.NVarChar, location)
      .input('category', sql.NVarChar, category)
      .input('date', sql.NVarChar, date)
      .input('price', sql.Int, price || 0)
      .query(`
        INSERT INTO [Events] (name, description, image, location, category, date, price)
        VALUES (@name, @description, @image, @location, @category, @date, @price)
        SELECT SCOPE_IDENTITY() as event_id
      `);

    const eventId = result.recordset[0].event_id;

    // Add ticket types
    if (ticketTypes && Array.isArray(ticketTypes)) {
      for (const ticket of ticketTypes) {
        await pool.request()
          .input('event_id', sql.Int, eventId)
          .input('name', sql.NVarChar, ticket.name)
          .input('price', sql.Int, ticket.price)
          .input('quantity_available', sql.Int, ticket.quantity)
          .query(`
            INSERT INTO [TicketTypes] (event_id, name, price, quantity_available)
            VALUES (@event_id, @name, @price, @quantity_available)
          `);
      }
    }

    res.status(201).json({
      message: 'Event created successfully',
      event_id: eventId
    });
  } catch (error) {
    console.error('[EVENTS] Create error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (Admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, category, date, price } = req.body;

    const pool = getPool();

    await pool.request()
      .input('event_id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || '')
      .input('location', sql.NVarChar, location)
      .input('category', sql.NVarChar, category)
      .input('date', sql.NVarChar, date)
      .input('price', sql.Int, price || 0)
      .query(`
        UPDATE [Events]
        SET name = @name, description = @description, location = @location,
            category = @category, date = @date, price = @price, updated_at = GETDATE()
        WHERE event_id = @event_id
      `);

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('[EVENTS] Update error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (Admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.request()
      .input('event_id', sql.Int, id)
      .query('DELETE FROM [Events] WHERE event_id = @event_id');

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('[EVENTS] Delete error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
