// Formats a date as "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago",
// falling back to a plain date once it's more than a week old. Callers should
// re-render periodically (poll or a ticking timer) so this stays live instead
// of freezing at whatever it said on first render.
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';

  const diffMs = Date.now() - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;

  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
