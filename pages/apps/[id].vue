<script setup lang="ts">
import type { AppConfig, AppMetadata, Review } from '~/types';
import { formatSize } from '~/utils/version';

interface AppDetail extends AppConfig {
  metadata: AppMetadata | null;
  iosReviews: Review[];
  androidReviews: Review[];
}

const route = useRoute();
const appId = route.params.id as string;

const { data: app, pending, error } = await useFetch<AppDetail>(`/api/apps/${appId}`);

const iosMetadata = computed(() => app.value?.metadata?.ios);
const androidMetadata = computed(() => app.value?.metadata?.android);
const iosScreenshots = computed(() => iosMetadata.value?.screenshots || []);
const androidScreenshots = computed(() => androidMetadata.value?.screenshots || []);

// Store URLs
const appStoreUrl = computed(() => iosMetadata.value?.url);
const googlePlayUrl = computed(() => androidMetadata.value?.url);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <NuxtLink to="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
      <BaseIcon name="arrow-left" size="md" class="mr-1" />
      Back to Dashboard
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <BaseSpinner size="md" />
    </div>

    <!-- Error -->
    <BaseAlert v-else-if="error" variant="error">
      {{ error.message }}
    </BaseAlert>

    <template v-else-if="app">
      <!-- App Header -->
      <BaseCard padding="lg" class="mb-6">
        <div class="flex items-start gap-6">
          <!-- App Icon -->
          <div
            class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100"
            :style="{ backgroundColor: app.primaryColor + '20' }"
          >
            <img
              v-if="iosMetadata?.icon || androidMetadata?.icon"
              :src="iosMetadata?.icon || androidMetadata?.icon"
              :alt="app.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl font-bold" :style="{ color: app.primaryColor }">
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
                <RatingStars v-if="iosMetadata?.score" :rating="iosMetadata.score" size="sm" />
                <span v-else class="text-gray-400 text-sm">No ratings</span>
              </div>
              <div class="flex items-center gap-2">
                <StoreIcon store="android" />
                <span class="font-medium">Android</span>
                <RatingStars v-if="androidMetadata?.score" :rating="androidMetadata.score" size="sm" />
                <span v-else class="text-gray-400 text-sm">No ratings</span>
              </div>
            </div>

            <!-- Versions -->
            <div class="mt-3 flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span class="font-medium">iOS:</span>
                {{ iosMetadata?.version || 'N/A' }}
              </div>
              <div>
                <span class="font-medium">Android:</span>
                {{ androidMetadata?.version || 'N/A' }}
              </div>
            </div>

            <!-- Store Links -->
            <div class="mt-4 flex items-center gap-4">
              <a
                v-if="appStoreUrl"
                :href="appStoreUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <StoreIcon store="ios" size="sm" />
                View on App Store
              </a>
              <a
                v-if="googlePlayUrl"
                :href="googlePlayUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <StoreIcon store="android" size="sm" />
                View on Google Play
              </a>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- iOS Section -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <StoreIcon store="ios" />
          App Store
        </h2>

        <template v-if="iosMetadata">
          <!-- Screenshots -->
          <BaseCard padding="lg" class="mb-4">
            <ScreenshotGallery :screenshots="iosScreenshots" />
          </BaseCard>

          <!-- App Details -->
          <BaseCard padding="lg" class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">App Details</h3>
            <dl class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <dt class="text-sm text-gray-500">Developer</dt>
                <dd class="font-medium">{{ iosMetadata.developer }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Version</dt>
                <dd class="font-medium">{{ iosMetadata.version }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Size</dt>
                <dd class="font-medium">{{ formatSize(iosMetadata.size) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Content Rating</dt>
                <dd class="font-medium">{{ iosMetadata.contentRating }}</dd>
              </div>
            </dl>
            <div v-if="iosMetadata.releaseNotes" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">What's New</h4>
              <p class="text-gray-600 text-sm whitespace-pre-line">{{ iosMetadata.releaseNotes }}</p>
            </div>
          </BaseCard>

          <!-- Reviews -->
          <BaseCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Reviews
              <span class="text-sm font-normal text-gray-500">({{ app.iosReviews.length }})</span>
            </h3>

            <div v-if="app.iosReviews.length === 0" class="text-gray-500 text-sm">
              No reviews available
            </div>
            <div v-else class="space-y-4 max-h-[500px] overflow-y-auto">
              <ReviewCard
                v-for="review in app.iosReviews"
                :key="review.id"
                :review="{ ...review, store: 'ios' }"
              />
            </div>
          </BaseCard>
        </template>
        <BaseCard v-else padding="lg">
          <p class="text-gray-500 text-sm">App Store data not available</p>
        </BaseCard>
      </div>

      <!-- Android Section -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <StoreIcon store="android" />
          Google Play
        </h2>

        <template v-if="androidMetadata">
          <!-- Screenshots -->
          <BaseCard padding="lg" class="mb-4">
            <ScreenshotGallery :screenshots="androidScreenshots" />
          </BaseCard>

          <!-- App Details -->
          <BaseCard padding="lg" class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">App Details</h3>
            <dl class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <dt class="text-sm text-gray-500">Developer</dt>
                <dd class="font-medium">{{ androidMetadata.developer }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Version</dt>
                <dd class="font-medium">{{ androidMetadata.version }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Size</dt>
                <dd class="font-medium">{{ formatSize(androidMetadata.size) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Content Rating</dt>
                <dd class="font-medium">{{ androidMetadata.contentRating }}</dd>
              </div>
            </dl>
            <div v-if="androidMetadata.recentChanges" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">What's New</h4>
              <p class="text-gray-600 text-sm whitespace-pre-line">{{ androidMetadata.recentChanges }}</p>
            </div>
          </BaseCard>

          <!-- Reviews -->
          <BaseCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Reviews
              <span class="text-sm font-normal text-gray-500">({{ app.androidReviews.length }})</span>
            </h3>

            <div v-if="app.androidReviews.length === 0" class="text-gray-500 text-sm">
              No reviews available
            </div>
            <div v-else class="space-y-4 max-h-[500px] overflow-y-auto">
              <ReviewCard
                v-for="review in app.androidReviews"
                :key="review.id"
                :review="{ ...review, store: 'android' }"
              />
            </div>
          </BaseCard>
        </template>
        <BaseCard v-else padding="lg">
          <p class="text-gray-500 text-sm">Google Play data not available</p>
        </BaseCard>
      </div>
    </template>
  </div>
</template>
