// services/auth.ts
import type { Credentials, User } from '../types'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// В памяти: access-token живёт до закрытия вкладки/обновления
let accessToken: string | null = null
export const getAccessToken = () => accessToken
export const clearAccessToken = () => { accessToken = null }

export async function signIn({ login, password }: Credentials): Promise<{ user: User; accessToken: string }> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
    credentials: 'include', // refresh-cookie получим от сервера
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.message ?? `Ошибка авторизации (${res.status})`)
  }

  const { user, accessToken: token } = await res.json()
  if (!user?.id || !token) throw new Error('Некорректный ответ сервера')
  accessToken = token
  return { user, accessToken: token }
}

export async function signOut(): Promise<void> {
  clearAccessToken()
  const res = await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' })
  if (!res.ok) throw new Error(`Ошибка выхода (${res.status})`)
}

export async function me(): Promise<User> {
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Ошибка проверки токена')
  return res.json()
}

// если access-token истёк — запрашиваем новый
export async function refresh(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/refresh`, { method: 'POST', credentials: 'include' })
  if (!res.ok) throw new Error('Не удалось обновить токен')
  const { accessToken: token } = await res.json()
  if (!token) throw new Error('Некорректный ответ сервера при обновлении токена')
  accessToken = token
  return token
}
