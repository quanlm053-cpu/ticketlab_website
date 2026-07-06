const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mã hóa mật khẩu
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// So sánh mật khẩu
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Tạo JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Xác minh JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};
