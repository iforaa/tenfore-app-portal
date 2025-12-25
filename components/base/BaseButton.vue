<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantClasses = {
  primary: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]"
    :disabled="props.disabled || props.loading"
    @click="handleClick"
  >
    <BaseSpinner
      v-if="props.loading"
      size="sm"
      :color="props.variant === 'primary' ? 'white' : 'gray'"
      class="mr-2"
    />
    <slot />
  </button>
</template>
