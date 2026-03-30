<template>
  <div class="flex flex-col gap-3 h-full min-h-0">
    <div class="flex items-center justify-between gap-3 p-2 pb-0">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-semibold text-white">{{ categoryMeta[category].label }}</h2>
        <PriorityBadge v-if="priority !== 'all'" :priority="priority" />
      </div>
      <div class="flex hidden md:flex items-center bg-secondary/50 rounded-lg p-1">
        <button
          @click="$emit('changeMode', 'list')"
          class="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 bg-card text-foreground shadow-sm"
          :class="showMode === 'list' ? 'bg-[var(--color-back-card)] text-white border-dark' : ''"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-list w-4 h-4"
            aria-hidden="true"
          >
            <path d="M3 5h.01"></path>
            <path d="M3 12h.01"></path>
            <path d="M3 19h.01"></path>
            <path d="M8 5h13"></path>
            <path d="M8 12h13"></path>
            <path d="M8 19h13"></path>
          </svg></button
        ><button
          @click="$emit('changeMode', 'grid')"
          class="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 text-muted-foreground hover:text-foreground"
          :class="showMode === 'grid' ? 'bg-[var(--color-back-card)] text-white border-dark' : ''"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-grid3x3 lucide-grid-3x3 w-4 h-4"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </button>
      </div>
      <span class="px-2 py-0.5 text-white text-xs font-mono"> Total: {{ tasks.length }} </span>
    </div>

    <div
      v-if="tasks.length === 0"
      class="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-gray-200 text-center"
    >
      <p class="text-sm text-gray-400">Nenhuma tarefa nesta categoria/prioridade</p>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="px-4 pb-3 pt-1">
        <TransitionGroup
          name="slide-up"
          tag="div"
          :class="
            showMode === 'list'
              ? 'flex flex-col gap-2'
              : 'flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-3'
          "
        >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import PriorityBadge from '../ui/PriorityBadge.vue'
import TaskCard from './TaskCard.vue'
import type { Task, Category, Priority, ShowMode } from '@/types'

defineProps<{
  priority: Priority | 'all'
  category: Category
  tasks: Task[]
  showMode: ShowMode
}>()

defineEmits<{
  view: [task: Task]
  edit: [task: Task]
  delete: [id: string]
  toggle: [id: string]
  changeMode: [value: ShowMode]
}>()

const categoryMeta: Record<Category, { label: string }> = {
  all: { label: 'Todas' },
  health: { label: 'Saúde' },
  work: { label: 'Trabalho' },
  study: { label: 'Estudo' },
}
</script>
