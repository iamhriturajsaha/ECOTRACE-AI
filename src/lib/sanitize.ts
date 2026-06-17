/**
 * Shared input sanitization utilities for the EcoTrace platform.
 * Provides XSS protection by escaping HTML entities in user-provided strings.
 */

/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * Converts &, <, >, ", and ' to their HTML entity equivalents.
 *
 * @param value - The raw user input string to sanitize
 * @returns The sanitized string with HTML entities escaped
 *
 * @example
 * ```ts
 * sanitizeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function sanitizeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
