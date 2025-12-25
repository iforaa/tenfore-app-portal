<script setup lang="ts">
import type { Review, Store } from '~/types';

interface Props {
  reviews: Review[];
  store: Store;
}

defineProps<Props>();
</script>

<template>
  <BaseCard padding="lg">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Reviews
      <span class="text-sm font-normal text-gray-500">({{ reviews.length }})</span>
    </h3>

    <div v-if="reviews.length === 0" class="text-gray-500 text-sm">
      No reviews yet. Click "Refresh Reviews" to fetch them.
    </div>

    <div v-else class="space-y-4 max-h-[600px] overflow-y-auto">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="{ ...review, store }"
      />
    </div>
  </BaseCard>
</template>
