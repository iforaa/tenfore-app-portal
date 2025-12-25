<script setup lang="ts">
interface Props {
  variant?: 'error' | 'warning' | 'success' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'error'
});

const variantClasses = {
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700'
};
</script>

<template>
  <div
    class="rounded-lg border p-4"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </div>
</template>
