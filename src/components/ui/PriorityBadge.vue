<template>
  <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', classes[priority]]">
    <span class="w-1.5 h-1.5 rounded-full bg-current" />
    {{ labels[priority] }}
  </span>
</template>

<script setup lang="ts">
import type { Priority } from '@/types'

defineProps<{ priority: Priority }>()

const labels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

const classes: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}
</script>
