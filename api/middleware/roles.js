import { pool } from '../config/db.js';

export function requireRole(roleRequired) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No token' });
    const [rows] = await pool.query(
      'SELECT role FROM users WHERE id = :id LIMIT 1',
      { id: req.user.id } // id из токена
    );
    if (!rows.length) return res.status(401).json({ message: 'User not found' });
    if (Number(rows[0].role) !== Number(roleRequired)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}