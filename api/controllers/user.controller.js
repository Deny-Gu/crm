
import { pool } from '../config/db.js';
import { sanitizeUser } from '../utils/validators.js';

export async function updateWorkingDays(req, res) {
  try {
    const { id } = req.params;             // id пользователя
    const { workingDays } = req.body;      // новые рабочие дни

    // простая валидация
    if (!Array.isArray(workingDays)) {
      return res.status(400).json({
        message: '`workingDays` должен быть массивом',
      });
    }

    // обновляем
    const [result] = await pool.query(
      `UPDATE users
       SET working_days = :working_days,
           last_activity = NOW()
       WHERE id = :id`,
      {
        id,
        working_days: JSON.stringify(workingDays),
      }
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // получаем обновлённого пользователя
    const [rows] = await pool.query('SELECT * FROM users WHERE id = :id', { id });
    const user = sanitizeUser(rows[0]);

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
