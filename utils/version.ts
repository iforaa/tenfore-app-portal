/**
 * Parse a version string to extract the major version number
 * @param version - Version string like "6.2.0" or "6.1.4"
 * @returns The major version number, or 0 if parsing fails
 */
export function parseVersion(version: string | undefined): number {
  if (!version) return 0;
  const match = version.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Compare two version strings
 * @returns negative if a < b, positive if a > b, 0 if equal
 */
export function compareVersions(a: string | undefined, b: string | undefined): number {
  const parseSegments = (v: string | undefined): number[] => {
    if (!v) return [0];
    return v.split('.').map(s => parseInt(s, 10) || 0);
  };

  const segmentsA = parseSegments(a);
  const segmentsB = parseSegments(b);
  const maxLength = Math.max(segmentsA.length, segmentsB.length);

  for (let i = 0; i < maxLength; i++) {
    const numA = segmentsA[i] || 0;
    const numB = segmentsB[i] || 0;
    if (numA !== numB) {
      return numA - numB;
    }
  }

  return 0;
}

/**
 * Check if a version meets the minimum requirement
 */
export function meetsMinVersion(version: string | undefined, minMajor: number): boolean {
  return parseVersion(version) >= minMajor;
}

/**
 * Format file size in bytes to human-readable format (MB)
 */
export function formatSize(bytes: string | number | undefined): string {
  if (!bytes) return 'N/A';
  const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(numBytes)) return 'N/A';
  const mb = numBytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}
