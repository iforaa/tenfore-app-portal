import { getApps, saveMetadata } from '~/server/utils/storage';
import { fetchAppStoreMetadata } from '~/server/utils/appStore';
import { fetchGooglePlayMetadata } from '~/server/utils/googlePlay';
import type { AppMetadata } from '~/types';

interface FetchRequest {
  appId?: string; // If not provided, fetch all apps
}

export default defineEventHandler(async (event) => {
  const body = await readBody<FetchRequest>(event) || {};
  const { apps } = await getApps();

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

  const results: { appId: string; success: boolean; error?: string }[] = [];

  for (const app of appsToFetch) {
    try {
      const [ios, android] = await Promise.all([
        fetchAppStoreMetadata(app.appStoreId),
        fetchGooglePlayMetadata(app.googlePlayId)
      ]);

      const metadata: AppMetadata = {
        appId: app.id,
        fetchedAt: new Date().toISOString(),
        ios: ios || undefined,
        android: android || undefined
      };

      await saveMetadata(app.id, metadata);
      results.push({ appId: app.id, success: true });
    } catch (error) {
      results.push({
        appId: app.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return {
    fetched: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
});
