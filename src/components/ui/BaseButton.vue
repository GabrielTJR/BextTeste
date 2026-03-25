<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, variantClasses[variant], sizeClasses[size]]"
    v-bind="$attrs"
  >
    <span
      v-if="loading"
      class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
})

const baseClasses = computed(
  () =>
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none'
)

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95',
  secondary: 'bg-dark text-white hover:bg-dark-light active:scale-95',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  ghost:
    'bg-transparent text-white border border-white hover:bg-dark hover:text-white active:scale-95',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}
</script>
