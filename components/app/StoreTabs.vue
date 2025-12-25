<script setup lang="ts">
import type { Store } from '~/types';

interface Props {
  modelValue: Store;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Store): void;
}>();

const tabs: { value: Store; label: string }[] = [
  { value: 'ios', label: 'App Store' },
  { value: 'android', label: 'Google Play' }
];
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="px-4 py-2 rounded-lg font-medium transition-colors"
      :class="modelValue === tab.value
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      @click="emit('update:modelValue', tab.value)"
    >
      <StoreIcon :store="tab.value" size="sm" class="inline mr-1" />
      {{ tab.label }}
    </button>
  </div>
</template>
