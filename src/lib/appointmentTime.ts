/**
 * Build a local Date from YYYY-MM-DD and a 12h label like "9:00 AM".
 * Assumes the studio’s local (US Central) use case: browser local time is acceptable.
 */
const TIME_12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i

export function parseYmdAndTime12ToLocal(ymd: string, time12: string): Date {
  const parts = ymd.split('-').map((x) => parseInt(x, 10))
  if (parts.length !== 3) throw new Error('Invalid date')
  const y = parts[0] as number
  const mo = parts[1] as number
  const d = parts[2] as number
  const m = time12.trim().match(TIME_12)
  if (!m) throw new Error('Invalid time')
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const ap = m[3].toUpperCase()
  if (ap === 'PM' && h < 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return new Date(y, mo - 1, d, h, min, 0, 0)
}

export function toStartOfDayLocal(ymd: string): Date {
  const [y, mo, d] = ymd.split('-').map((x) => parseInt(x, 10))
  return new Date(y, mo - 1, d, 0, 0, 0, 0)
}

export function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

export function dayKey(d: Date): string {
  return ymd(d)
}
