import jwt from "jsonwebtoken";

export const REFRESH_COOKIE = "refresh_token";

function parseExpiresToMs(expiresIn, fallbackDays = 7) {
  if (typeof expiresIn === "number") return expiresIn * 1000;
  const m = String(expiresIn || "").match(/^(\d+)([smhd])?$/i);
  if (!m) return fallbackDays * 24 * 60 * 60 * 1000;
  const value = Number(m[1]);
  const unit = (m[2] || "s").toLowerCase();
  const mult =
    unit === "s" ? 1000 :
    unit === "m" ? 60 * 1000 :
    unit === "h" ? 60 * 60 * 1000 :
    unit === "d" ? 24 * 60 * 60 * 1000 : 1000;
  return value * mult;
}

// --- Генерация токенов ---
export function signAccessToken(user) {
  const payload = { id: user.id, login: user.login, role: user.role };
  const expiresIn = process.env.ACCESS_EXPIRES_IN || "15m";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function signRefreshToken(user) {
  const payload = { id: user.id, tokenType: "refresh" };
  const expiresIn = process.env.REFRESH_EXPIRES_IN || "7d";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// --- Установка/очистка cookie с refresh-токеном ---
export function setRefreshCookie(res, refreshToken) {
  const maxAge = parseExpiresToMs(process.env.REFRESH_EXPIRES_IN, 7);
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
}
