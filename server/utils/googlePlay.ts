import type { GooglePlayMetadata, Review } from '~/types';

// Dynamic import for google-play-scraper (CommonJS module)
async function getGooglePlayScraper() {
  const gplay = await import('google-play-scraper');
  return gplay.default || gplay;
}

export async function fetchGooglePlayMetadata(packageId: string): Promise<GooglePlayMetadata | null> {
  try {
    const gplay = await getGooglePlayScraper();
    const app = await gplay.app({
      appId: packageId,
      lang: 'en',
      country: 'us'
    });

    return app as GooglePlayMetadata;
  } catch (error) {
    console.error(`Failed to fetch Google Play metadata for ${packageId}:`, error);
    return null;
  }
}

export async function fetchGooglePlayReviews(packageId: string, num: number = 50): Promise<Review[]> {
  try {
    const gplay = await getGooglePlayScraper();
    const result = await gplay.reviews({
      appId: packageId,
      lang: 'en',
      country: 'us',
      sort: gplay.sort.NEWEST,
      num
    });

    return result.data.map((r: any) => ({
      id: r.id,
      userName: r.userName || 'Anonymous',
      userImage: r.userImage,
      date: r.date,
      score: r.score,
      scoreText: r.scoreText,
      text: r.text,
      replyDate: r.replyDate,
      replyText: r.replyText,
      version: r.version,
      thumbsUp: r.thumbsUp,
      url: r.url
    }));
  } catch (error) {
    console.error(`Failed to fetch Google Play reviews for ${packageId}:`, error);
    return [];
  }
}
