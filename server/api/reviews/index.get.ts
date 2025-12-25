import { getAllReviews, getApps } from '~/server/utils/storage';
import type { ReviewWithApp } from '~/types';

export default defineEventHandler(async (event): Promise<ReviewWithApp[]> => {
  const query = getQuery(event);
  const limit = Number(query.limit) || 100;
  const appFilter = query.app as string | undefined;
  const storeFilter = query.store as 'ios' | 'android' | undefined;
  const ratingFilter = query.rating ? Number(query.rating) : undefined;

  const { apps } = await getApps();
  const appMap = new Map(apps.map(a => [a.id, a.name]));

  const allReviewsData = await getAllReviews();

  let reviews: ReviewWithApp[] = [];

  for (const reviewData of allReviewsData) {
    const appName = appMap.get(reviewData.appId) || reviewData.appId;

    for (const review of reviewData.reviews) {
      reviews.push({
        ...review,
        appId: reviewData.appId,
        appName,
        store: reviewData.store
      });
    }
  }

  // Apply filters
  if (appFilter) {
    reviews = reviews.filter(r => r.appId === appFilter);
  }

  if (storeFilter) {
    reviews = reviews.filter(r => r.store === storeFilter);
  }

  if (ratingFilter !== undefined) {
    reviews = reviews.filter(r => r.score === ratingFilter);
  }

  // Sort by date (newest first)
  reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply limit
  return reviews.slice(0, limit);
});
