import { pool } from '../config/db.js';
import { sanitizeUser } from '../utils/validators.js';

export async function listMasters(req, res) {
  try {
    // опциональная пагинация/поиск
    const q = String(req.query.q || '').trim();
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const page  = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM users WHERE role = 0';
    const params = {};

    if (q) {
      sql += ' AND (login LIKE :q OR full_name LIKE :q OR city LIKE :q OR district LIKE :q)';
      params.q = `%${q}%`;
    }

    sql += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.query(sql, params);
    const items = rows.map(sanitizeUser);

    return res.json({ page, limit, count: items.length, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getMasterById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    // Берём только мастера (role = 0)
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = :id AND role = 0 LIMIT 1',
      { id }
    );

    if (!rows.length) {
      // не палим наличие других ролей — отвечаем 404
      return res.status(404).json({ message: 'User not found' });
    }

    const user = sanitizeUser(rows[0]);
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}