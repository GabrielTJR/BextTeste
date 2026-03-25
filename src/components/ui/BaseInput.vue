<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-white">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 text-sm bg-white border rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
        'placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
      ]"
    />
    <div v-if="maxlength" class="flex justify-end">
      <span
        class="text-xs"
        :class="modelValue.length >= Number(maxlength) ? 'text-red-400' : 'text-white'"
      >
        {{ modelValue.length }}/{{ maxlength }}
      </span>
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-white">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  id?: string
  maxlength?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 7)}`)
</script>
