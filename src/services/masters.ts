import type { User } from '../types';

type FetchMastersParams = {
  q?: string;
  page?: number;
  limit?: number;
};

type MastersResponse = {
  items: User[];
  page: number;
  limit: number;
  count: number;
};

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// Получить всех мастеров (role=0)
export async function fetchMastersApi(params: FetchMastersParams = {}): Promise<MastersResponse> {
  const { q, page = 1, limit = 50 } = params;
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (q && q.trim()) qs.set('q', q.trim());

  const res = await fetch(`${API_BASE}/api/masters?${qs.toString()}`, {
    credentials: 'include', // опираемся на cookie с JWT
  });

  if (!res.ok) {
    throw new Error(res.status === 403 ? 'Нет доступа' : 'Не удалось загрузить список мастеров');
  }

  const data = await res.json();

  // Контроллер может вернуть либо массив, либо объект {items, page,...}
  if (Array.isArray(data)) {
    return { items: data, page, limit, count: data.length };
  }
  return data as MastersResponse;
}

export async function fetchMasterByIdApi(id: number | string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/masters/${id}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg =
      data?.message ||
      (res.status === 404 ? 'Пользователь не найден' :
       res.status === 403 ? 'Нет доступа' :
       'Не удалось загрузить мастера');
    throw new Error(msg);
  }

  return res.json();
}