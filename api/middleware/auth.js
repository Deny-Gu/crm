import jwt from 'jsonwebtoken';
import {REFRESH_COOKIE} from '../utils/auth-helpers.js'

export function auth(req, res, next) {
  let token;
  // 1. Сначала смотрим в заголовок Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2. Если токена нет в заголовке, смотрим в cookie (refresh-token)
  if (!token && req.cookies?.[REFRESH_COOKIE]) {
    token = req.cookies[REFRESH_COOKIE];
  }
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}