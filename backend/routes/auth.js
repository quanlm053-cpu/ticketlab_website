const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { authenticateToken } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const pool = getPool();
    
    // Check if user exists
    const existingUser = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT user_id FROM [Users] WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password_hash', sql.NVarChar, passwordHash)
      .input('name', sql.NVarChar, name)
      .query(`
        INSERT INTO [Users] (email, password_hash, name, role)
        VALUES (@email, @password_hash, @name, 'user')
        SELECT SCOPE_IDENTITY() as user_id
      `);

    const userId = result.recordset[0].user_id;
    const token = generateToken(userId, 'user');

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: userId,
        email,
        name,
        role: 'user'
      },
      token
    });
  } catch (error) {
    console.error('[AUTH] Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const pool = getPool();

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT user_id, email, password_hash, name, role FROM [Users] WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.recordset[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.user_id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .input('user_id', sql.Int, req.user.userId)
      .query(`
        SELECT user_id, email, name, role, avatar, created_at
        FROM [Users]
        WHERE user_id = @user_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: result.recordset[0]
    });
  } catch (error) {
    console.error('[AUTH] Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
