import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import userRoutes from './routes/user.routes.js';
import mastersRoutes from './routes/masters.routes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS больше не нужен для Vercel-домена, но оставим безопасно:
app.use(cors({
  origin: ['https://crm-yv9s.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));

// Проверка соединения с БД
app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ status: 'db_not_ok', error: error.message });
  }
});

// Твои маршруты
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', userRoutes);
app.use('/api', mastersRoutes);

// ❗ Экспортируем Express-приложение как handler
export default app;
