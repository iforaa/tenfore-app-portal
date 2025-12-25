<script setup lang="ts">
import type { AppWithMetadata } from '~/types';
import { meetsMinVersion } from '~/utils/version';

const { data: apps, pending, error } = await useFetch<AppWithMetadata[]>('/api/apps');

// Get app rating (highest between iOS and Android)
function getAppRating(app: AppWithMetadata): number {
  const iosScore = app.metadata?.ios?.score || 0;
  const androidScore = app.metadata?.android?.score || 0;
  return Math.max(iosScore, androidScore);
}

// Sort: Crane first, then by rating (apps with ratings first), then alphabetically
function sortApps(appList: AppWithMetadata[]): AppWithMetadata[] {
  return appList.sort((a, b) => {
    // Crane always first
    if (a.id === 'crane') return -1;
    if (b.id === 'crane') return 1;

    // Apps with ratings come first
    const ratingA = getAppRating(a);
    const ratingB = getAppRating(b);
    if (ratingA > 0 && ratingB === 0) return -1;
    if (ratingB > 0 && ratingA === 0) return 1;

    // Then sort by rating descending
    if (ratingA !== ratingB) return ratingB - ratingA;

    // Finally alphabetically
    return a.name.localeCompare(b.name);
  });
}

// Check if app is supported (version >= 6)
function isSupported(app: AppWithMetadata): boolean {
  const iosVersion = app.metadata?.ios?.version;
  const androidVersion = app.metadata?.android?.version;
  return meetsMinVersion(iosVersion, 6) || meetsMinVersion(androidVersion, 6) || !app.metadata;
}

// Supported apps (version >= 6)
const supportedApps = computed(() => {
  if (!apps.value) return [];
  return sortApps(apps.value.filter(isSupported));
});

// Unsupported whitelabel apps (version < 6)
const unsupportedApps = computed(() => {
  if (!apps.value) return [];
  return sortApps(apps.value.filter(app => !isSupported(app) && app.isWhitelabel));
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
    <div v-if="pending" class="flex items-center justify-center py-12">
      <BaseSpinner size="md" />
    </div>

    <!-- Error state -->
    <BaseAlert v-else-if="error" variant="error">
      Failed to load apps: {{ error.message }}
    </BaseAlert>

    <!-- Apps -->
    <template v-else>
      <!-- Supported apps -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard v-for="app in supportedApps" :key="app.id" :app="app" />
      </div>

      <!-- Empty state -->
      <div v-if="supportedApps.length === 0" class="text-center py-12 text-gray-500">
        No apps available. Data is refreshed automatically every 6 hours.
      </div>

      <!-- Unsupported apps section -->
      <div v-if="unsupportedApps.length > 0" class="mt-12">
        <h2 class="text-lg font-semibold text-gray-500 mb-4">Unsupported (version &lt; 6)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
          <AppCard v-for="app in unsupportedApps" :key="app.id" :app="app" />
        </div>
      </div>
    </template>
  </div>
</template>
