<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: false
});

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200"
    :class="[
      paddingClasses[props.padding],
      props.hover && 'hover:shadow-md transition-shadow'
    ]"
  >
    <slot />
  </div>
</template>
