import type { AppStoreMetadata, Review } from '~/types';

// Dynamic import for app-store-scraper (CommonJS module)
async function getAppStoreScraper() {
  const appStore = await import('app-store-scraper');
  return appStore.default || appStore;
}

export async function fetchAppStoreMetadata(appStoreId: string): Promise<AppStoreMetadata | null> {
  try {
    const appStore = await getAppStoreScraper();
    const app = await appStore.app({
      id: appStoreId,
      country: 'us'
    });

    return app as AppStoreMetadata;
  } catch (error) {
    console.error(`Failed to fetch App Store metadata for ${appStoreId}:`, error);
    return null;
  }
}

export async function fetchAppStoreReviews(appStoreId: string, page: number = 1): Promise<Review[]> {
  try {
    const appStore = await getAppStoreScraper();
    const reviews = await appStore.reviews({
      id: appStoreId,
      country: 'us',
      page,
      sort: appStore.sort.RECENT
    });

    return reviews.map((r: any) => ({
      id: String(r.id),
      userName: r.userName || 'Anonymous',
      userImage: r.userUrl,
      date: r.date,
      score: r.score,
      title: r.title,
      text: r.text,
      version: r.version,
      url: r.url
    }));
  } catch (error) {
    console.error(`Failed to fetch App Store reviews for ${appStoreId}:`, error);
    return [];
  }
}
