<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-semibold text-white">{{ categoryMeta[category].label }}</h2>
        <PriorityBadge v-if="priority !== 'all'" :priority="priority" />
      </div>
      <span class="px-2 py-0.5 text-white text-xs font-mono"> Total: {{ tasks.length }} </span>
    </div>

    <div
      v-if="tasks.length === 0"
      class="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-gray-200 text-center"
    >
      <p class="text-sm text-gray-400">Nenhuma tarefa nesta categoria</p>
    </div>

    <TransitionGroup name="slide-up" tag="div" class="flex flex-col gap-2">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import PriorityBadge from '../ui/PriorityBadge.vue'
import TaskCard from './TaskCard.vue'
import type { Task, Category, Priority } from '@/types'

defineProps<{
  priority: Priority | 'all'
  category: Category
  tasks: Task[]
}>()

defineEmits<{
  view: [task: Task]
  edit: [task: Task]
  delete: [id: string]
  toggle: [id: string]
}>()

const categoryMeta: Record<Category, { label: string }> = {
  all: { label: 'Todas' },
  health: { label: 'Saúde' },
  work: { label: 'Trabalho' },
  study: { label: 'Estudo' },
}
</script>
