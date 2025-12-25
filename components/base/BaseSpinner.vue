<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'white' | 'gray';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'green'
});

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4'
};

const colorClasses = {
  green: 'border-green-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent'
};
</script>

<template>
  <div
    class="animate-spin rounded-full"
    :class="[sizeClasses[props.size], colorClasses[props.color]]"
  />
</template>
