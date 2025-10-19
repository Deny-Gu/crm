import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { pool } from '../config/db.js';
import { sanitizeUser } from '../utils/validators.js';


const router = Router();

// Пример защищённого эндпоинта: профиль текущего пользователя
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = :id', { id: req.user.id });
    if (rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
      const user = rows[0];
    // Не возвращаем password_hash
    delete user.password_hash;
    if (typeof user.working_days === 'string') {
      try { user.working_days = JSON.parse(user.working_days); } catch {console.log('Error')}
    }
    return res.json({...sanitizeUser(user),  lastActivity: new Date()});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;