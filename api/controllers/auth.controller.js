import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { validateRegisterBody, sanitizeUser } from "../utils/validators.js";
import {
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
  clearRefreshCookie
} from "../utils/auth-helpers.js";
import jwt from "jsonwebtoken";

const errorAuth =
  "Неверные учетные данные.\nЛогин и пароль могут быть чувствительны к регистру.";

export async function register(req, res) {
  try {
    const body = req.body || {};
    const errors = validateRegisterBody(body);
    if (errors.length) return res.status(400).json({ message: "Validation error", errors });

    const { login, password, fullName, city, district, transportMode, contacts, telegram, workingDays } = body;

    const [existsRows] = await pool.query("SELECT id FROM users WHERE login = :login", { login });
    if (existsRows.length > 0) {
      return res.status(409).json({ message: "Пользователь с таким логином уже существует" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (login, password_hash, full_name, city, district, transport_mode, contacts, telegram, registered_at, last_activity, working_days)
       VALUES (:login, :password_hash, :full_name, :city, :district, :transport_mode, :contacts, :telegram, NOW(), NOW(), :working_days)`,
      {
        login,
        password_hash,
        full_name: fullName,
        city: city || null,
        district: district || null,
        transport_mode: transportMode || null,
        contacts: contacts || null,
        telegram: telegram || null,
        working_days: workingDays ? JSON.stringify(workingDays) : null,
      }
    );

    const [rows] = await pool.query("SELECT * FROM users WHERE id = :id", { id: result.insertId });
    const user = sanitizeUser(rows[0]);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      user,
      accessToken // фронт хранит в памяти и шлёт в Authorization
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { login, password } = req.body || {};
    if (!login || !password) {
      return res.status(400).json({ message: "login и password обязательны" });
    }

    const [rows] = await pool.query(
      `SELECT id, login, password_hash, full_name, city, district, transport_mode,
              contacts, telegram, working_days, registered_at, last_activity, role
         FROM users
        WHERE BINARY login = :login
        LIMIT 1`,
      { login }
    );

    if (rows.length === 0) return res.status(401).json({ message: errorAuth });

    const row = rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ message: errorAuth });

    await pool.query("UPDATE users SET last_activity = NOW() WHERE id = :id", { id: row.id });

    const user = sanitizeUser({ ...row, last_activity: new Date() });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.json({ user, accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// выдаём новый accessToken, если refresh cookie валиден
export async function refresh(req, res) {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.tokenType !== "refresh")
      return res.status(401).json({ message: "Invalid token" });

    // при желании проверяйте в БД отозван ли refresh-token
    const [rows] = await pool.query("SELECT * FROM users WHERE id = :id", { id: payload.id });
    if (rows.length === 0) return res.status(401).json({ message: "User not found" });

    const user = sanitizeUser(rows[0]);
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function logout(req, res) {
  try {
    clearRefreshCookie(res);
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
