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
            <div class="flex items-center justify-between p-4 pb-0 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-dark">{{ title }}</h2>
            </div>

            <div class="px-6 pb-4 max-h-[75vh] overflow-y-auto">
              <slot />
            </div>

            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
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
