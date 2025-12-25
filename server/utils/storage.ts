import postgres from 'postgres';
import type { AppsData, AppMetadata, AppReviews } from '~/types';
import appsData from '~/data/apps.json';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

// Read apps configuration (from bundled JSON)
export async function getApps(): Promise<AppsData> {
  return appsData as AppsData;
}

// Read app metadata from database
export async function getMetadata(appId: string): Promise<AppMetadata | null> {
  const result = await sql`
    SELECT data FROM app_metadata WHERE app_id = ${appId}
  `;
  return result.length > 0 ? result[0].data as AppMetadata : null;
}

// Save app metadata to database
export async function saveMetadata(appId: string, metadata: AppMetadata): Promise<void> {
  await sql`
    INSERT INTO app_metadata (app_id, data, updated_at)
    VALUES (${appId}, ${JSON.stringify(metadata)}, NOW())
    ON CONFLICT (app_id)
    DO UPDATE SET data = ${JSON.stringify(metadata)}, updated_at = NOW()
  `;
}

// Read reviews for an app from database
export async function getReviews(appId: string, store: 'ios' | 'android'): Promise<AppReviews | null> {
  const result = await sql`
    SELECT data FROM app_reviews WHERE app_id = ${appId} AND store = ${store}
  `;
  return result.length > 0 ? result[0].data as AppReviews : null;
}

// Save reviews for an app to database
export async function saveReviews(appId: string, store: 'ios' | 'android', reviews: AppReviews): Promise<void> {
  await sql`
    INSERT INTO app_reviews (app_id, store, data, updated_at)
    VALUES (${appId}, ${store}, ${JSON.stringify(reviews)}, NOW())
    ON CONFLICT (app_id, store)
    DO UPDATE SET data = ${JSON.stringify(reviews)}, updated_at = NOW()
  `;
}

// Get all reviews across all apps from database
export async function getAllReviews(): Promise<AppReviews[]> {
  const result = await sql`
    SELECT data FROM app_reviews ORDER BY updated_at DESC
  `;
  return result.map(row => row.data as AppReviews);
}

// Get all metadata from database
export async function getAllMetadata(): Promise<Map<string, AppMetadata>> {
  const result = await sql`
    SELECT app_id, data FROM app_metadata
  `;
  const metadataMap = new Map<string, AppMetadata>();
  for (const row of result) {
    metadataMap.set(row.app_id, row.data as AppMetadata);
  }
  return metadataMap;
}
