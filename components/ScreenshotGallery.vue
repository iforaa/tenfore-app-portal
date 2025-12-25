<script setup lang="ts">
interface Props {
  screenshots: string[];
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Screenshots'
});
</script>

<template>
  <div v-if="screenshots.length > 0">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ title }}</h3>

    <!-- Thumbnail strip only -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <div
        v-for="(screenshot, index) in screenshots"
        :key="index"
        class="flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
      >
        <img
          :src="screenshot"
          :alt="`Screenshot ${index + 1}`"
          class="h-40 w-auto object-contain bg-gray-100"
        />
      </div>
    </div>
  </div>
  <div v-else class="text-gray-500 text-sm">
    No screenshots available
  </div>
</template>
