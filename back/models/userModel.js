import pool from '../config/db.js';

export const UserModel = {
  // Find a user by email
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Insert a new user registration record
  async create({ name, email, password, role }) {
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'lecturer']
    );
    return result.insertId;
  }
};