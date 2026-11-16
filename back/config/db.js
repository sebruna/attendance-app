import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'attendance_tracker_db',
  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0,
});

console.log("💾 MySQL Database Connection Pool initialized.");
export default pool;