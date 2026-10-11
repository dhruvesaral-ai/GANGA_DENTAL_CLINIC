const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return false;
  return EMAIL_PATTERN.test(email);
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
