import type { User } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function updateWorkingDaysApi(userId: number | string, workingDays: string[]): Promise<User> {
  const res = await fetch(`${API_BASE}/api/users/${userId}/working-days`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // полагаемся на cookie
    body: JSON.stringify({ workingDays }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Не удалось обновить рабочие дни');
  }

  return res.json();
}