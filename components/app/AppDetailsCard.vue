<script setup lang="ts">
import type { AppStoreMetadata, GooglePlayMetadata } from '~/types';

interface Props {
  metadata: AppStoreMetadata | GooglePlayMetadata | null | undefined;
}

const props = defineProps<Props>();

const releaseNotes = computed(() => {
  if (!props.metadata) return null;
  // AppStore uses releaseNotes, GooglePlay uses recentChanges
  return 'releaseNotes' in props.metadata
    ? props.metadata.releaseNotes
    : 'recentChanges' in props.metadata
      ? props.metadata.recentChanges
      : null;
});
</script>

<template>
  <BaseCard v-if="metadata" padding="lg">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">App Details</h3>
    <dl class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <dt class="text-sm text-gray-500">Developer</dt>
        <dd class="font-medium">{{ metadata.developer }}</dd>
      </div>
      <div>
        <dt class="text-sm text-gray-500">Version</dt>
        <dd class="font-medium">{{ metadata.version }}</dd>
      </div>
      <div>
        <dt class="text-sm text-gray-500">Size</dt>
        <dd class="font-medium">{{ metadata.size }}</dd>
      </div>
      <div>
        <dt class="text-sm text-gray-500">Content Rating</dt>
        <dd class="font-medium">{{ metadata.contentRating }}</dd>
      </div>
    </dl>

    <div v-if="releaseNotes" class="mt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">What's New</h4>
      <p class="text-gray-600 text-sm whitespace-pre-line">
        {{ releaseNotes }}
      </p>
    </div>
  </BaseCard>
</template>
