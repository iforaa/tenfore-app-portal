<script setup lang="ts">
import type { AppWithMetadata } from '~/types';
import { meetsMinVersion } from '~/utils/version';

const CACHE_KEY = 'tenfore_last_fetch';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const { data: apps, pending, error, refresh } = await useFetch<AppWithMetadata[]>('/api/apps');

const dataRefresh = useRefresh();

// Check if cache is stale (older than 30 minutes)
function isCacheStale(): boolean {
  if (import.meta.server) return false; // Don't fetch on server
  const lastFetch = localStorage.getItem(CACHE_KEY);
  if (!lastFetch) return true;
  return Date.now() - parseInt(lastFetch, 10) > CACHE_DURATION;
}

// Auto-fetch data if cache is stale
onMounted(async () => {
  if (isCacheStale()) {
    await refreshAllData();
  }
});

async function refreshAllData() {
  await dataRefresh.execute(
    async () => {
      // Fetch metadata and reviews in parallel
      await Promise.all([
        $fetch('/api/metadata/fetch', { method: 'POST' }),
        $fetch('/api/reviews/fetch', { method: 'POST' })
      ]);
      // Update cache timestamp
      localStorage.setItem(CACHE_KEY, Date.now().toString());
    },
    () => refresh()
  );
}

// Filter apps: only show apps with version >= 6, put Crane first
const filteredApps = computed(() => {
  if (!apps.value) return [];

  return apps.value
    .filter(app => {
      const iosVersion = app.metadata?.ios?.version;
      const androidVersion = app.metadata?.android?.version;
      // Show app if either platform has version >= 6, or if no metadata yet
      return meetsMinVersion(iosVersion, 6) || meetsMinVersion(androidVersion, 6) || !app.metadata;
    })
    .sort((a, b) => {
      // Put Crane first
      if (a.id === 'crane') return -1;
      if (b.id === 'crane') return 1;
      return a.name.localeCompare(b.name);
    });
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">App Dashboard</h1>
      <p class="mt-1 text-gray-600">Track all TenFore mobile apps across stores</p>
    </div>

    <!-- Loading state -->
    <div v-if="pending || dataRefresh.loading.value" class="flex flex-col items-center justify-center py-12">
      <BaseSpinner size="md" />
      <p v-if="dataRefresh.loading.value" class="mt-4 text-gray-600">
        Fetching latest data from App Store and Google Play...
      </p>
    </div>

    <!-- Error state -->
    <BaseAlert v-else-if="error" variant="error">
      Failed to load apps: {{ error.message }}
    </BaseAlert>

    <!-- Apps grid -->
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard v-for="app in filteredApps" :key="app.id" :app="app" />
      </div>

      <!-- Empty state -->
      <div v-if="filteredApps.length === 0" class="text-center py-12 text-gray-500">
        No apps available. Click "Refresh All" to fetch app data.
      </div>
    </template>
  </div>
</template>
