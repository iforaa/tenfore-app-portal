import type { AppsData, AppMetadata, AppReviews } from '~/types';
import appsData from '~/data/apps.json';

// In-memory cache for serverless environments (Vercel)
const metadataCache = new Map<string, AppMetadata>();
const reviewsCache = new Map<string, AppReviews>();

// Read apps configuration (from bundled JSON)
export async function getApps(): Promise<AppsData> {
  return appsData as AppsData;
}

// Read app metadata from cache
export async function getMetadata(appId: string): Promise<AppMetadata | null> {
  return metadataCache.get(appId) || null;
}

// Save app metadata to cache
export async function saveMetadata(appId: string, metadata: AppMetadata): Promise<void> {
  metadataCache.set(appId, metadata);
}

// Read reviews for an app from cache
export async function getReviews(appId: string, store: 'ios' | 'android'): Promise<AppReviews | null> {
  const key = `${appId}-${store}`;
  return reviewsCache.get(key) || null;
}

// Save reviews for an app to cache
export async function saveReviews(appId: string, store: 'ios' | 'android', reviews: AppReviews): Promise<void> {
  const key = `${appId}-${store}`;
  reviewsCache.set(key, reviews);
}

// Get all reviews across all apps from cache
export async function getAllReviews(): Promise<AppReviews[]> {
  return Array.from(reviewsCache.values());
}

// Get all metadata from cache
export async function getAllMetadata(): Promise<Map<string, AppMetadata>> {
  return new Map(metadataCache);
}

// Clear all caches (useful for refresh)
export function clearCache(): void {
  metadataCache.clear();
  reviewsCache.clear();
}
