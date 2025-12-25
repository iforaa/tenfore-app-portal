<script setup lang="ts">
import type { ReviewWithApp, AppConfig } from '~/types';

const { data: apps } = await useFetch<AppConfig[]>('/api/apps');

// Filters
const selectedApp = ref<string>('');
const selectedStore = ref<string>('');
const selectedRating = ref<string>('');

const queryParams = computed(() => {
  const params: Record<string, string> = { limit: '100' };
  if (selectedApp.value) params.app = selectedApp.value;
  if (selectedStore.value) params.store = selectedStore.value;
  if (selectedRating.value) params.rating = selectedRating.value;
  return params;
});

const { data: reviews, pending, refresh } = await useFetch<ReviewWithApp[]>('/api/reviews', {
  query: queryParams,
  watch: [queryParams]
});

const reviewsRefresh = useRefresh();

async function fetchAllReviews() {
  await reviewsRefresh.execute(
    () => $fetch('/api/reviews/fetch', { method: 'POST' }),
    () => refresh()
  );
}

function clearFilters() {
  selectedApp.value = '';
  selectedStore.value = '';
  selectedRating.value = '';
}

const hasFilters = computed(() => selectedApp.value || selectedStore.value || selectedRating.value);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">All Reviews</h1>
        <p class="mt-1 text-gray-600">Reviews from all apps across App Store and Google Play</p>
      </div>
      <BaseButton
        :loading="reviewsRefresh.loading.value"
        @click="fetchAllReviews"
      >
        {{ reviewsRefresh.loading.value ? 'Fetching...' : 'Fetch All Reviews' }}
      </BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard padding="md" class="mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <!-- App filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">App</label>
          <select
            v-model="selectedApp"
            class="block w-48 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Apps</option>
            <option v-for="app in apps" :key="app.id" :value="app.id">
              {{ app.name }}
            </option>
          </select>
        </div>

        <!-- Store filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Store</label>
          <select
            v-model="selectedStore"
            class="block w-40 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Stores</option>
            <option value="ios">App Store</option>
            <option value="android">Google Play</option>
          </select>
        </div>

        <!-- Rating filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select
            v-model="selectedRating"
            class="block w-32 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <!-- Clear filters -->
        <div class="flex items-end">
          <BaseButton
            v-if="hasFilters"
            variant="ghost"
            size="sm"
            @click="clearFilters"
          >
            Clear filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <BaseSpinner size="md" />
    </div>

    <!-- Reviews list -->
    <template v-else>
      <div v-if="reviews?.length === 0" class="text-center py-12 text-gray-500">
        <p>No reviews found.</p>
        <p class="mt-2 text-sm">Click "Fetch All Reviews" to load reviews from the stores.</p>
      </div>

      <div v-else class="space-y-4">
        <p class="text-sm text-gray-600 mb-4">
          Showing {{ reviews?.length }} reviews
        </p>
        <ReviewCard
          v-for="review in reviews"
          :key="`${review.appId}-${review.store}-${review.id}`"
          :review="review"
          :show-app-name="true"
        />
      </div>
    </template>
  </div>
</template>
