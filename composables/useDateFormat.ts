/**
 * Composable for consistent date formatting across the app
 */
export function useDateFormat() {
  /**
   * Format a date value that could be a string, number (timestamp), or Date
   */
  function formatDate(
    value: string | number | Date | undefined | null,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  ): string {
    if (!value) return 'Unknown date';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      // Unix timestamp (might be in seconds or milliseconds)
      date = new Date(value > 9999999999 ? value : value * 1000);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      return 'Unknown date';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }

    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format a date as relative time (e.g., "2 days ago")
   */
  function formatRelative(value: string | number | Date | undefined | null): string {
    if (!value) return 'Unknown';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      date = new Date(value > 9999999999 ? value : value * 1000);
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return 'Unknown';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  return {
    formatDate,
    formatRelative
  };
}
