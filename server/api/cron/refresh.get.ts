import { getApps, saveMetadata, saveReviews } from '~/server/utils/storage';
import { fetchAppStoreMetadata, fetchAppStoreReviews } from '~/server/utils/appStore';
import { fetchGooglePlayMetadata, fetchGooglePlayReviews } from '~/server/utils/googlePlay';
import type { AppMetadata, AppReviews } from '~/types';

export default defineEventHandler(async (event) => {
  // Verify cron secret to prevent unauthorized access
  const authHeader = getHeader(event, 'authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  const { apps } = await getApps();
  const results = {
    metadata: { success: 0, failed: 0 },
    reviews: { success: 0, failed: 0 }
  };

  for (const app of apps) {
    // Fetch metadata
    try {
      const [iosInfo, androidInfo] = await Promise.all([
        fetchAppStoreMetadata(app.appStoreId).catch(() => null),
        fetchGooglePlayMetadata(app.googlePlayId).catch(() => null)
      ]);

      const metadata: AppMetadata = {
        appId: app.id,
        fetchedAt: new Date().toISOString(),
        ios: iosInfo || undefined,
        android: androidInfo || undefined
      };

      await saveMetadata(app.id, metadata);
      results.metadata.success++;
    } catch {
      results.metadata.failed++;
    }

    // Fetch reviews
    try {
      const iosReviews = await fetchAppStoreReviews(app.appStoreId).catch(() => []);
      if (iosReviews.length > 0) {
        const appReviews: AppReviews = {
          appId: app.id,
          store: 'ios',
          fetchedAt: new Date().toISOString(),
          reviews: iosReviews
        };
        await saveReviews(app.id, 'ios', appReviews);
      }
      results.reviews.success++;
    } catch {
      results.reviews.failed++;
    }

    try {
      const androidReviews = await fetchGooglePlayReviews(app.googlePlayId).catch(() => []);
      if (androidReviews.length > 0) {
        const appReviews: AppReviews = {
          appId: app.id,
          store: 'android',
          fetchedAt: new Date().toISOString(),
          reviews: androidReviews
        };
        await saveReviews(app.id, 'android', appReviews);
      }
      results.reviews.success++;
    } catch {
      results.reviews.failed++;
    }

    // Small delay between apps
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    results
  };
});
