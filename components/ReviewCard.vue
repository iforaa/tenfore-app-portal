<script setup lang="ts">
import type { Review } from '~/types';

interface Props {
  review: Review & { appName?: string; store?: 'ios' | 'android' };
  showAppName?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAppName: false
});

const { formatDate } = useDateFormat();

const formattedDate = computed(() => formatDate(props.review.date));

const ratingColor = computed(() => {
  if (props.review.score >= 4) return 'bg-green-100 text-green-800';
  if (props.review.score >= 3) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
});
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2">
        <!-- User avatar -->
        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          {{ review.userName.charAt(0).toUpperCase() }}
        </div>
        <div>
          <div class="font-medium text-gray-900">{{ review.userName }}</div>
          <div class="text-sm text-gray-500 flex items-center gap-2">
            <span>{{ formattedDate }}</span>
            <template v-if="review.version">
              <span class="text-gray-300">•</span>
              <span>v{{ review.version }}</span>
            </template>
          </div>
        </div>
      </div>

      <!-- Rating badge -->
      <div class="flex items-center gap-2">
        <StoreIcon v-if="review.store" :store="review.store" size="sm" />
        <span :class="ratingColor" class="px-2 py-1 rounded-full text-sm font-medium">
          {{ '★'.repeat(review.score) }}{{ '☆'.repeat(5 - review.score) }}
        </span>
      </div>
    </div>

    <!-- App name (if showing) -->
    <div v-if="showAppName && review.appName" class="mt-2">
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
        {{ review.appName }}
      </span>
    </div>

    <!-- Title -->
    <h4 v-if="review.title" class="mt-3 font-medium text-gray-900">
      {{ review.title }}
    </h4>

    <!-- Review text -->
    <p class="mt-2 text-gray-700 whitespace-pre-line">
      {{ review.text }}
    </p>

    <!-- Developer reply -->
    <div v-if="review.replyText" class="mt-3 pl-4 border-l-2 border-gray-200">
      <div class="text-sm font-medium text-gray-600">Developer Response:</div>
      <p class="mt-1 text-sm text-gray-600">{{ review.replyText }}</p>
    </div>

    <!-- Thumbs up (for Google Play) -->
    <div v-if="review.thumbsUp !== undefined && review.thumbsUp > 0" class="mt-3 text-sm text-gray-500">
      {{ review.thumbsUp }} people found this helpful
    </div>
  </div>
</template>
