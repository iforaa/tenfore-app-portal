import { promises as fs } from 'fs';
import { join } from 'path';
import type { AppsData, AppMetadata, AppReviews } from '~/types';

const DATA_DIR = join(process.cwd(), 'data');
const REVIEWS_DIR = join(DATA_DIR, 'reviews');
const METADATA_DIR = join(DATA_DIR, 'metadata');

// Ensure directories exist
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory exists
  }
}

// Read apps configuration
export async function getApps(): Promise<AppsData> {
  const filePath = join(DATA_DIR, 'apps.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// Read app metadata
export async function getMetadata(appId: string): Promise<AppMetadata | null> {
  try {
    const filePath = join(METADATA_DIR, `${appId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Save app metadata
export async function saveMetadata(appId: string, metadata: AppMetadata): Promise<void> {
  await ensureDir(METADATA_DIR);
  const filePath = join(METADATA_DIR, `${appId}.json`);
  await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));
}

// Read reviews for an app
export async function getReviews(appId: string, store: 'ios' | 'android'): Promise<AppReviews | null> {
  try {
    const filePath = join(REVIEWS_DIR, `${appId}-${store}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Save reviews for an app
export async function saveReviews(appId: string, store: 'ios' | 'android', reviews: AppReviews): Promise<void> {
  await ensureDir(REVIEWS_DIR);
  const filePath = join(REVIEWS_DIR, `${appId}-${store}.json`);
  await fs.writeFile(filePath, JSON.stringify(reviews, null, 2));
}

// Get all reviews across all apps
export async function getAllReviews(): Promise<AppReviews[]> {
  await ensureDir(REVIEWS_DIR);

  try {
    const files = await fs.readdir(REVIEWS_DIR);
    const reviewFiles = files.filter(f => f.endsWith('.json'));

    const allReviews: AppReviews[] = [];
    for (const file of reviewFiles) {
      const content = await fs.readFile(join(REVIEWS_DIR, file), 'utf-8');
      allReviews.push(JSON.parse(content));
    }

    return allReviews;
  } catch {
    return [];
  }
}

// Get all metadata
export async function getAllMetadata(): Promise<Map<string, AppMetadata>> {
  await ensureDir(METADATA_DIR);

  const metadataMap = new Map<string, AppMetadata>();

  try {
    const files = await fs.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json'));

    for (const file of metadataFiles) {
      const appId = file.replace('.json', '');
      const content = await fs.readFile(join(METADATA_DIR, file), 'utf-8');
      metadataMap.set(appId, JSON.parse(content));
    }
  } catch {
    // Directory doesn't exist yet
  }

  return metadataMap;
}
