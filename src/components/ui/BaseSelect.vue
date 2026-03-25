<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="selectId" class="text-sm font-medium text-white">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <select
      :id="selectId"
      v-model="model"
      :required="required"
      :disabled="disabled"
      class="shadow-white shadow-md"
      :class="[
        'w-full px-3 py-2 text-sm bg-white border rounded-lg transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        error ? 'border-red-400' : 'border-gray-300',
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectId = computed(() => props.id || `select-${Math.random().toString(36).slice(2, 7)}`)
</script>
