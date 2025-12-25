<script setup lang="ts">
interface Props {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  maxRating: 5,
  size: 'md'
});

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl'
};

const fullStars = computed(() => Math.floor(props.rating));
const hasHalfStar = computed(() => props.rating % 1 >= 0.5);
const emptyStars = computed(() => props.maxRating - fullStars.value - (hasHalfStar.value ? 1 : 0));
</script>

<template>
  <div class="flex items-center gap-0.5" :class="sizeClasses[size]">
    <!-- Full stars -->
    <span v-for="i in fullStars" :key="`full-${i}`" class="text-yellow-400">★</span>
    <!-- Half star -->
    <span v-if="hasHalfStar" class="text-yellow-400">★</span>
    <!-- Empty stars -->
    <span v-for="i in emptyStars" :key="`empty-${i}`" class="text-gray-300">★</span>
    <!-- Numeric rating -->
    <span class="ml-1 text-gray-600 text-sm font-medium">{{ rating.toFixed(1) }}</span>
  </div>
</template>
