import { getApps, getMetadata, getReviews } from '~/server/utils/storage';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'App ID is required'
    });
  }

  const { apps } = await getApps();
  const app = apps.find(a => a.id === id);

  if (!app) {
    throw createError({
      statusCode: 404,
      message: `App not found: ${id}`
    });
  }

  const [metadata, iosReviews, androidReviews] = await Promise.all([
    getMetadata(id),
    getReviews(id, 'ios'),
    getReviews(id, 'android')
  ]);

  return {
    ...app,
    metadata,
    iosReviews: iosReviews?.reviews || [],
    androidReviews: androidReviews?.reviews || []
  };
});
