const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER || 'localhost'};Database=${process.env.DB_NAME || 'ticketlab'};Trusted_Connection=yes;`
};

let pool;

const connectDB = async () => {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('[DB] Connected to SQL Server successfully');
    return pool;
  } catch (error) {
    console.error('[DB] Connection failed:', error);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool,
  sql
};
