const { verifyToken } = require('../utils/auth');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);
  
  if (err.isJoi) {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  errorHandler
};
