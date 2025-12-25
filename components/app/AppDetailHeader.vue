<script setup lang="ts">
import type { AppConfig, AppMetadata } from '~/types';

interface Props {
  app: AppConfig;
  metadata: AppMetadata | null;
  refreshingMetadata?: boolean;
  refreshingReviews?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  refreshingMetadata: false,
  refreshingReviews: false
});

const emit = defineEmits<{
  (e: 'refresh-metadata'): void;
  (e: 'refresh-reviews'): void;
}>();

const appIcon = computed(() =>
  props.metadata?.ios?.icon || props.metadata?.android?.icon
);
</script>

<template>
  <BaseCard padding="lg">
    <div class="flex items-start gap-6">
      <!-- App Icon -->
      <div
        class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100"
        :style="{ backgroundColor: app.primaryColor + '20' }"
      >
        <img
          v-if="appIcon"
          :src="appIcon"
          :alt="app.name"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-4xl font-bold"
          :style="{ color: app.primaryColor }"
        >
          {{ app.name.charAt(0) }}
        </div>
      </div>

      <!-- App Info -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900">{{ app.name }}</h1>

        <!-- Ratings -->
        <div class="mt-3 flex items-center gap-6">
          <div class="flex items-center gap-2">
            <StoreIcon store="ios" />
            <span class="font-medium">iOS</span>
            <RatingStars v-if="metadata?.ios?.score" :rating="metadata.ios.score" size="sm" />
            <span v-else class="text-gray-400 text-sm">No ratings</span>
          </div>
          <div class="flex items-center gap-2">
            <StoreIcon store="android" />
            <span class="font-medium">Android</span>
            <RatingStars v-if="metadata?.android?.score" :rating="metadata.android.score" size="sm" />
            <span v-else class="text-gray-400 text-sm">No ratings</span>
          </div>
        </div>

        <!-- Versions -->
        <div class="mt-3 flex items-center gap-6 text-sm text-gray-600">
          <div>
            <span class="font-medium">iOS Version:</span>
            {{ metadata?.ios?.version || 'N/A' }}
          </div>
          <div>
            <span class="font-medium">Android Version:</span>
            {{ metadata?.android?.version || 'N/A' }}
          </div>
        </div>
      </div>

      <!-- Refresh buttons -->
      <div class="flex flex-col gap-2">
        <BaseButton
          variant="secondary"
          :loading="refreshingMetadata"
          @click="emit('refresh-metadata')"
        >
          {{ refreshingMetadata ? 'Refreshing...' : 'Refresh Metadata' }}
        </BaseButton>
        <BaseButton
          variant="secondary"
          :loading="refreshingReviews"
          @click="emit('refresh-reviews')"
        >
          {{ refreshingReviews ? 'Refreshing...' : 'Refresh Reviews' }}
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
