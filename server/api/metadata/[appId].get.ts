import { getMetadata, getApps } from '~/server/utils/storage';

export default defineEventHandler(async (event) => {
  const appId = getRouterParam(event, 'appId');

  if (!appId) {
    throw createError({
      statusCode: 400,
      message: 'App ID is required'
    });
  }

  const { apps } = await getApps();
  const app = apps.find(a => a.id === appId);

  if (!app) {
    throw createError({
      statusCode: 404,
      message: `App not found: ${appId}`
    });
  }

  const metadata = await getMetadata(appId);

  return {
    appId,
    appName: app.name,
    metadata
  };
});
