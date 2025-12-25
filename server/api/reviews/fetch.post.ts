import { getApps, saveReviews } from '~/server/utils/storage';
import { fetchAppStoreReviews } from '~/server/utils/appStore';
import { fetchGooglePlayReviews } from '~/server/utils/googlePlay';
import type { AppReviews } from '~/types';

interface FetchRequest {
  appId?: string; // If not provided, fetch all apps
  store?: 'ios' | 'android' | 'both'; // Default: both
}

export default defineEventHandler(async (event) => {
  const body = await readBody<FetchRequest>(event) || {};
  const { apps } = await getApps();
  const store = body?.store || 'both';

  // Filter to specific app if requested
  const appsToFetch = body?.appId
    ? apps.filter(a => a.id === body.appId)
    : apps;

  if (body?.appId && appsToFetch.length === 0) {
    throw createError({
      statusCode: 404,
      message: `App not found: ${body.appId}`
    });
  }

  const results: { appId: string; store: string; success: boolean; count?: number; error?: string }[] = [];

  for (const app of appsToFetch) {
    // Fetch iOS reviews
    if (store === 'ios' || store === 'both') {
      try {
        const reviews = await fetchAppStoreReviews(app.appStoreId);
        const appReviews: AppReviews = {
          appId: app.id,
          store: 'ios',
          fetchedAt: new Date().toISOString(),
          reviews
        };
        await saveReviews(app.id, 'ios', appReviews);
        results.push({ appId: app.id, store: 'ios', success: true, count: reviews.length });
      } catch (error) {
        results.push({
          appId: app.id,
          store: 'ios',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Fetch Android reviews
    if (store === 'android' || store === 'both') {
      try {
        const reviews = await fetchGooglePlayReviews(app.googlePlayId);
        const appReviews: AppReviews = {
          appId: app.id,
          store: 'android',
          fetchedAt: new Date().toISOString(),
          reviews
        };
        await saveReviews(app.id, 'android', appReviews);
        results.push({ appId: app.id, store: 'android', success: true, count: reviews.length });
      } catch (error) {
        results.push({
          appId: app.id,
          store: 'android',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Small delay between apps to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return {
    fetched: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    totalReviews: results.filter(r => r.success).reduce((sum, r) => sum + (r.count || 0), 0),
    results
  };
});
