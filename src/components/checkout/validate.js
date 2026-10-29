// Format checks for the payment simulator. No data leaves the browser.
const digits = (v) => String(v).replace(/\D/g, '')

export function luhn(number) {
  const d = digits(number)
  if (d.length < 13 || d.length > 19) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2) n = n * 2 > 9 ? n * 2 - 9 : n * 2
    sum += n
  }
  return sum % 10 === 0
}

// MM/AA, not expired as of `now`.
export function validExpiry(value, now = new Date()) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!m || +m[1] < 1 || +m[1] > 12) return false
  return new Date(2000 + +m[2], +m[1], 1) > now
}

export const validCvv = (v) => /^\d{3,4}$/.test(v.trim())
export const validNequi = (v) => /^3\d{9}$/.test(digits(v))
export const validDocument = (v) => /^\d{5,12}$/.test(digits(v))
export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const formatCardNumber = (v) => digits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
export const formatExpiry = (v) => digits(v).slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')
