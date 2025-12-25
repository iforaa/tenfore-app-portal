import { getApps, getAllMetadata } from '~/server/utils/storage';
import type { AppWithMetadata } from '~/types';

export default defineEventHandler(async (): Promise<AppWithMetadata[]> => {
  const { apps } = await getApps();
  const metadataMap = await getAllMetadata();

  return apps.map(app => ({
    ...app,
    metadata: metadataMap.get(app.id) || undefined
  }));
});
