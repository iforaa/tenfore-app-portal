<script setup lang="ts">
import type { AppWithMetadata } from '~/types';

interface Props {
  app: AppWithMetadata;
}

const props = defineProps<Props>();

const iosVersion = computed(() => props.app.metadata?.ios?.version || '-');
const androidVersion = computed(() => props.app.metadata?.android?.version || '-');
const iosRating = computed(() => props.app.metadata?.ios?.score || 0);
const androidRating = computed(() => props.app.metadata?.android?.score || 0);
const averageRating = computed(() => {
  const ratings = [iosRating.value, androidRating.value].filter(r => r > 0);
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
});
const appIcon = computed(() => props.app.metadata?.ios?.icon || props.app.metadata?.android?.icon || '');

const appStoreUrl = computed(() => `https://apps.apple.com/app/id${props.app.appStoreId}`);
const playStoreUrl = computed(() => `https://play.google.com/store/apps/details?id=${props.app.googlePlayId}`);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <NuxtLink :to="`/apps/${app.id}`" class="flex items-start gap-4">
      <!-- App Icon -->
      <div
        class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
        :style="{ backgroundColor: app.primaryColor + '20' }"
      >
        <img
          v-if="appIcon"
          :src="appIcon"
          :alt="app.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold" :style="{ color: app.primaryColor }">
          {{ app.name.charAt(0) }}
        </div>
      </div>

      <!-- App Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 truncate">{{ app.name }}</h3>

        <!-- Rating -->
        <div v-if="averageRating > 0" class="mt-2">
          <RatingStars :rating="averageRating" size="sm" />
        </div>
        <div v-else class="mt-2 text-sm text-gray-400">No ratings yet</div>

        <!-- Versions -->
        <div class="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <StoreIcon store="ios" size="sm" />
            <span>{{ iosVersion }}</span>
          </div>
          <div class="flex items-center gap-1">
            <StoreIcon store="android" size="sm" />
            <span>{{ androidVersion }}</span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Store links -->
    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
      <a
        :href="appStoreUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
        @click.stop
      >
        <StoreIcon store="ios" size="sm" />
        App Store
      </a>
      <a
        :href="playStoreUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
        @click.stop
      >
        <StoreIcon store="android" size="sm" />
        Google Play
      </a>
    </div>
  </div>
</template>
