export function setCookie(name: string, value: string, days = 30, opts: { domain?: string; sameSite?: 'Lax'|'Strict'|'None'; secure?: boolean; path?: string } = {}) {
  const { domain, sameSite = 'Lax', secure = false, path = '/' } = opts
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=${path}; SameSite=${sameSite}`
  if (domain) cookie += `; domain=${domain}`
  if (secure) cookie += '; Secure'
  document.cookie = cookie
}


export function getCookie(name: string): string | undefined {
  const key = encodeURIComponent(name) + '='
  const parts = document.cookie.split('; ')
  for (const part of parts) {
  if (part.startsWith(key)) return decodeURIComponent(part.slice(key.length))
  }
  return undefined
}


export function deleteCookie(name: string, opts: { domain?: string; path?: string } = {}) {
  const { domain, path = '/' } = opts
  let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
  if (domain) cookie += `; domain=${domain}`
  document.cookie = cookie
}