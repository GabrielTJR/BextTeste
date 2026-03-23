<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <Transition name="slide-up">
          <div
            v-if="modelValue"
            class="relative z-10 w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            :class="sizeClasses[size]"
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-dark">{{ title }}</h2>
              <button
                class="p-1.5 rounded-lg text-gray-400 hover:text-dark hover:bg-gray-100 transition-colors"
                @click="$emit('update:modelValue', false)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 max-h-[80vh] overflow-y-auto">
              <slot />
            </div>

            <div v-if="$slots.footer" class="footer px-6 py-4 border-t border-gray-100 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), { size: 'md' })
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}
</script>
