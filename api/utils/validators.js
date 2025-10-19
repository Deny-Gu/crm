export function validateRegisterBody(body) {
  const errors = [];
  if (!body.login || typeof body.login !== 'string' || body.login.length < 3) {
    errors.push('login: минимум 3 символа.');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('password: минимум 6 символов.');
  }
  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 3) {
    errors.push('fullName: обязательное поле.');
  }
  if (body.city && typeof body.city !== 'string') errors.push('city: должен быть строкой.');
  if (body.district && typeof body.district !== 'string') errors.push('district: должен быть строкой.');
  if (body.transportMode && typeof body.transportMode !== 'string') errors.push('transportMode: должен быть строкой.');
  if (body.contacts && typeof body.contacts !== 'string') errors.push('contacts: должен быть строкой.');
  if (body.telegram && typeof body.telegram !== 'string') errors.push('contacts: должен быть строкой.');
  if (body.workingDays && !Array.isArray(body.workingDays)) errors.push('workingDays: ожидается массив строк.');
  return errors;
}

export function sanitizeUser(row) {
  if (!row) return null;
  const {
    id, login, full_name, city, district, transport_mode,
    contacts, telegram, registered_at, last_activity, working_days, role
  } = row;
  return {
    id,
    login,
    fullName: full_name,
    city,
    district,
    transportMode: transport_mode,
    contacts,
    telegram,
    registeredAt: registered_at,
    lastActivity: last_activity,
    workingDays: typeof working_days === 'string' ? JSON.parse(working_days) : working_days,
    role,
  };
}