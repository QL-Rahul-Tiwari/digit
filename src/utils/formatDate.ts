/**
 * Formats a date string into a relative time label (e.g., "2H AGO", "3D AGO").
 * Returns uppercase string suitable for Label_SM typography.
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) {
    return 'JUST NOW';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}M AGO`;
  }
  if (diffHours < 24) {
    return `${diffHours}H AGO`;
  }
  if (diffDays < 7) {
    return `${diffDays}D AGO`;
  }
  if (diffWeeks < 4) {
    return `${diffWeeks}W AGO`;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }).toUpperCase();
}

/**
 * Formats a number into a compact string (e.g., 1200 → "1.2K").
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
}
