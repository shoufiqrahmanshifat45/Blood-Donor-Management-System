/**
 * Privacy & Data Redaction Utilities
 * Ensures sensitive donor personal and medical data is not leaked to public/unauthenticated endpoints.
 */

/**
 * Masks an email address for partial privacy, e.g. "shoufiq.shifat@example.com" -> "s***t@example.com"
 */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email || !email.includes('@')) return null;
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  return `${firstChar}***${lastChar}@${domain}`;
}

/**
 * Masks a phone number for non-emergency public views if required
 */
export function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.trim();
  if (digits.length < 7) return digits;
  return digits.slice(0, 4) + '****' + digits.slice(-3);
}
